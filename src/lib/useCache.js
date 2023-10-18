import React, { useState, useEffect } from "react";
import { Storage } from "@dwidge/lib-react";

export const useJson = ([s, setS]) => {
  return [s ? JSON.parse(s) : undefined, (s) => setS(JSON.stringify(s))];
};

export const useLog = ([get, set], name = "state") => {
  useEffect(() => {
    console.log("read:" + name, get.length + "B", get);
  }, [get]);
  const setlog = (v) => {
    console.log("write:" + name, v.length + "B", v);
    set(v);
  };
  return [get, setlog];
};

export const useCache = ([getReal, setReal]) => {
  const [changed, setchanged] = useState(false);
  const [get, setC] = useState(getReal);
  const set = (v) => {
    setchanged(true);
    setC(v);
  };
  const save = () => {
    setchanged(false);
    setReal(get);
  };
  return { state: [get, set], save, changed };
};

export const useStorage = (name, init = "") => {
  const [s, setS] = useState(() => localStorage.getItem(name) ?? init);
  useEffect(() => {
    localStorage.setItem(name, s);
  }, [s]);
  return [s, setS];
};
