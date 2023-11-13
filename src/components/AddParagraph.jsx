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

const AddParagraph = ({
  listPairs: [pairs, setpairs],
  listSents: [allSents, setSents],
}) => {
  const [text, setText] = useState("");

  const onExtractSents = () => {
    setText(wordsOfString(text).join(" "));
    console.log(wordsOfString(text));
  };

  const onAdd = () => {
    const newSents = text.split(" ");
    setSents([...allSents, newSents]);
    setText("");
  };

  return (
    <div>
      <p>
        Try this: paste a large paragraph and click [Sents] to extract
        sentences.
      </p>
      <textarea value={text} onChange={onChange(setText)}></textarea>
      <button onClick={onExtractSents}>Sents</button>

      <button onClick={onAdd}>Add</button>
    </div>
  );
};

AddParagraph.propTypes = {
  listPairs: PropTypes.array.isRequired,
};

export default AddParagraph;
