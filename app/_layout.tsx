import { setAudioModeAsync } from "expo-audio";
import { Stack } from "expo-router";
import { AppRegistry, Platform } from "react-native";

import "@/global.css";

// A boxing bell must ring with the mute switch on, with the screen locked, and over the user's music.
setAudioModeAsync({
  playsInSilentMode: true,
  shouldPlayInBackground: true,
  interruptionMode: "mixWithOthers",
}).catch(() => {});

// Started by SessionNotificationModule: an active headless task stops Android from pausing JS timers while backgrounded.
if (Platform.OS === "android") {
  AppRegistry.registerHeadlessTask("TimerKeepAlive", () => () => new Promise<void>(() => {}));
}

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
