/// <reference types="node" />
import assert from "node:assert/strict";
import { test } from "node:test";
import { parseConfig, PRESETS, sameConfig } from "./config";
import { idle, pause, resume, secondsLeft, start, tick } from "./machine";

const cfg = { rounds: 2, roundDuration: 3, restDuration: 2 };

test("enchaîne round → rest → round → done", () => {
  let s = start(cfg, 0);
  assert.equal(s.phase, "round");
  assert.equal(secondsLeft(s), 3);

  let r = tick(s, cfg, 1500);
  assert.equal(r.transitions, 0);
  assert.equal(secondsLeft(r.state), 2);

  r = tick(r.state, cfg, 3000);
  assert.deepEqual(
    [r.state.phase, r.state.round, r.transitions],
    ["rest", 1, 1],
  );
  assert.equal(secondsLeft(r.state), 2);

  r = tick(r.state, cfg, 5000);
  assert.deepEqual([r.state.phase, r.state.round], ["round", 2]);

  r = tick(r.state, cfg, 8000);
  assert.equal(r.state.phase, "done");
  assert.equal(r.state.endsAt, null);
  s = r.state;
  assert.equal(tick(s, cfg, 99_000).transitions, 0);
});

test("rattrape le temps passé en arrière-plan", () => {
  const r = tick(start(cfg, 0), cfg, 5500);
  assert.deepEqual(
    [r.state.phase, r.state.round, r.transitions],
    ["round", 2, 2],
  );
  assert.equal(r.state.endsAt, 8000);
});

test("pause puis reprise conservent le temps restant", () => {
  let s = pause(start(cfg, 0), 1200);
  assert.equal(s.endsAt, null);
  assert.equal(s.remaining, 1800);
  assert.equal(tick(s, cfg, 50_000).transitions, 0);
  s = resume(s, 10_000);
  assert.equal(s.endsAt, 11_800);
});

test("idle et done ne reprennent pas", () => {
  assert.equal(resume(idle(cfg), 0).endsAt, null);
  const one = { ...cfg, rounds: 1 };
  const done = tick(start(one, 0), one, 3000).state;
  assert.equal(done.phase, "done");
  assert.equal(resume(done, 4000).endsAt, null);
});

test("parseConfig borne et ignore les valeurs invalides", () => {
  const D = { rounds: 3, roundDuration: 180, restDuration: 60 };
  assert.deepEqual(parseConfig("garbage"), D);
  assert.deepEqual(parseConfig("null"), D);
  assert.deepEqual(
    parseConfig('{"rounds":500,"roundDuration":"x","restDuration":0}'),
    { rounds: 100, roundDuration: 180, restDuration: 1 },
  );
});

test("les préréglages respectent les bornes et se reconnaissent", () => {
  for (const p of PRESETS) {
    assert.deepEqual(parseConfig(JSON.stringify(p.config)), p.config);
    assert.ok(sameConfig(p.config, { ...p.config }));
  }
  assert.ok(!sameConfig(PRESETS[0].config, PRESETS[1].config));
});
