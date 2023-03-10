import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import { Storage } from "@dwidge/lib-react";

import AddPage from "./components/AddPage";
import AddParagraph from "./components/AddParagraph";
import LearnPage from "./components/LearnPage";
import MatchPage from "./components/MatchPage";
import ListPage from "./components/ListPage";
import "./App.css";
const { useStorage } = Storage(useState, useEffect);

const App = () => {
  const listPairs = useStorage("pairs", []);
  const listSents = useStorage("sents", []);
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
      </nav>
      <div>
        <Routes>
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
          <Route path="/match" element={<MatchPage listPairs={listPairs} />} />
          <Route
            path="/list"
            element={<ListPage listPairs={listPairs} now={getnow} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
