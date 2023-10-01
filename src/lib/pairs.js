import { last } from "@dwidge/lib";
import {getDaysOfSeconds} from './time.js'

export const calcNext = (views) =>
  views && views.length ? last(views).next : 0;

export const calcInterval = (views) =>
  views.length ? last(views).next - last(views).date : 0;

export const descNext = (a, b) => calcNext(b.views) - calcNext(a.views);

export const ascInterval = (a, b) =>
  calcInterval(a.views) - calcInterval(b.views);

export const ascIntervalDescNext = (a, b) =>
  ascInterval(a, b) || descNext(a, b);
/*
export const isDateBeforeNext = (date) => (a) =>
  calcNext(a.views) !== 0 && date <= calcNext(a.views);

export const isDateAfterNext = (date) => (a) =>
  calcNext(a.views) !== 0 && date > calcNext(a.views);

export const isUnlearned = (a) => a.views.length === 0;
*/

export const descDay = (a, b) => b.progress[1] - a.progress[1];

export const ascLevelDescDay = (a, b) =>
  a.progress[0] - b.progress[0] || b.progress[1] - a.progress[1];

export const isPending =
  (today) =>
  (x) =>{
console.log('x111111',x)
const { views: [{date,next}]=[{}] }=x
const level=date?1:0,day=getDaysOfSeconds(next)
 return   level > 0 && day <= today;
}
export const isPending2 =
  (today) =>
  (x) =>{
console.log('x1',x)
const { progress: [level, day] }=x
 return   level > 0 && day <= today;
}

export const isDone =
  (today) =>
  ({ progress: [level, day] }) =>
    level > 0 && day > today;

export const isNew =
  (today) =>
  ({ progress: [level] }) =>
    level === 0;

export const groupSort = (list, today) => ({
  review: list.filter(isPending(today)).sort(ascLevelDescDay),
  new: list.filter(isNew(today)),
  old: list.filter(isDone(today)).sort(descDay),
});

export const gaps = [1, 2, 3, 60, 60 * 60, 60 * 60 * 12, 60 * 60 * 24 * 2];

export const nextGap = (gap) => gaps.find((g) => g > gap) || gap * 2;

export const prevGap = (gap) => gaps.find((g) => g < gap) || (gap / 2) | 0;

const keepHistory = false;

export const reschedule = (
  pair,
  t = nextGap(calcInterval(pair.views)),
  now
) => {
  const viewnow = { date: now, next: now + t };
  //console.log({ viewnow }, t);
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
