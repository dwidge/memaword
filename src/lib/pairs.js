import { last } from '@dwidge/lib'

export const calcNext = (views) =>
	views && views.length ? (last(views).next) : 0

export const calcInterval = (views) =>
	views.length ? (last(views).next - last(views).date) : 0

export const descNext = (a, b) =>
	calcNext(b.views) - calcNext(a.views)

export const ascInterval = (a, b) =>
	calcInterval(a.views) - calcInterval(b.views)

export const ascIntervalDescNext = (a, b) =>
	ascInterval(a, b) || descNext(a, b)

export const isDateBeforeNext = date => a => calcNext(a.views) !== 0 && date <= calcNext(a.views)

export const isDateAfterNext = date => a => calcNext(a.views) !== 0 && date > calcNext(a.views)

export const isUnlearned = a => a.views.length === 0

export const groupSort = (list, now) => ({
	review: list.filter(isDateAfterNext(now)).sort(descNext),
	new: list.filter(isUnlearned),
	old: list.filter(isDateBeforeNext(now)).sort(descNext),
})
