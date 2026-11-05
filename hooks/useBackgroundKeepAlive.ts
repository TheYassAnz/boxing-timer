import { createAudioPlayer } from "expo-audio";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

// iOS suspends JS with the screen locked unless audio is playing; a silent loop keeps the tick alive.
export function useBackgroundKeepAlive(active: boolean) {
  const [player] = useState(() => {
    const silence = createAudioPlayer(require("@/assets/sounds/silence.wav"));
    silence.loop = true;
    return silence;
  });
  useEffect(() => {
    if (Platform.OS !== "ios") return;
    if (active) player.play();
    else player.pause();
  }, [active, player]);
}
