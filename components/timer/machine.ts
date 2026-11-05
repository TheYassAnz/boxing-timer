import type { Config } from "./config";

export type Phase = "idle" | "round" | "rest" | "done";

export interface TimerState {
  phase: Phase;
  round: number;
  // ms timestamp when the current phase ends; null while idle, paused or done
  endsAt: number | null;
  // ms left in the current phase, kept up to date while paused
  remaining: number;
}

export const idle = (cfg: Config): TimerState => ({
  phase: "idle",
  round: 1,
  endsAt: null,
  remaining: cfg.roundDuration * 1000,
});

export const start = (cfg: Config, now: number): TimerState => ({
  phase: "round",
  round: 1,
  endsAt: now + cfg.roundDuration * 1000,
  remaining: cfg.roundDuration * 1000,
});

export const pause = (s: TimerState, now: number): TimerState =>
  s.endsAt === null
    ? s
    : { ...s, endsAt: null, remaining: Math.max(0, s.endsAt - now) };

export const resume = (s: TimerState, now: number): TimerState =>
  s.endsAt !== null || s.phase === "idle" || s.phase === "done"
    ? s
    : { ...s, endsAt: now + s.remaining };

// Chains phase ends from the previous deadline, not from `now`, so time spent
// in background is caught up exactly.
export function tick(
  s: TimerState,
  cfg: Config,
  now: number,
): { state: TimerState; transitions: number } {
  let state = s;
  let transitions = 0;
  while (state.endsAt !== null && now >= state.endsAt) {
    transitions++;
    const end = state.endsAt;
    if (state.phase === "round" && state.round < cfg.rounds) {
      state = {
        ...state,
        phase: "rest",
        endsAt: end + cfg.restDuration * 1000,
      };
    } else if (state.phase === "rest") {
      state = {
        ...state,
        phase: "round",
        round: state.round + 1,
        endsAt: end + cfg.roundDuration * 1000,
      };
    } else {
      state = { ...state, phase: "done", endsAt: null, remaining: 0 };
    }
  }
  if (state.endsAt !== null)
    state = { ...state, remaining: state.endsAt - now };
  return { state, transitions };
}

export const secondsLeft = (s: TimerState) => Math.ceil(s.remaining / 1000);
