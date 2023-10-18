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
import { getStep } from "../lib/time";

const MatchPage = ({
  listPairs: [getlistPairs, setlistPairs],
  progress: [progress, setProgress] = [],
  now = 0,
}) => {
  if (!progress) return <pre>Loading...</pre>;

  return (
    <Match
      listPairs={[getlistPairs, setlistPairs]}
      progress={[progress, setProgress]}
      now={now}
    />
  );
};

const Match = ({
  listPairs: [getlistPairs, setlistPairs],
  progress: [progress, setProgress] = [],
  now = 0,
}) => {
  // const groups = groupSort(getlistPairs, now);
  const combinedPairs = getlistPairs.map((p, i) => ({
    ...p,
    i,
    progress: progress.list[i],
  }));
  const groups = groupSort(combinedPairs, now);

  const learnList = groups.review.concat(groups.new);

  const [init, setinit] = useState(0);
  const [n, setn] = useState(4);
  const [sizeFront, setsizeFront] = useState(2);
  const [sizeBack, setsizeBack] = useState(2);

  const [frontInd, setfrontInd] = useState();
  const [backInd, setbackInd] = useState();
  const [nextT, setNextT] = useState();

  const resetList = () => {
    if (!learnList.length) return { front: [], back: [], question: [] };

    const front = learnList[0];
    const back = learnList
      .slice(1)
      .filter((o) => o.back !== front.back)
      .slice(0, n - 1);

    //if(back.length <2) return
    if (!front) return;

    const question = [front];
    const options = [front, ...back].sort(randomAsc);

    return Math.random() > 0.5
      ? { front: question, back: options, question }
      : { back: question, front: options, question };
  };
  const [list, setlist] = useState(resetList());
  useEffect(() => {
    const l = resetList();
    setlist(l);
    if (!l) return;
    if (l.question[0]) setNextT(nextGap(calcInterval(l.question[0].views)));
    if (l.front.length === 1) setfrontInd(l.front[0].id);
    else if (l.back.length === 1) setbackInd(l.back[0].id);
  }, [n, init]);

  const checkAnswer = (frontInd, backInd) => {
    console.log("checkAnswer1", frontInd, backInd);
    if (frontInd && backInd) {
      if (frontInd === backInd) {
        onReschedule([frontInd], nextT);

        setfrontInd();
        setbackInd();

        setinit(init + 1);
      } else {
        setNextT(0);
        onReschedule([frontInd, backInd], 0);
      }
    }
  };

  const onReschedule = (ids, t) => {
    onUpdates(
      ids.map((id) => reschedule(getItemById(getlistPairs, id), t, now)),
    );
  };

  const calcLevel = (diff) => gaps.findIndex((g) => diff / 1000 <= g);

  const setArrayIndexValue = (a, index, value) =>
    a.map((v, i) => (i === index ? value : v));

  const getUpdateFromPair = (pair) => {
    const index = getlistPairs.findIndex((o) => o.id === pair.id);
    const [{ date, next }] = pair.views;
    console.dir({ index, date, next, pair });
    const reset = date == next;
    return { index, reset };
  };

  const getMemoExpiry = (now, stepIndex) => now + getStep(stepIndex);

  const updateProgress = (progress, { index, reset }) => {
    const oldProgress = progress.list[index];
    const [stepIndex] = oldProgress;

    const expirySecond = getMemoExpiry(now, stepIndex);
    const newProgress = [reset ? 0 : stepIndex + 1, expirySecond];

    return {
      ...progress,
      list: setArrayIndexValue(progress.list, index, newProgress),
    };
  };

  const onUpdates = (pairs) => {
    if (!progress) return;
    console.log("onUpdates", progress.list.length, getlistPairs.length);

    if (progress.list.length !== getlistPairs.length) return;
    console.log("getUpdateFromPair", pairs.map(getUpdateFromPair));

    setProgress(pairs.map(getUpdateFromPair).reduce(updateProgress, progress));
    return;

    setlistPairs(
      pairs.reduce(
        (getlistPairs, pair) => replaceItemById(getlistPairs, pair),
        getlistPairs,
      ),
    );
  };

  const normal = {
    display: "inline-block",
    fontSize: sizeFront + "em",
    padding: "0.2em",
    margin: "0.2em",
  };
  const highlight = { ...normal, background: "grey" };

  if (!list) return;

  return (
    <div data-testid="pageMatch">
      <h3>Match</h3>
      <p>Choose the easiest pair.</p>
      <p>
        Pairs{" "}
        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={n}
          onChange={(e) => setn(+e.target.value)}
        />{" "}
        {n}
      </p>
      <pair-div>
        {list.front.map(({ id, front, back }) => (
          <pair-front
            key={id}
            style={{
              ...(frontInd === id ? highlight : normal),
              fontSize: sizeFront + "em",
            }}
            onClick={() => {
              setfrontInd((v) => v !== id && id);
              checkAnswer(id, backInd);
            }}
          >
            {front}
          </pair-front>
        ))}
        <p>
          Size{" "}
          <input
            type="range"
            min="0.5"
            max="4"
            step=".5"
            value={sizeFront}
            onChange={(e) => setsizeFront(e.target.value)}
          />{" "}
          {sizeFront}
        </p>
        <hr />
        {list.back.map(({ id, front, back }) => (
          <pair-back
            key={id}
            style={{
              ...(backInd === id ? highlight : normal),
              fontSize: sizeBack + "em",
            }}
            onClick={() => {
              setbackInd((v) => v !== id && id);
              checkAnswer(frontInd, id);
            }}
          >
            {back}
          </pair-back>
        ))}
        <p>
          Size{" "}
          <input
            type="range"
            min="0.5"
            max="4"
            step=".5"
            value={sizeBack}
            onChange={(e) => setsizeBack(e.target.value)}
          />{" "}
          {sizeBack}
        </p>
      </pair-div>
    </div>
  );
};

MatchPage.propTypes = {
  listPairs: PropTypes.array.isRequired,
};

export default MatchPage;
