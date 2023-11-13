import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import { useJson, useLog, useStorage, useCache } from "./lib/useCache";
import { useProgressStr } from "./lib/useProgressToStr";

import AddPage from "./components/AddPage";
import AddParagraph from "./components/AddParagraph";
import LearnPage from "./components/LearnPage";
import MatchPage from "./components/MatchPage";
import ListPage from "./components/ListPage";
import ManageProgress from "./components/ManageProgress";
import DataPage from "./components/Data";
import "./App.css";
import formats from "./components/formats";

const combinePairsProgress = ([pairs, setPairs], [progress, setProgress]) => {
  return [pairs, setPairs];
};

const getNow = () => (Date.now() / 1000) | 0;

const App = () => {
  const listPairsOnly = useJson(useLog(useStorage("pairs", "[]"), "pairs"));
  const listSents = useJson(useLog(useStorage("sents", "[]"), "sents"));
  const progress = useCache(
    useProgressStr(useLog(useStorage("progress", ""), "progress"))
  );
  const p = progress.state;

  const listPairs = combinePairsProgress(listPairsOnly, p);

  const [now, setNow] = useState(getNow);

  useEffect(() => {
    const to = setInterval(() => setNow(getNow), 3000);
    return () => clearTimeout(to);
  }, []);

  return (
    <Router basename={import.meta.env.VITE_BASE_URL}>
      <nav style={{ overflowX: "auto" }}>
        <NavLink
          className={({ isActive }) => (isActive ? "link-active" : "link")}
          to="/add"
        >
          Add
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "link-active" : "link")}
          to="/add-paragraph"
        >
          Add Paragraph
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "link-active" : "link")}
          to="/learn"
        >
          Learn
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "link-active" : "link")}
          to="/match"
        >
          Match
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "link-active" : "link")}
          to="/list"
        >
          List
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "link-active" : "link")}
          to="/progress"
        >
          Progress
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "link-active" : "link")}
          to="/data"
        >
          Data
        </NavLink>
      </nav>
      <div>
        <button onClick={() => progress.save()}>
          Save {progress.changed ? "*" : ""}
        </button>
        <Routes>
          <Route path="/" element={<MatchPage listPairs={listPairs} />} />
          <Route
            path="/add"
            element={<AddPage listPairs={listPairs} now={now} />}
          />
          <Route
            path="/add-paragraph"
            element={
              <AddParagraph
                listPairs={listPairs}
                listSents={listSents}
                now={now}
              />
            }
          />
          <Route
            path="/learn"
            element={<LearnPage listPairs={listPairs} now={now} />}
          />
          <Route
            path="/match"
            element={<MatchPage listPairs={listPairs} progress={p} now={now} />}
          />
          <Route
            path="/list"
            element={<ListPage listPairs={listPairs} progress={p} now={now} />}
          />
          <Route
            path="/progress"
            element={
              <ManageProgress listPairs={listPairs} progress={p} now={now} />
            }
          />
          <Route
            path="/data"
            element={
              <DataPage tables={{ listPairs, listSents }} formats={formats} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
