import { createAudioPlayer } from "expo-audio";
import { useEffect, useState } from "react";
import { AppState, Platform } from "react-native";

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

  // An interruption (call, Siri, alarm) stops the loop without resuming it.
  useEffect(() => {
    if (Platform.OS !== "ios" || !active) return;
    const sub = AppState.addEventListener("change", (s) => {
      if (s === "active" && !player.playing) player.play();
    });
    return () => sub.remove();
  }, [active, player]);
}
