import { least, daysSeconds, secondsDays, secondsPerDay } from "./lib.js";

const hexInt = (i) => (i | 0).toString(16);

const intHex = (h) => parseInt(h, 16);

const strItem = (item) => item.map(hexInt).join(",");

const itemStr = (str) => str.split(",").map(intHex);

const strList = (list) => list.map(strItem).join(" ");

const listStr = (str) => str.split(" ").map(itemStr);

export const calcProgressStr = (str = "") => {
  const [[startDay = 0], ...list] = listStr(str);
  return list.map(([level, day, sec = 0]) => [
    level,
    secondsDays(day + startDay) + sec,
  ]);
};

export const calcStrProgress = (list) => {
  const startSeconds = list
    .map(([level, next]) => +next)
    .reduce(least, Infinity);
  const relativeList = list.map(([level, next]) => [
    level,
    daysSeconds(next - startSeconds),
    (next - startSeconds) % secondsPerDay,
  ]);
  return strList([[daysSeconds(startSeconds)], ...relativeList]);
};

export const useSimpleProgressStr = ([str, setStr]) => {
  const progress = calcProgressStr(str);
  const setProgress = (list) => setStr(calcStrProgress(list));
  return [progress, setProgress];
};

export const useProgressStr = ([str, setStr]) => {
  const [simple, setSimple] = useSimpleProgressStr([str, setStr]);
  return [{ list: simple, day: 0 }, ({ list, day }) => setSimple(list)];
};
