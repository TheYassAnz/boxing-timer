import { setAudioModeAsync } from "expo-audio";
import { Stack } from "expo-router";

import "@/global.css";

// Sons même en silencieux et écran verrouillé, par-dessus la musique.
setAudioModeAsync({
  playsInSilentMode: true,
  shouldPlayInBackground: true,
  interruptionMode: "mixWithOthers",
}).catch(() => {});

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
