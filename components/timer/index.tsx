import { Motion } from "@legendapp/motion";
import { useKeepAwake } from "expo-keep-awake";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { useBell } from "@/hooks/useBell";
import { useBoxingTimer } from "@/hooks/useBoxingTimer";
import { useStoredConfig } from "@/hooks/useStoredConfig";
import ConfigRow from "./ConfigRow";
import EditModal from "./EditModal";
import ProgressRing from "./ProgressRing";
import { type Config, fmtDuration, pad, PRESETS, sameConfig } from "./config";

type EditTarget = keyof Config | null;

const RING = {
  light: { color: "#274c77", track: "rgba(39,76,119,0.12)" },
  dark: { color: "#6096ba", track: "rgba(231,236,239,0.1)" },
  rest: { color: "#a3cef1", track: "rgba(231,236,239,0.15)" },
};

export default function Timer() {
  useKeepAwake();

  const [config, setConfig] = useStoredConfig();
  const [editing, setEditing] = useState<EditTarget>(null);
  const playBell = useBell();
  const scheme = useColorScheme();
  const { width } = useWindowDimensions();
  const {
    phase,
    currentRound,
    minutes,
    seconds,
    remainingMs,
    progress,
    isRunning,
    toggle: handleToggle,
    reset: handleReset,
  } = useBoxingTimer(config, playBell);

  const handleSave = (key: keyof Config, value: number) =>
    setConfig({ ...config, [key]: value });

  const isRest = phase === "rest";
  const isDone = phase === "done";
  const ring = isRest ? RING.rest : scheme === "dark" ? RING.dark : RING.light;
  const ringSize = Math.min(width - 48, 320);
  const pulse =
    isRunning &&
    remainingMs <= 10_000 &&
    Math.floor(remainingMs / 500) % 2 === 0;

  const timerDisplay =
    phase === "idle"
      ? `${pad(Math.floor(config.roundDuration / 60))}:${pad(config.roundDuration % 60)}`
      : `${pad(minutes)}:${pad(seconds)}`;

  const roundLabel =
    phase === "idle"
      ? `${config.rounds} rounds · ${fmtDuration(config.roundDuration)}`
      : phase === "round"
        ? `Round ${currentRound} / ${config.rounds}`
        : phase === "rest"
          ? `Repos · Round ${currentRound + 1} →`
          : `${config.rounds} rounds terminés`;

  const statusLabel = isRunning
    ? isRest
      ? "Repos"
      : "En cours"
    : phase === "idle"
      ? "Prêt"
      : phase === "done"
        ? "Terminé"
        : "En pause";

  const toggleLabel = isRunning
    ? "Pause"
    : phase === "idle"
      ? "Démarrer"
      : "Reprendre";

  const secondaryText = isRest
    ? "text-boxing-sky"
    : "text-boxing-blue dark:text-boxing-sky";

  return (
    <View
      className={`flex-1 ${
        isRest
          ? "bg-boxing-navy dark:bg-boxing-navy"
          : "bg-boxing-white dark:bg-boxing-dark"
      }`}
    >
      <ScrollView contentContainerClassName="flex-grow items-center justify-center px-6 py-12">
        <Motion.View
          key={phase}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "timing", duration: 150 }}
        >
          <View className="items-center">
            <Text
              className={`text-sm font-semibold uppercase tracking-widest mb-4 ${secondaryText}`}
            >
              {roundLabel}
            </Text>

            <ProgressRing
              size={ringSize}
              progress={progress}
              color={ring.color}
              trackColor={ring.track}
            >
              <Motion.View
                animate={{ scale: pulse ? 1.02 : 1 }}
                transition={{ type: "timing", duration: 250 }}
              >
                <Text
                  className={`text-7xl font-black font-mono tracking-widest ${
                    isRest
                      ? "text-boxing-white"
                      : "text-boxing-navy dark:text-boxing-white"
                  }`}
                >
                  {timerDisplay}
                </Text>
              </Motion.View>
              <Text
                className={`text-xs font-semibold uppercase tracking-widest mt-2 ${secondaryText}`}
              >
                {statusLabel}
              </Text>
            </ProgressRing>
          </View>
        </Motion.View>

        <View className="flex-row gap-4 mt-10">
          <Button
            size="xl"
            action="primary"
            className={`rounded-full active:scale-[0.97] ${
              isRest
                ? "!bg-boxing-blue"
                : "!bg-boxing-navy dark:!bg-boxing-blue"
            }`}
            onPress={handleToggle}
            isDisabled={isDone}
          >
            <ButtonText className="uppercase tracking-widest font-bold">
              {toggleLabel}
            </ButtonText>
          </Button>

          <Button
            size="xl"
            action="negative"
            className="rounded-full active:scale-[0.97] !bg-boxing-alert"
            onPress={handleReset}
          >
            <ButtonText className="uppercase tracking-widest font-bold">
              Reset
            </ButtonText>
          </Button>
        </View>

        {phase === "idle" && (
          <View className="mt-8 w-full items-center">
            <View className="flex-row gap-2">
              {PRESETS.map((p) => {
                const active = sameConfig(p.config, config);
                return (
                  <Pressable
                    key={p.label}
                    onPress={() => setConfig(p.config)}
                    className={`rounded-full px-4 py-2 border active:scale-[0.97] ${
                      active
                        ? "bg-boxing-navy border-boxing-navy dark:bg-boxing-blue dark:border-boxing-blue"
                        : "border-boxing-navy/30 dark:border-boxing-sky/40"
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold uppercase tracking-widest ${
                        active
                          ? "text-boxing-white"
                          : "text-boxing-navy dark:text-boxing-sky"
                      }`}
                    >
                      {p.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View className="mt-4 w-full">
              <ConfigRow
                label="Rounds"
                display={String(config.rounds)}
                onEdit={() => setEditing("rounds")}
              />
              <ConfigRow
                label="Durée"
                display={fmtDuration(config.roundDuration)}
                onEdit={() => setEditing("roundDuration")}
              />
              <ConfigRow
                label="Repos"
                display={fmtDuration(config.restDuration)}
                onEdit={() => setEditing("restDuration")}
              />
            </View>
          </View>
        )}
      </ScrollView>

      {isDone && (
        <View className="absolute top-16 left-0 right-0 items-center">
          <Motion.View
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "timing", duration: 200 }}
          >
            <View className="bg-boxing-alert px-8 py-3 rounded-full">
              <Text className="text-boxing-white font-bold text-base uppercase tracking-widest">
                Terminé !
              </Text>
            </View>
          </Motion.View>
        </View>
      )}

      <EditModal
        visible={editing === "rounds"}
        label="Rounds"
        value={config.rounds}
        hint="1 – 100"
        min={1}
        max={100}
        onSave={(v) => handleSave("rounds", v)}
        onClose={() => setEditing(null)}
      />
      <EditModal
        visible={editing === "roundDuration"}
        label="Durée du round (sec)"
        value={config.roundDuration}
        hint="1 – 300  ·  ex : 180 = 3 min"
        min={1}
        max={300}
        onSave={(v) => handleSave("roundDuration", v)}
        onClose={() => setEditing(null)}
      />
      <EditModal
        visible={editing === "restDuration"}
        label="Temps de repos (sec)"
        value={config.restDuration}
        hint="1 – 300  ·  ex : 60 = 1 min"
        min={1}
        max={300}
        onSave={(v) => handleSave("restDuration", v)}
        onClose={() => setEditing(null)}
      />
    </View>
  );
}
