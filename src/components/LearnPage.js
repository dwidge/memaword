import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { getItemById, replaceItemById } from '@dwidge/lib/array'
import { calcInterval, ascPairsNext, isDateBeforePairNext, isDateAfterPairNext, isPairUnlearned } from '../lib/pairs'

const NoPairs = () => {
	return <div>None to review.</div>
}

const TestPair = ({ pair, onShow }) => {
	const { front } = pair

	return (
		<div>
			<h3 data-testid="front">{front}</h3>
			<button data-testid="buttonShow" onClick={onShow}>Show</button>
		</div>
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
	const mins = 2 * ((gap / secondsPerMin) | 0) || 1

	const scoreChoices = [
		[5, '5s'],
		[secondsPerMin * (mins - 0.1), mins + 'm'],
		[secondsPerDay * (days - 0.1), days + 'd'],
	]

	return (
		<div>
			<h3 data-testid="front">{front}</h3>
			<h3 data-testid="back">{back}</h3>
			<pair-choices>
				{scoreChoices.map(([time, label], i) =>
					<button key={i} data-testid={'buttonX' + i} onClick={() => onScore(time)}>{label}</button>,
				)}
			</pair-choices>
		</div>
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

	const reviewPairs = getlistPairs.filter(isDateAfterPairNext(now)).sort(ascPairsNext)
	const oldPairs = getlistPairs.filter(isDateBeforePairNext(now)).sort(ascPairsNext)
	const newPairs = getlistPairs.filter(isPairUnlearned)
	const listPairsSorted = reviewPairs.concat(newPairs)

	if (listPairsSorted.length && !currentId) { setcurrentId(listPairsSorted[0].id) }

	const pair = getItemById(getlistPairs, currentId)

	const onUpdate = (pair) => {
		setlistPairs(replaceItemById(getlistPairs, pair).sort(ascPairsNext))
		setcurrentId(0)
	}

	return (
		<div>
			<h3>Learn</h3>
			<p>{reviewPairs.length} review / {newPairs.length} new / {oldPairs.length} old</p>
			<LearnPair pair={pair} onUpdate={onUpdate} now={now} />
		</div>
	)
}

LearnPage.propTypes = {
	listPairs: PropTypes.array.isRequired,
	now: PropTypes.number.isRequired,
}

export default LearnPage
