import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import {
  transpose,
  dropIfIncluded,
  onlyHan,
  unique,
  uuid,
  wordsOfString,
} from "@dwidge/lib";
import { onChange } from "@dwidge/lib-react";

const AddPairs = ({ listPairs, now }) => {
  const [pairs, setpairs] = listPairs;
  const [frontWords, setfrontWords] = useState("");
  const [backWords, setbackWords] = useState("");
  const [group, setGroup] = useState("");

  const textareaFront = useRef();

  const setFrontUniqueSort = (words) =>
    setfrontWords(unique(words).sort().join("\n"));

  const onExtractWords = () => setFrontUniqueSort(wordsOfString(frontWords));

  const onExtractHan = () => setFrontUniqueSort(onlyHan([...frontWords]));

  const onCopyToClipboard = (e) => {
    textareaFront.current.select();
    document.execCommand("copy");
    // e.target.focus()
  };

  const onAddPairs = () => {
    const frontWordsA = frontWords.split("\n").filter((s) => s);
    const backWordsA = backWords.split("\n").filter((s) => s);

    if (frontWordsA.length !== backWordsA.length) {
      return;
    }

    const isSamePair = (a, b) => a.front === b.front && a.back === b.back;

    const newpairs = transpose([frontWordsA, backWordsA]).map(
      ([front, back]) => ({ id: uuid(), front, back, views: [], group })
    );

    const unseenpairs = dropIfIncluded(newpairs, pairs, isSamePair);

    setpairs(pairs.concat(unseenpairs));
    setfrontWords("");
    setbackWords("");
  };

  return (
    <div>
      <h3>Group</h3>
      <input value={group} onChange={onChange(setGroup)}></input>
      <h3>Front</h3>
      <p>Words or phrases, one per line.</p>
      <p>
        Try this: paste a large paragraph and click [Words] to extract unknown
        words from the text. [Han] will extract unknown han characters.
      </p>
      <textarea
        ref={textareaFront}
        value={frontWords}
        onChange={onChange(setfrontWords)}
        data-testid="front"
      ></textarea>
      <button onClick={onExtractWords} data-testid="buttonExtractWords">
        Words
      </button>
      <button onClick={onExtractHan} data-testid="buttonExtractHan">
        Han
      </button>
      <button onClick={onCopyToClipboard} data-testid="copyButton">
        Copy
      </button>
      <h3>Back</h3>
      <p>Words or phrases, one per line. Must match with [Front] list.</p>
      <p>
        Try this: Copy the [Front] word list to an online translator, then paste
        the translated list here.
      </p>
      <textarea
        value={backWords}
        onChange={onChange(setbackWords)}
        data-testid="back"
      ></textarea>
      <button onClick={onAddPairs} data-testid="addButton">
        Add
      </button>
    </div>
  );
};

AddPairs.propTypes = {
  listPairs: PropTypes.array.isRequired,
  now: PropTypes.number.isRequired,
};

export default AddPairs;
