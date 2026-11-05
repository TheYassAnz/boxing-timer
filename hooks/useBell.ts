import { useAudioPlayer } from "expo-audio";

const BELL = require("../assets/sounds/boxing_bell.wav");

export function useBell() {
  const bell = useAudioPlayer(BELL);
  return () => {
    bell.seekTo(0).catch(() => {});
    bell.play();
  };
}
