import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getItemById, replaceItemById } from "@dwidge/lib";
import {
  groupSort,
  reschedule,
  randomAsc,
  firstNshuffled,
  nextGap,
  calcInterval,
  gaps,
} from "../lib/pairs";
import { getSecond, getDaysFromSeconds, calcFirstDate } from "../lib/time";

export default function ManageProgress({
  listPairs: [getlistPairs, setlistPairs],
  progress: [progress, setProgress],
}) {
  function convertV1() {
    const firstSecond = calcFirstDate(getlistPairs) ?? 0;
    const firstDay = getDaysFromSeconds(firstSecond);
    console.log({ firstSecond });

    const calcDate = (dateSec) =>
      dateSec ? getDaysFromSeconds(dateSec - firstSecond) : 0;
    const calcLevel = (diff) => {
      const i = gaps.concat(10000000).findIndex((g) => diff <= g);
      console.log({ gaps, diff, i });
      return i;
      return i < 0 ? gaps.length : i;
    };
    const convert = (dateSec, nextSec) => [
      calcLevel(nextSec - dateSec),
      calcDate(nextSec),
    ];

    const n = progress.list.length;
    const oldChunk = getlistPairs.slice(n, n + 50);
    console.log(n, getlistPairs.length, oldChunk.length);
    const newChunk = oldChunk.map(
      ({ views: [{ date = 0, next = 0 } = {}] = [] }) =>
        next ? convert(date | 0, next | 0) : [0, 0],
    );

    setProgress({
      day: firstDay,
      list: progress.list.concat(newChunk),
    });
    console.log(newChunk);
  }
  function reset(pairs = []) {
    setProgress({
      day: getDaysFromSeconds(getSecond()),
      list: pairs.map((o) => [0, 0]),
    });
  }

  return (
    <div>
      <p>getlistPairs: {getlistPairs.length}</p>
      <p>progress: {progress.list.length}</p>
      <button onClick={convertV1}>
        Add {getlistPairs.length - progress.list.length}
      </button>
      <button onClick={() => reset(getlistPairs)}>
        Reset {getlistPairs.length}
      </button>
      <button onClick={() => reset()}>Reset {0}</button>
    </div>
  );
}

ManageProgress.propTypes = {
  listPairs: PropTypes.array.isRequired,
  progress: PropTypes.array.isRequired,
};
