import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import { useTimer } from "react-timer-hook";
import { type Config, DEFAULTS } from "@/components/timer/config";

export type Phase = "idle" | "round" | "rest" | "done";

function makeExpiry(seconds: number): Date {
  const t = new Date();
  t.setSeconds(t.getSeconds() + seconds);
  return t;
}

export function useBoxingTimer(config: Config, onBell: () => void) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [currentRound, setCurrentRound] = useState(1);

  // useTimer captures onExpire once, so it reads current values through refs
  const phaseRef = useRef<Phase>("idle");
  const roundRef = useRef(1);
  const configRef = useRef<Config>(DEFAULTS);
  const bellRef = useRef(onBell);
  useEffect(() => {
    phaseRef.current = phase;
    roundRef.current = currentRound;
    configRef.current = config;
    bellRef.current = onBell;
  });

  const { seconds, minutes, isRunning, pause, resume, restart } = useTimer({
    expiryTimestamp: makeExpiry(DEFAULTS.roundDuration),
    autoStart: false,
    interval: 1000,
    onExpire: () => {
      const p = phaseRef.current;
      const round = roundRef.current;
      const cfg = configRef.current;

      bellRef.current();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // restart() inside onExpire is overwritten by the hook's own isRunning=false
      if (p === "round") {
        if (round < cfg.rounds) {
          setPhase("rest");
          setTimeout(() => restart(makeExpiry(cfg.restDuration), true), 0);
        } else {
          setPhase("done");
        }
      } else if (p === "rest") {
        setCurrentRound((r) => r + 1);
        setPhase("round");
        setTimeout(() => restart(makeExpiry(cfg.roundDuration), true), 0);
      }
    },
  });

  useEffect(() => {
    if (isRunning && minutes === 0 && seconds === 10) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  const toggle = () => {
    if (isRunning) {
      pause();
    } else if (phase === "idle") {
      onBell();
      setPhase("round");
      restart(makeExpiry(config.roundDuration), true);
    } else {
      resume();
    }
  };

  const reset = () => {
    setPhase("idle");
    setCurrentRound(1);
    restart(makeExpiry(config.roundDuration), false);
  };

  const setIdleDuration = (roundDuration: number) => {
    if (phase === "idle") restart(makeExpiry(roundDuration), false);
  };

  return {
    phase,
    currentRound,
    minutes,
    seconds,
    isRunning,
    toggle,
    reset,
    setIdleDuration,
  };
}
