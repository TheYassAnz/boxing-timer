import { roundLabel, type Config } from "./config";
import type { TimerState } from "./machine";

export interface LockScreenContent {
  title: string;
  phaseLabel: "Round" | "Repos";
  tint: "red" | "green";
  endsAt: number | null;
  remaining: number;
}

export function lockScreenContent(
  state: TimerState,
  cfg: Config,
): LockScreenContent | null {
  if (state.phase === "idle" || state.phase === "done") return null;
  const resting = state.phase === "rest";
  return {
    title: roundLabel(state.round, cfg.rounds),
    phaseLabel: resting ? "Repos" : "Round",
    tint: resting ? "green" : "red",
    endsAt: state.endsAt,
    remaining: state.remaining,
  };
}
