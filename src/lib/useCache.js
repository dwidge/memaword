import React, { useState, useEffect } from "react";
import { Storage } from "@dwidge/lib-react";

export const useLog = ([get, set], name = "state") => {
  useEffect(() => {
    console.log("read", name);
    console.log(get);
  }, [get]);
  const setlog = (v) => {
    console.log("write", name, JSON.stringify(v).length + "B");
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
  return { get, set, save, changed };
};

export const useStorage = (name, init) =>
  useLog(Storage(useState, useEffect).useStorage(name, init), name);
