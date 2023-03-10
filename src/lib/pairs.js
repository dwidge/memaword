import { last } from "@dwidge/lib";

export const calcNext = (views) =>
  views && views.length ? last(views).next : 0;

export const calcInterval = (views) =>
  views.length ? last(views).next - last(views).date : 0;

export const descNext = (a, b) => calcNext(b.views) - calcNext(a.views);

export const ascInterval = (a, b) =>
  calcInterval(a.views) - calcInterval(b.views);

export const ascIntervalDescNext = (a, b) =>
  ascInterval(a, b) || descNext(a, b);

export const isDateBeforeNext = (date) => (a) =>
  calcNext(a.views) !== 0 && date <= calcNext(a.views);

export const isDateAfterNext = (date) => (a) =>
  calcNext(a.views) !== 0 && date > calcNext(a.views);

export const isUnlearned = (a) => a.views.length === 0;

export const groupSort = (list, now) => ({
  review: list.filter(isDateAfterNext(now)).sort(ascIntervalDescNext),
  new: list.filter(isUnlearned),
  old: list.filter(isDateBeforeNext(now)).sort(descNext),
});

const gaps = [1, 2, 3, 60, 60 * 60, 60 * 60 * 12, 60 * 60 * 24 * 2];

export const nextGap = (gap) => gaps.find((g) => g > gap) || gap * 2;

export const prevGap = (gap) => gaps.find((g) => g < gap) || (gap / 2) | 0;

const keepHistory = false;

export const reschedule = (
  pair,
  t = nextGap(calcInterval(pair.views)),
  now
) => {
  const viewnow = { date: now, next: now + t };
  console.log({ viewnow }, t);
  return {
    ...pair,
    views: keepHistory ? pair.views.concat(viewnow) : [viewnow],
  };
};

export const randomAsc = () => 0.5 - Math.random();

export const firstNshuffled = (a, n = 5) =>
  a
    .slice(0, n * 2)
    .sort(randomAsc)
    .slice(0, n);
