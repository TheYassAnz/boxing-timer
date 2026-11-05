/// <reference types="node" />
import assert from "node:assert/strict";
import { test } from "node:test";
import { fmtClock, fromMinSec, parseConfig, presetIndex, PRESETS, roundLabel, stepDuration, stepRounds, UNLIMITED } from "./config";
import { idle, pause, resume, secondsLeft, shouldClap, start, tick } from "./machine";

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

test("préréglages exacts", () => {
  assert.deepEqual(PRESETS.map((p) => [p.label, p.config]), [
    ["Échauffement", { rounds: UNLIMITED, roundDuration: 30, restDuration: 30 }],
    ["Assauts", { rounds: UNLIMITED, roundDuration: 90, restDuration: 35 }],
    ["Sparring", { rounds: 12, roundDuration: 180, restDuration: 60 }],
  ]);
  for (const p of PRESETS) assert.deepEqual(parseConfig(JSON.stringify(p.config)), p.config);
});

test("presetIndex reconnaît ou renvoie -1", () => {
  assert.equal(presetIndex(PRESETS[2].config), 2);
  assert.equal(presetIndex({ ...PRESETS[2].config, rounds: 6 }), -1);
});

test("config de l'ancienne version rechargée", () => {
  assert.deepEqual(parseConfig('{"rounds":3,"roundDuration":180,"restDuration":60}'), { rounds: 3, roundDuration: 180, restDuration: 60 });
  assert.equal(parseConfig('{"rounds":-4}').rounds, 0);
  assert.equal(parseConfig('{"rounds":500}').rounds, 100);
});

test("stepRounds passe par illimité et borne", () => {
  assert.equal(stepRounds(1, -1), 0);
  assert.equal(stepRounds(0, -1), 0);
  assert.equal(stepRounds(0, 1), 1);
  assert.equal(stepRounds(100, 1), 100);
});

test("stepDuration aligne sur 5 s et borne 1–300", () => {
  assert.equal(stepDuration(1, 1), 5);
  assert.equal(stepDuration(33, 1), 35);
  assert.equal(stepDuration(33, -1), 30);
  assert.equal(stepDuration(5, -1), 1);
  assert.equal(stepDuration(1, -1), 1);
  assert.equal(stepDuration(300, 1), 300);
});

test("fromMinSec borne 1–300", () => {
  assert.equal(fromMinSec(0, 0), 1);
  assert.equal(fromMinSec(1, 30), 90);
  assert.equal(fromMinSec(5, 59), 300);
});

test("libellés", () => {
  assert.equal(fmtClock(35), "0:35");
  assert.equal(fmtClock(180), "3:00");
  assert.equal(roundLabel(2, 12), "Round 2 / 12");
  assert.equal(roundLabel(7, UNLIMITED), "Round 7");
});

test("illimité : ne termine jamais et rattrape l'arrière-plan", () => {
  const u = { rounds: UNLIMITED, roundDuration: 3, restDuration: 2 };
  const r = tick(start(u, 0), u, (5 * 50 + 1) * 1000);
  assert.notEqual(r.state.phase, "done");
  assert.equal(r.state.round, 51);
  assert.equal(r.transitions, 100);
});

test("shouldClap : franchissement des 10 s en round uniquement", () => {
  const c = { rounds: 3, roundDuration: 30, restDuration: 30 };
  const s = start(c, 0);
  const a = tick(s, c, 19_500);
  const b = tick(a.state, c, 20_100);
  assert.equal(shouldClap(a.state, b.state, b.transitions), true);
  const b2 = tick(b.state, c, 20_400);
  assert.equal(shouldClap(b.state, b2.state, b2.transitions), false);
  const rest = tick(s, c, 30_000).state;
  const r1 = tick(rest, c, 49_500), r2 = tick(r1.state, c, 50_100);
  assert.equal(r2.state.phase, "rest");
  assert.equal(shouldClap(r1.state, r2.state, r2.transitions), false);
  const jump = tick(s, c, 81_000);
  assert.equal(shouldClap(s, jump.state, jump.transitions), false);
});
