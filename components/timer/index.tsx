import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useTimer } from "react-timer-hook";
import { Button, ButtonText } from "../ui/button";

export default function Timer({ expiryTimestamp }: { expiryTimestamp: Date }) {
  const [isTimerExpired, setTimerExpired] = useState<boolean>(false);
  const {
    totalSeconds,
    milliseconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => setTimerExpired(true),
    interval: 100,
  });

  const resetTimer = () => {
    setTimerExpired(false);
    const now = new Date();
    now.setSeconds(now.getSeconds() + 10);
    restart(now);
  };

  useEffect(() => {
    if (isTimerExpired) {
      // You can add additional side effects here when the timer expires

      alert("Timer expired!");
    }
  }, [isTimerExpired]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-5xl">
        {minutes}:{seconds}
      </Text>
      <Text className="font-light">
        {isTimerExpired ? "Timer expired" : isRunning ? "Running" : "Paused"}
      </Text>
      <View className="flex-row gap-4 mt-4">
        <Button variant="solid" size="lg" action="primary" onPress={resume}>
          <ButtonText>Start</ButtonText>
        </Button>
        <Button variant="solid" size="lg" action="secondary" onPress={pause}>
          <ButtonText>Pause</ButtonText>
        </Button>
      </View>
      <View className="mt-4">
        <Button
          variant="solid"
          size="lg"
          action="negative"
          onPress={resetTimer}
        >
          <ButtonText>Reset</ButtonText>
        </Button>
      </View>
    </View>
  );
}
