import { Motion } from "@legendapp/motion";
import { useKeepAwake } from "expo-keep-awake";
import { Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PresetPicker } from "@/components/native/PresetPicker";
import { RoundButton } from "@/components/native/RoundButton";
import { SettingsList } from "@/components/native/SettingsList";
import { useBoxingTimer } from "@/hooks/useBoxingTimer";
import { useSound } from "@/hooks/useSound";
import { useStoredConfig } from "@/hooks/useStoredConfig";
import ProgressRing from "./ProgressRing";
import { pad, PRESETS, presetIndex, roundLabel } from "./config";
import { usePalette } from "./theme";

const PRESET_LABELS = PRESETS.map((p) => p.label);

export default function Timer() {
  useKeepAwake();

  const [config, setConfig] = useStoredConfig();
  const playBell = useSound(require("@/assets/sounds/boxing_bell.wav"));
  const playClap = useSound(require("@/assets/sounds/clapper.wav"));
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const {
    phase,
    currentRound,
    minutes,
    seconds,
    remainingMs,
    progress,
    isRunning,
    toggle,
    reset,
  } = useBoxingTimer(config, { bell: playBell, clap: playClap });
  const palette = usePalette(phase);

  const isIdle = phase === "idle";
  const isDone = phase === "done";
  const pulse =
    isRunning && remainingMs <= 10_000 && Math.floor(remainingMs / 500) % 2 === 0;

  const status = isDone ? "Terminé" : isRunning ? "En cours" : "En pause";

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: isIdle ? palette.groupedBg : palette.bg,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <Motion.View
        key={isIdle ? "idle" : phase}
        style={{ flex: 1 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "timing", duration: 150 }}
      >
        {isIdle ? (
          <View className="flex-1">
            <View className="px-4 pt-2 pb-3 gap-3">
              <Text
                className="text-[34px] font-bold"
                style={{ color: palette.text }}
              >
                Timer
              </Text>
              <PresetPicker
                labels={PRESET_LABELS}
                selectedIndex={presetIndex(config)}
                onSelect={(i) => setConfig(PRESETS[i].config)}
              />
            </View>
            <View className="flex-1">
              <SettingsList
                config={config}
                onChange={setConfig}
                tint={palette.accent}
              />
            </View>
            <View className="items-center py-6">
              <RoundButton
                label="Démarrer"
                onPress={toggle}
                tone="accent"
                size={96}
                color={palette.accent}
              />
            </View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center px-4">
            <Text
              className="text-xl font-semibold mb-6"
              style={{ color: palette.secondary }}
            >
              {phase === "rest" ? "Repos" : roundLabel(currentRound, config.rounds)}
            </Text>
            <ProgressRing
              size={Math.min(width - 32, 340)}
              progress={progress}
              color={palette.accent}
              trackColor={palette.track}
            >
              <Motion.View
                animate={{ scale: pulse ? 1.03 : 1 }}
                transition={{ type: "timing", duration: 250 }}
              >
                <Text
                  className="text-8xl font-extralight"
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{ color: palette.text, fontVariant: ["tabular-nums"] }}
                >
                  {pad(minutes)}:{pad(seconds)}
                </Text>
              </Motion.View>
              <Text
                className="text-lg mt-1"
                style={{ color: isDone ? palette.accent : palette.secondary }}
              >
                {status}
              </Text>
            </ProgressRing>
            <View className="w-full flex-row justify-between px-4 mt-12">
              <RoundButton
                label="Réinitialiser"
                onPress={reset}
                tone="neutral"
                size={80}
                color={palette.neutral}
              />
              <RoundButton
                label={isRunning ? "Pause" : "Reprendre"}
                onPress={toggle}
                tone="accent"
                size={80}
                color={palette.accent}
                disabled={isDone}
              />
            </View>
          </View>
        )}
      </Motion.View>
    </View>
  );
}
