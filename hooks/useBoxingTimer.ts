import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import type { Config } from "@/components/timer/config";
import {
  idle,
  pause,
  resume,
  secondsLeft,
  start,
  tick,
} from "@/components/timer/machine";

export type { Phase } from "@/components/timer/machine";

export function useBoxingTimer(config: Config, onBell: () => void) {
  const [state, setState] = useState(() => idle(config));
  const isRunning = state.endsAt !== null;

  useEffect(() => {
    if (!isRunning) return;
    const id = setTimeout(() => {
      const next = tick(state, config, Date.now());
      if (next.transitions > 0) {
        onBell();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (secondsLeft(state) > 10 && secondsLeft(next.state) <= 10) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
      setState(next.state);
    }, 250);
    return () => clearTimeout(id);
  }, [state, config, onBell, isRunning]);

  const toggle = () => {
    const now = Date.now();
    if (isRunning) {
      setState(pause(state, now));
    } else if (state.phase === "idle") {
      onBell();
      setState(start(config, now));
    } else {
      setState(resume(state, now));
    }
  };

  const reset = () => setState(idle(config));

  const secs = secondsLeft(state);
  return {
    phase: state.phase,
    currentRound: state.round,
    minutes: Math.floor(secs / 60),
    seconds: secs % 60,
    isRunning,
    toggle,
    reset,
  };
}
