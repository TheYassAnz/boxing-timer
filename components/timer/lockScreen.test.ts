/// <reference types="node" />
import assert from "node:assert/strict";
import { test } from "node:test";
import { UNLIMITED } from "./config";
import { lockScreenContent } from "./lockScreen";
import { idle, pause, start, tick } from "./machine";

const cfg = { rounds: 2, roundDuration: 3, restDuration: 2 };

test("rien à afficher à l'arrêt ni une fois terminé", () => {
  assert.equal(lockScreenContent(idle(cfg), cfg), null);
  const done = tick(start(cfg, 0), cfg, 8000).state;
  assert.equal(done.phase, "done");
  assert.equal(lockScreenContent(done, cfg), null);
});

test("round en cours : rouge, libellé Round", () => {
  assert.deepEqual(lockScreenContent(start(cfg, 0), cfg), {
    title: "Round 1 / 2",
    phaseLabel: "Round",
    tint: "red",
    endsAt: 3000,
    remaining: 3000,
  });
});

test("repos : vert, libellé Repos", () => {
  const rest = tick(start(cfg, 0), cfg, 3000).state;
  assert.deepEqual(lockScreenContent(rest, cfg), {
    title: "Round 1 / 2",
    phaseLabel: "Repos",
    tint: "green",
    endsAt: 5000,
    remaining: 2000,
  });
});

test("pause : endsAt null, temps restant conservé", () => {
  const paused = pause(start(cfg, 0), 1000);
  const content = lockScreenContent(paused, cfg);
  assert.ok(content);
  assert.equal(content.endsAt, null);
  assert.equal(content.remaining, 2000);
  assert.equal(content.tint, "red");
});

test("illimité : titre sans total", () => {
  const unlimited = { rounds: UNLIMITED, roundDuration: 3, restDuration: 2 };
  const s = tick(start(unlimited, 0), unlimited, 20_000).state;
  assert.equal(s.round, 5);
  assert.equal(lockScreenContent(s, unlimited)?.title, "Round 5");
});
