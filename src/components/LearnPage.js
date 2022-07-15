import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { last, getItemById, replaceItemById } from '@dwidge/lib/array'

const calcNext = (views) =>
	views && views.length ? (last(views).next) : 0

const calcInterval = (views) =>
	views.length ? (last(views).next - last(views).date) : 0

const calcLevel = interval =>
	(interval / (24 * 60 * 60) + 0.0) | 0

const sortPairsByNextAsc = list =>
	list.sort((a, b) => calcNext(a.views) - calcNext(b.views))

const filterPairsByReviewDate = (list, date) =>
	list.filter(a => calcNext(a.views) !== 0 && calcNext(a.views) <= date)

const filterPairsByUnlearned = (list) =>
	list.filter(a => a.views.length === 0)

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
	const level = calcLevel(calcInterval(views))

	const days = (2 * level || 1)
	const scoreChoices = [
		[5, '5s'],
		[60, '1m'],
		[(24 * 60 * 60) * (days - 0.1), days + 'd'],
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

	const reviewPairs = sortPairsByNextAsc(filterPairsByReviewDate(getlistPairs, now))
	const newPairs = filterPairsByUnlearned(getlistPairs)
	const listPairsSorted = reviewPairs.concat(newPairs)

	if (listPairsSorted.length && !currentId) { setcurrentId(listPairsSorted[0].id) }

	const pair = getItemById(getlistPairs, currentId)

	const onUpdate = (pair) => {
		setlistPairs(replaceItemById(getlistPairs, pair))
		setcurrentId(0)
	}

	const printPairs = list =>
		list.map(({ id, front, views }) => (<p key={id}>{front} - interval {calcInterval(views)}</p>))

	return (
		<div>
			<h3>Learn</h3>
			<div>
				<details><summary>{reviewPairs.length} review pairs.</summary>
					{printPairs(reviewPairs)}
				</details>
				<details><summary>{newPairs.length} new pairs.</summary>
					{printPairs(newPairs)}
				</details>
			</div>
			<LearnPair pair={pair} onUpdate={onUpdate} now={now} />
		</div>
	)
}

LearnPage.propTypes = {
	listPairs: PropTypes.array.isRequired,
	now: PropTypes.number.isRequired,
}

export default LearnPage
