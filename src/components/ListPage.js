import React from 'react'
import PropTypes from 'prop-types'
import { ascPairsNext, isDateBeforePairNext, isDateAfterPairNext, isPairUnlearned } from '../lib/pairs'
import { Pair } from './Pair'

const ListPage = ({ listPairs, now }) => {
	const [getlistPairs, setlistPairs] = listPairs

	const reviewPairs = getlistPairs.filter(isDateAfterPairNext(now)).sort(ascPairsNext)
	const oldPairs = getlistPairs.filter(isDateBeforePairNext(now)).sort(ascPairsNext)
	const newPairs = getlistPairs.filter(isPairUnlearned)

	const onClear = () => {
		if (window.confirm('Clear database?')) { setlistPairs([]) }
	}

	return (
		<div>
			<h3>List</h3>
			<div>
				<details><summary>{reviewPairs.length} review pairs.</summary>
					{reviewPairs.map(pair => Pair({ now, pair }))}
				</details>
				<details><summary>{newPairs.length} new pairs.</summary>
					{newPairs.map(pair => Pair({ now, pair }))}
				</details>
				<details><summary>{oldPairs.length} old pairs.</summary>
					{oldPairs.map(pair => Pair({ now, pair }))}
				</details>
			</div>
			<button data-testid="buttonClear" onClick={onClear}>Clear</button>
		</div>
	)
}

ListPage.propTypes = {
	listPairs: PropTypes.array.isRequired,
	now: PropTypes.number.isRequired,
}

export default ListPage
