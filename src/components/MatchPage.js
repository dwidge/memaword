import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getItemById, replaceItemById } from "@dwidge/lib";
import { groupSort, reschedule, randomAsc, firstNshuffled } from "../lib/pairs";

const MatchPage = ({ listPairs }) => {
  const now = Date.now() / 1000;
  const [getlistPairs, setlistPairs] = listPairs;
  const groups = groupSort(getlistPairs, now);
  const learnList = groups.review.concat(groups.new);

  const [init, setinit] = useState(0);
  const [n, setn] = useState(4);
  const [sizeFront, setsizeFront] = useState(2);
  const [sizeBack, setsizeBack] = useState(2);

  const [frontInd, setfrontInd] = useState();
  const [backInd, setbackInd] = useState();

  const resetList = () => {
    const front = learnList[0];
    const back = learnList
      .slice(1)
      .filter((o) => o.back !== front.back)
      .slice(0, n - 1);
    return { front: [front], back: [front, ...back].sort(randomAsc) };
  };
  const [list, setlist] = useState(resetList());
  useEffect(() => {
    const l = resetList();
    setlist(l);
    if (l.front.length === 1) setfrontInd(l.front[0].id);
  }, [n, init]);

  useEffect(() => {
    if (frontInd && backInd) {
      if (frontInd === backInd) {
        onReschedule([frontInd]);

        setfrontInd();
        setbackInd();

        setinit(init + 1);
      } else {
        onReschedule([frontInd, backInd], 0);
      }
    }
  }, [frontInd, backInd]);

  const onReschedule = (ids, t) => {
    onUpdates(
      ids.map((id) => reschedule(getItemById(getlistPairs, frontInd), t, now))
    );
  };

  const onUpdates = (pairs) => {
    setlistPairs(
      pairs.reduce(
        (getlistPairs, pair) => replaceItemById(getlistPairs, pair),
        getlistPairs
      )
    );
  };

  const normal = {
    display: "inline-block",
    fontSize: sizeFront + "em",
    padding: "0.2em",
    margin: "0.2em",
  };
  const highlight = { ...normal, background: "grey" };

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
