import { useKeepAwake } from "expo-keep-awake";
import { useState } from "react";
import { Text, View } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { useBell } from "@/hooks/useBell";
import { useBoxingTimer } from "@/hooks/useBoxingTimer";
import { useStoredConfig } from "@/hooks/useStoredConfig";
import ConfigRow from "./ConfigRow";
import EditModal from "./EditModal";
import { type Config, fmtDuration, pad } from "./config";

type EditTarget = keyof Config | null;

export default function Timer() {
  useKeepAwake();

  const [config, setConfig] = useStoredConfig();
  const [editing, setEditing] = useState<EditTarget>(null);
  const playBell = useBell();
  const {
    phase,
    currentRound,
    minutes,
    seconds,
    isRunning,
    toggle: handleToggle,
    reset: handleReset,
  } = useBoxingTimer(config, playBell);

  const handleSave = (key: keyof Config, value: number) =>
    setConfig({ ...config, [key]: value });

  const isRest = phase === "rest";
  const isDone = phase === "done";

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

  return (
    <View
      className={`flex-1 items-center justify-center ${
        isRest
          ? "bg-boxing-navy dark:bg-boxing-navy"
          : "bg-boxing-white dark:bg-boxing-dark"
      }`}
    >
      {isDone && (
        <View className="absolute top-16 bg-boxing-alert px-8 py-3 rounded-full">
          <Text className="text-boxing-white font-bold text-base uppercase tracking-widest">
            Terminé !
          </Text>
        </View>
      )}

      <Text
        className={`text-sm font-semibold uppercase tracking-widest mb-3 ${
          isRest ? "text-boxing-sky" : "text-boxing-blue dark:text-boxing-sky"
        }`}
      >
        {roundLabel}
      </Text>

      <Text
        className={`text-8xl font-black font-mono tracking-widest ${
          isRest
            ? "text-boxing-white"
            : "text-boxing-navy dark:text-boxing-white"
        }`}
      >
        {timerDisplay}
      </Text>

      <Text
        className={`text-xs font-semibold uppercase tracking-widest mt-4 ${
          isRest ? "text-boxing-sky" : "text-boxing-blue dark:text-boxing-sky"
        }`}
      >
        {statusLabel}
      </Text>

      <View className="flex-row gap-4 mt-10">
        <Button
          size="xl"
          action="primary"
          className={`rounded-full ${
            isRest ? "!bg-boxing-blue" : "!bg-boxing-navy dark:!bg-boxing-blue"
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
          className="rounded-full !bg-boxing-alert"
          onPress={handleReset}
        >
          <ButtonText className="uppercase tracking-widest font-bold">
            Reset
          </ButtonText>
        </Button>
      </View>

      {phase === "idle" && (
        <View className="mt-8 w-full">
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
