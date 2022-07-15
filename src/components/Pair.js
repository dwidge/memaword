import React from 'react'
import PropTypes from 'prop-types'
import { last } from '@dwidge/lib/array'
import { printSecondsRounded } from '@dwidge/lib/date'
import { calcInterval } from '../lib/pairs'

export const Pair = ({ now, pair }) => {
	const { id, front, back, views } = pair
	return (<li key={id}>
		<pair-front>{front}</pair-front> = <pair-back>{back}</pair-back> / <pair-next>{last(views) ? printSecondsRounded((last(views).next) - now) : '-'}</pair-next> / <pair-interval>{last(views) ? printSecondsRounded(calcInterval(views)) : '-'}</pair-interval>
	</li>)
}

Pair.propTypes = {
	pair: PropTypes.shape({
		id: PropTypes.number.isRequired,
		front: PropTypes.string,
		back: PropTypes.string,
		views: PropTypes.array,
	}).isRequired,
	now: PropTypes.number.isRequired,
}
