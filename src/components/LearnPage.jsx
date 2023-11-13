import React, { useState } from "react";
import PropTypes from "prop-types";
import { getItemById, replaceItemById, printSecondsRounded } from "@dwidge/lib";
import { calcInterval, groupSort, reschedule } from "../lib/pairs";

const NoPairs = () => {
  return <pair-div>None to review.</pair-div>;
};

const TestPair = ({ pair, choices, onShow }) => {
  const { front } = pair;

  return (
    <pair-div>
      <pair-front data-testid="front">{front}</pair-front>
      {choices.map((v) => (
        <div key={v}>{v}</div>
      ))}
      <button data-testid="buttonShow" onClick={onShow}>
        Show
      </button>
    </pair-div>
  );
};

TestPair.propTypes = {
  pair: PropTypes.object.isRequired,
  choices: PropTypes.array.isRequired,
  onShow: PropTypes.func.isRequired,
};

const ShowPair = ({ pair, onScore }) => {
  const { front, back, views } = pair;

  const secondsPerMin = 60;
  const secondsPerDay = 24 * 60 * 60;
  const gap = calcInterval(views);

  const days = 2 * ((gap / secondsPerDay) | 0) || 1;
  const mins =
    2 *
      Math.min(secondsPerDay / secondsPerMin / 4, (gap / secondsPerMin) | 0) ||
    1;

  const scoreChoices = [
    [10, "10s", "red"],
    [secondsPerMin * mins, printSecondsRounded(secondsPerMin * mins), "orange"],
    [secondsPerDay * days, printSecondsRounded(secondsPerDay * days), "green"],
  ];

  return (
    <pair-div>
      <pair-front data-testid="front">{front}</pair-front>
      <pair-back data-testid="back">{back}</pair-back>
      <pair-choices>
        {scoreChoices.map(([time, label, color], i) => (
          <button
            key={i}
            data-testid={"buttonX" + i}
            style={{ background: color }}
            onClick={() => onScore(time)}
          >
            {label}
          </button>
        ))}
      </pair-choices>
    </pair-div>
  );
};

ShowPair.propTypes = {
  pair: PropTypes.shape({
    front: PropTypes.string,
    back: PropTypes.string,
    views: PropTypes.array,
  }).isRequired,
  onScore: PropTypes.func.isRequired,
};

const LearnPair = ({ pair, choices, onUpdate, now }) => {
  const [show, setshow] = useState(false);

  const onShow = () => {
    setshow(true);
  };

  const onScore = (t) => {
    onUpdate(reschedule(pair, t, now));
    setshow(false);
  };

  if (pair) {
    if (show) {
      return <ShowPair pair={pair} onScore={onScore} />;
    } else {
      return <TestPair pair={pair} choices={choices} onShow={onShow} />;
    }
  } else {
    return <NoPairs />;
  }
};

LearnPair.propTypes = {
  pair: PropTypes.shape({
    front: PropTypes.string,
    back: PropTypes.string,
    views: PropTypes.array,
  }),
  choices: PropTypes.array.isRequired,
  onUpdate: PropTypes.func.isRequired,
  now: PropTypes.number.isRequired,
};

const LearnPage = ({ listPairs, now }) => {
  console.log("LearnPage1", { listPairs, now });

  const [showmulti, setshowmulti] = useState(false);
  const [getlistPairs, setlistPairs] = listPairs;
  const [currentId, setcurrentId] = useState(0);
  const [choices, setchoices] = useState([]);

  const groups = groupSort(getlistPairs, now);
  const learnList = groups.review.concat(groups.new);

  if (learnList.length && !currentId) {
    setcurrentId(learnList[0].id);
    const c = showmulti
      ? learnList
          .slice(0, 5)
          .map((p) => p.back)
          .sort(() => 0.5 - Math.random())
      : [];
    setchoices(c);
  }

  const pair = getItemById(getlistPairs, currentId);

  const onUpdate = (pair) => {
    setlistPairs(replaceItemById(getlistPairs, pair));
    setcurrentId(0);
  };

  return (
    <div>
      <h3>Learn</h3>
      <p>
        {groups.review.length} review / {groups.new.length} new /{" "}
        {groups.old.length} old
      </p>
      <p>
        <input
          id="multichoice"
          type="checkbox"
          checked={showmulti}
          onChange={() => {
            setshowmulti((v) => !v);
            setcurrentId(0);
          }}
        />{" "}
        <label htmlFor="multichoice">Multichoice</label>
      </p>
      <LearnPair pair={pair} choices={choices} onUpdate={onUpdate} now={now} />
    </div>
  );
};

LearnPage.propTypes = {
  listPairs: PropTypes.array.isRequired,
  now: PropTypes.number.isRequired,
};

export default LearnPage;
