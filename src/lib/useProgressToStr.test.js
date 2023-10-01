import assert from 'node:assert/strict'
import {calcProgressStr,calcStrProgress} from './useProgressToStr.js'

export function testProgNoSeconds() {
  assert.deepEqual(calcProgressStr("9 0,0"), [[0,9*24*3600]])
}

export function testStrNoSeconds() {
  assert.deepEqual(calcStrProgress([[0,9*24*3600]]),"9 0,0")
}

export function testProgSeconds() {
  assert.deepEqual(calcProgressStr("9 0,0,1"), [[0,9*24*3600+1]])
}

export function testStrSeconds() {
  assert.deepEqual(calcStrProgress([[0,9*24*3600+1]]),"9 0,0,1")
}
