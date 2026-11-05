import { setAudioModeAsync } from "expo-audio";
import { Stack } from "expo-router";

import "@/global.css";

// The bell must ring even with the iPhone's silent switch on.
setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
