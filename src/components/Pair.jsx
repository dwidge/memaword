import React from "react";
import PropTypes from "prop-types";
import { last, printSecondsRounded } from "@dwidge/lib";
import { calcInterval } from "../lib/pairs";

export const Pair = ({ now, pair }) => {
  const { id, front, back, views } = pair;
  return (
    <li key={id}>
      <pair-front>{front}</pair-front> = <pair-back>{back}</pair-back> /{" "}
      <pair-next>
        {last(views) ? printSecondsRounded(last(views).next - now) : "-"}
      </pair-next>{" "}
      /{" "}
      <pair-interval>
        {last(views) ? printSecondsRounded(calcInterval(views)) : "-"}
      </pair-interval>
      <pre>{JSON.stringify(pair, null, 2)}</pre>
    </li>
  );
};

Pair.propTypes = {
  pair: PropTypes.shape({
    id: PropTypes.number.isRequired,
    front: PropTypes.string,
    back: PropTypes.string,
    views: PropTypes.array,
  }).isRequired,
  now: PropTypes.number.isRequired,
};
