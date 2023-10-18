import assert from "node:assert/strict";
import { calcProgressStr, calcStrProgress } from "./useProgressToStr.js";

export function testProgStep() {
  const str = `0
aaa 7 0`;
  const data = [{ id: "aaa", step: 7, expiry: 0 }];
  assert.deepEqual(calcProgressStr(str), data);
  assert.deepEqual(calcStrProgress(data), str);
}

export function testStrStep() {
  assert.deepEqual(calcStrProgress([[7, 0]]), "0 7,0");
}

export function testProgNoSeconds() {
  assert.deepEqual(calcProgressStr("9 0,0"), [[0, 9]]);
}

export function testStrNoSeconds() {
  assert.deepEqual(calcStrProgress([[0, 9]]), "9 0,0");
}

export function testProgSeconds() {
  assert.deepEqual(calcProgressStr("9 0,0,1"), [[0, 9 + 1]]);
}

export function testStrSeconds() {
  assert.deepEqual(calcStrProgress([[0, 9 + 1]]), "9 0,0,1");
}

export function testProgDaysSeconds() {
  assert.deepEqual(calcProgressStr("9 0,1,1"), [[0, 9 + 1 * 24 * 3600 + 1]]);
}

export function testStrDaysSeconds() {
  assert.deepEqual(calcStrProgress([[0, 9 + 1 * 24 * 3600 + 1]]), "9 0,1,1");
}

export function testProgHex() {
  assert.deepEqual(calcProgressStr("10 0,10,10"), [
    [0, 16 + 16 * 24 * 3600 + 16],
  ]);
}

export function testStrHex() {
  assert.deepEqual(
    calcStrProgress([[0, 16 + 16 * 24 * 3600 + 16]]),
    "10 0,10,10",
  );
}
