import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { getItemById, replaceItemById, printSecondsRounded } from '@dwidge/lib'
import { calcInterval, groupSort } from '../lib/pairs'

const NoPairs = () => {
	return <pair-div>None to review.</pair-div>
}

const TestPair = ({ pair, onShow }) => {
	const { front } = pair

	return (
		<pair-div>
			<pair-front data-testid="front">{front}</pair-front>
			<button data-testid="buttonShow" onClick={onShow}>Show</button>
		</pair-div>
	)
}

TestPair.propTypes = {
	pair: PropTypes.object.isRequired,
	onShow: PropTypes.func.isRequired,
}

const ShowPair = ({ pair, onScore }) => {
	const { front, back, views } = pair

	const secondsPerMin = 60
	const secondsPerDay = 24 * 60 * 60
	const gap = calcInterval(views)

	const days = 2 * ((gap / secondsPerDay) | 0) || 1
	const mins = 2 * Math.min(secondsPerDay / secondsPerMin / 4, (gap / secondsPerMin) | 0) || 1

	const scoreChoices = [
		[10, '10s', 'red'],
		[secondsPerMin * (mins), printSecondsRounded(secondsPerMin * (mins)), 'orange'],
		[secondsPerDay * (days), printSecondsRounded(secondsPerDay * (days)), 'green'],
	]

	return (
		<pair-div>
			<pair-front data-testid="front">{front}</pair-front>
			<pair-back data-testid="back">{back}</pair-back>
			<pair-choices>
				{scoreChoices.map(([time, label, color], i) =>
					<button key={i} data-testid={'buttonX' + i} style={{ background: color }} onClick={() => onScore(time)}>{label}</button>,
				)}
			</pair-choices>
		</pair-div>
	)
}

ShowPair.propTypes = {
	pair: PropTypes.shape({
		front: PropTypes.string,
		back: PropTypes.string,
		views: PropTypes.array,
	}).isRequired,
	onScore: PropTypes.func.isRequired,
}

const LearnPair = ({ pair, onUpdate, now }) => {
	const [show, setshow] = useState(false)

	const onShow = () => {
		setshow(true)
	}

	const onScore = (t) => {
		const viewnow = { date: now, next: now + t }
		const pairupdated = { ...pair, views: pair.views.concat(viewnow) }
		onUpdate(pairupdated)
		setshow(false)
	}

	if (pair) {
		if (show) { return <ShowPair pair={pair} onScore={onScore}/> } else { return <TestPair pair={pair} onShow={onShow}/> }
	} else { return <NoPairs/> }
}

LearnPair.propTypes = {
	pair: PropTypes.shape({
		front: PropTypes.string,
		back: PropTypes.string,
		views: PropTypes.array,
	}),
	onUpdate: PropTypes.func.isRequired,
	now: PropTypes.number.isRequired,
}

const LearnPage = ({ listPairs, now }) => {
	const [getlistPairs, setlistPairs] = listPairs
	const [currentId, setcurrentId] = useState(0)

	const groups = groupSort(getlistPairs, now)
	const learnList = groups.review.concat(groups.new)

	if (learnList.length && !currentId) { setcurrentId(learnList[0].id) }

	const pair = getItemById(getlistPairs, currentId)

	const onUpdate = (pair) => {
		setlistPairs(replaceItemById(getlistPairs, pair))
		setcurrentId(0)
	}

	return (
		<div>
			<h3>Learn</h3>
			<p>{groups.review.length} review / {groups.new.length} new / {groups.old.length} old</p>
			<LearnPair pair={pair} onUpdate={onUpdate} now={now} />
		</div>
	)
}

LearnPage.propTypes = {
	listPairs: PropTypes.array.isRequired,
	now: PropTypes.number.isRequired,
}

export default LearnPage
