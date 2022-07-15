import { last } from '@dwidge/lib/array'

export const calcNext = (views) =>
	views && views.length ? (last(views).next) : 0

export const calcInterval = (views) =>
	views.length ? (last(views).next - last(views).date) : 0

export const ascPairsNext = (a, b) =>
	calcNext(a.views) - calcNext(b.views)

export const isDateBeforePairNext = date => a => calcNext(a.views) !== 0 && date <= calcNext(a.views)

export const isDateAfterPairNext = date => a => calcNext(a.views) !== 0 && date > calcNext(a.views)

export const isPairUnlearned = a => a.views.length === 0
