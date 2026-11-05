import { useAudioPlayer } from "expo-audio";

export function useSound(source: number) {
  const player = useAudioPlayer(source);
  return () => {
    player.seekTo(0).catch(() => {});
    player.play();
  };
}
