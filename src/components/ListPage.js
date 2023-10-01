import React from "react";
import PropTypes from "prop-types";
import { groupSort } from "../lib/pairs";
import { Pair } from "./Pair";

const ListPage = ({ listPairs, progress: [progress] }) => {
  const now = Date.now() / 1000;
  const today = (now / (3600 * 24)) | 0;
  console.log({ today, day: progress.day, diff: today - progress.day });
  const [getlistPairs, setlistPairs] = listPairs;
  //console.log({progress})
  const combinedPairs = getlistPairs.map((p, i) => ({
    ...p,
    i,
    progress: progress.list[i],
  }));
  const groupPairs = groupSort(combinedPairs, today - progress.day);

  const onClear = () => {
    if (window.confirm("Clear database?")) {
      setlistPairs([]);
    }
  };
  const onImport = () => {
    if (window.confirm("Clear database?")) {
      setlistPairs([]);
    }
  };
  const onExport = () => {
    if (window.confirm("Clear database?")) {
      setlistPairs([]);
    }
  };

  return (
    <div>
      <h3>List</h3>
      <div>
        {Object.entries(groupPairs).map(([group, list]) => (
          <details key={group}>
            <summary>
              {list.length} {group}
            </summary>
            {list.map((pair) => Pair({ now, pair }))}
          </details>
        ))}
      </div>
      <p>
        <button data-testid="buttonClear" onClick={onClear}>
          Clear
        </button>
        <button onClick={onImport}>Import</button>
        <button onClick={onExport}>Export</button>
      </p>
    </div>
  );
};

ListPage.propTypes = {
  listPairs: PropTypes.array.isRequired,
  now: PropTypes.number.isRequired,
};

export default ListPage;
