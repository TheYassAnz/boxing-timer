import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { useTimer } from "react-timer-hook";
import { Button, ButtonText } from "../ui/button";

type Phase = "idle" | "round" | "rest" | "done";

interface Config {
  rounds: number;
  roundDuration: number;
  restDuration: number;
}

const DEFAULTS: Config = { rounds: 3, roundDuration: 180, restDuration: 60 };

function makeExpiry(seconds: number): Date {
  const t = new Date();
  t.setSeconds(t.getSeconds() + seconds);
  return t;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function fmtDuration(s: number): string {
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return rem === 0 ? `${m} min` : `${m}:${pad(rem)}`;
}

interface ConfigRowProps {
  label: string;
  value: string;
  onDecrement: () => void;
  onIncrement: () => void;
}

function ConfigRow({ label, value, onDecrement, onIncrement }: ConfigRowProps) {
  return (
    <View className="flex-row items-center justify-between w-full px-8 py-2">
      <Text className="text-boxing-navy dark:text-boxing-sky text-xs font-semibold uppercase tracking-widest w-20">
        {label}
      </Text>
      <View className="flex-row items-center gap-3">
        <Button
          size="sm"
          action="secondary"
          className="rounded-full !bg-boxing-navy/20 dark:!bg-boxing-white/10"
          onPress={onDecrement}
        >
          <ButtonText className="!text-boxing-navy dark:!text-boxing-white font-bold">
            −
          </ButtonText>
        </Button>
        <Text className="text-boxing-navy dark:text-boxing-white font-bold text-sm w-20 text-center">
          {value}
        </Text>
        <Button
          size="sm"
          action="secondary"
          className="rounded-full !bg-boxing-navy/20 dark:!bg-boxing-white/10"
          onPress={onIncrement}
        >
          <ButtonText className="!text-boxing-navy dark:!text-boxing-white font-bold">
            +
          </ButtonText>
        </Button>
      </View>
    </View>
  );
}

export default function Timer() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [currentRound, setCurrentRound] = useState(1);
  const [config, setConfig] = useState<Config>(DEFAULTS);

  // Refs to avoid stale closures inside onExpire
  const phaseRef = useRef<Phase>("idle");
  const roundRef = useRef(1);
  const configRef = useRef<Config>(DEFAULTS);
  phaseRef.current = phase;
  roundRef.current = currentRound;
  configRef.current = config;

  const { seconds, minutes, isRunning, start, pause, resume, restart } =
    useTimer({
      expiryTimestamp: makeExpiry(DEFAULTS.roundDuration),
      autoStart: false,
      interval: 1000,
      onExpire: () => {
        const p = phaseRef.current;
        const round = roundRef.current;
        const cfg = configRef.current;

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        if (p === "round") {
          if (round < cfg.rounds) {
            setPhase("rest");
            restart(makeExpiry(cfg.restDuration), true);
          } else {
            setPhase("done");
          }
        } else if (p === "rest") {
          setCurrentRound((r) => r + 1);
          setPhase("round");
          restart(makeExpiry(cfg.roundDuration), true);
        }
      },
    });

  // 10-second warning
  useEffect(() => {
    if (isRunning && minutes === 0 && seconds === 10) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  const handleToggle = () => {
    if (isRunning) {
      pause();
    } else if (phase === "idle") {
      setPhase("round");
      restart(makeExpiry(config.roundDuration), true);
    } else {
      resume();
    }
  };

  const handleReset = () => {
    setPhase("idle");
    setCurrentRound(1);
    restart(makeExpiry(config.roundDuration), false);
  };

  const updateConfig = (key: keyof Config, delta: number) => {
    setConfig((prev) => {
      const next = { ...prev, [key]: prev[key] + delta };
      if (key === "rounds") next.rounds = Math.min(12, Math.max(1, next.rounds));
      if (key === "roundDuration") next.roundDuration = Math.min(600, Math.max(60, next.roundDuration));
      if (key === "restDuration") next.restDuration = Math.min(180, Math.max(30, next.restDuration));
      return next;
    });
  };

  const isRest = phase === "rest";
  const isDone = phase === "done";

  // Static display when idle, live countdown otherwise
  const timerDisplay =
    phase === "idle"
      ? `${pad(Math.floor(config.roundDuration / 60))}:${pad(config.roundDuration % 60)}`
      : `${pad(minutes)}:${pad(seconds)}`;

  const roundLabel =
    phase === "idle"
      ? `${config.rounds} rounds · ${fmtDuration(config.roundDuration)}`
      : phase === "round"
        ? `Round ${currentRound} / ${config.rounds}`
        : phase === "rest"
          ? `Repos · Round ${currentRound + 1} →`
          : `${config.rounds} rounds terminés`;

  const statusLabel =
    isRunning
      ? isRest ? "Repos" : "En cours"
      : phase === "idle" ? "Prêt"
      : phase === "done" ? "Terminé"
      : "En pause";

  const toggleLabel =
    isRunning ? "Pause" : phase === "idle" ? "Démarrer" : "Reprendre";

  return (
    <View
      className={`flex-1 items-center justify-center ${
        isRest
          ? "bg-boxing-navy dark:bg-boxing-navy"
          : "bg-boxing-white dark:bg-boxing-dark"
      }`}
    >
      {isDone && (
        <View className="absolute top-16 bg-boxing-alert px-8 py-3 rounded-full">
          <Text className="text-boxing-white font-bold text-base uppercase tracking-widest">
            Terminé !
          </Text>
        </View>
      )}

      <Text
        className={`text-sm font-semibold uppercase tracking-widest mb-3 ${
          isRest ? "text-boxing-sky" : "text-boxing-blue dark:text-boxing-sky"
        }`}
      >
        {roundLabel}
      </Text>

      <Text
        className={`text-8xl font-black font-mono tracking-widest ${
          isRest
            ? "text-boxing-white"
            : "text-boxing-navy dark:text-boxing-white"
        }`}
      >
        {timerDisplay}
      </Text>

      <Text
        className={`text-xs font-semibold uppercase tracking-widest mt-4 ${
          isRest ? "text-boxing-sky" : "text-boxing-blue dark:text-boxing-sky"
        }`}
      >
        {statusLabel}
      </Text>

      {phase === "idle" && (
        <View className="mt-10 w-full">
          <ConfigRow
            label="Rounds"
            value={String(config.rounds)}
            onDecrement={() => updateConfig("rounds", -1)}
            onIncrement={() => updateConfig("rounds", 1)}
          />
          <ConfigRow
            label="Durée"
            value={fmtDuration(config.roundDuration)}
            onDecrement={() => updateConfig("roundDuration", -60)}
            onIncrement={() => updateConfig("roundDuration", 60)}
          />
          <ConfigRow
            label="Repos"
            value={fmtDuration(config.restDuration)}
            onDecrement={() => updateConfig("restDuration", -30)}
            onIncrement={() => updateConfig("restDuration", 30)}
          />
        </View>
      )}

      <View className="flex-row gap-4 mt-10">
        <Button
          size="xl"
          action="primary"
          className={`rounded-full ${
            isRest
              ? "!bg-boxing-blue"
              : "!bg-boxing-navy dark:!bg-boxing-blue"
          }`}
          onPress={handleToggle}
          isDisabled={isDone}
        >
          <ButtonText className="uppercase tracking-widest font-bold">
            {toggleLabel}
          </ButtonText>
        </Button>

        <Button
          size="xl"
          action="negative"
          className="rounded-full !bg-boxing-alert"
          onPress={handleReset}
        >
          <ButtonText className="uppercase tracking-widest font-bold">
            Reset
          </ButtonText>
        </Button>
      </View>
    </View>
  );
}
