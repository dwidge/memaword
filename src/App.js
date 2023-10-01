import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import { useStorage, useCache } from "./lib/useCache";
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

const combinePairsProgress=([pairs,setPairs],[progress,setProgress])=>{
return [pairs,setPairs]
}

const App = () => {
  const listPairsOnly = useStorage("pairs", []);
  const listSents = useStorage("sents", []);
  const progress = useCache(useProgressStr(useStorage("progress", "")));
  const p = [progress.get, progress.set];
  //console.log({ p });

const listPairs=combinePairsProgress(listPairsOnly,p)

  const [getnow, setnow] = useState(Date.now());

  useEffect(() => {
    const to = setInterval(() => setnow((Date.now() / 1000) | 0), 2000);
    return () => clearTimeout(to);
  }, []);

  return (
    <Router basename="/memaword">
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
            element={<AddPage listPairs={listPairs} now={getnow} />}
          />
          <Route
            path="/add-paragraph"
            element={
              <AddParagraph
                listPairs={listPairs}
                listSents={listSents}
                now={getnow}
              />
            }
          />
          <Route
            path="/learn"
            element={<LearnPage listPairs={listPairs} now={getnow} />}
          />
          <Route
            path="/match"
            element={<MatchPage listPairs={listPairs} progress={p} />}
          />
          <Route
            path="/list"
            element={
              <ListPage listPairs={listPairs} now={getnow} progress={p} />
            }
          />
          <Route
            path="/progress"
            element={
              <ManageProgress
                listPairs={listPairs}
                progress={[progress.get, progress.set]}
              />
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
