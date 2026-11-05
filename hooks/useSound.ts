import { useAudioPlayer } from "expo-audio";

export function useSound(source: number) {
  const player = useAudioPlayer(source);
  return () => {
    // Play only once rewound: a player left at the end of the clip stays silent.
    player
      .seekTo(0)
      .catch(() => {})
      .then(() => player.play());
  };
}
