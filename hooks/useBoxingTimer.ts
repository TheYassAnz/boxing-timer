import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import type { Config } from "@/components/timer/config";
import {
  idle,
  pause,
  resume,
  secondsLeft,
  shouldClap,
  start,
  tick,
} from "@/components/timer/machine";

export type { Phase } from "@/components/timer/machine";

export function useBoxingTimer(
  config: Config,
  sounds: { bell: () => void; clap: () => void },
) {
  const [state, setState] = useState(() => idle(config));
  const isRunning = state.endsAt !== null;

  useEffect(() => {
    if (!isRunning) return;
    const id = setTimeout(() => {
      const next = tick(state, config, Date.now());
      if (next.transitions > 0) {
        sounds.bell();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (secondsLeft(state) > 10 && secondsLeft(next.state) <= 10) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
      if (shouldClap(state, next.state, next.transitions)) sounds.clap();
      setState(next.state);
    }, 250);
    return () => clearTimeout(id);
  }, [state, config, sounds, isRunning]);

  const toggle = () => {
    const now = Date.now();
    if (isRunning) {
      setState(pause(state, now));
    } else if (state.phase === "idle") {
      sounds.bell();
      setState(start(config, now));
    } else {
      setState(resume(state, now));
    }
  };

  const reset = () => setState(idle(config));

  const secs = secondsLeft(state);
  const phaseMs =
    (state.phase === "rest" ? config.restDuration : config.roundDuration) *
    1000;
  return {
    phase: state.phase,
    currentRound: state.round,
    minutes: Math.floor(secs / 60),
    seconds: secs % 60,
    remainingMs: state.remaining,
    progress: state.phase === "idle" ? 1 : state.remaining / phaseMs,
    isRunning,
    toggle,
    reset,
  };
}
