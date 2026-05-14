import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Text, View } from "react-native";
import { useTimer } from "react-timer-hook";
import { Button, ButtonText } from "../ui/button";

const DEFAULT_DURATION_SECONDS = 180;

function makeExpiry(seconds: number): Date {
  const t = new Date();
  t.setSeconds(t.getSeconds() + seconds);
  return t;
}

interface TimerProps {
  durationSeconds?: number;
}

export default function Timer({ durationSeconds = DEFAULT_DURATION_SECONDS }: TimerProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const { seconds, minutes, isRunning, start, pause, resume, restart } = useTimer({
    expiryTimestamp: makeExpiry(durationSeconds),
    autoStart: false,
    interval: 1000,
    onExpire: () => {
      setIsExpired(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
  });

  const handleToggle = () => {
    if (isRunning) {
      pause();
    } else if (hasStarted) {
      resume();
    } else {
      start();
      setHasStarted(true);
    }
  };

  const handleReset = () => {
    setIsExpired(false);
    setHasStarted(false);
    restart(makeExpiry(durationSeconds), false);
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  const statusLabel = isExpired
    ? "Terminé"
    : isRunning
      ? "En cours"
      : hasStarted
        ? "En pause"
        : "Prêt";

  const toggleLabel = isRunning ? "Pause" : hasStarted ? "Reprendre" : "Démarrer";

  return (
    <View className="flex-1 items-center justify-center bg-boxing-white dark:bg-boxing-dark">
      {isExpired && (
        <View className="absolute top-16 bg-boxing-alert px-8 py-3 rounded-full">
          <Text className="text-boxing-white font-bold text-base uppercase tracking-widest">
            Terminé !
          </Text>
        </View>
      )}

      <Text className="text-8xl font-black font-mono text-boxing-navy dark:text-boxing-white tracking-widest">
        {pad(minutes)}:{pad(seconds)}
      </Text>

      <Text className="text-sm font-semibold uppercase tracking-widest mt-4 text-boxing-blue dark:text-boxing-sky">
        {statusLabel}
      </Text>

      <View className="flex-row gap-4 mt-12">
        <Button
          size="xl"
          action="primary"
          className="rounded-full !bg-boxing-navy dark:!bg-boxing-blue"
          onPress={handleToggle}
          isDisabled={isExpired}
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
