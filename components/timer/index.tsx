import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { useTimer } from "react-timer-hook";
import { Button, ButtonText } from "../ui/button";

type Phase = "idle" | "round" | "rest" | "done";

interface Config {
  rounds: number;
  roundDuration: number;
  restDuration: number;
}

const DEFAULTS: Config = { rounds: 3, roundDuration: 180, restDuration: 60 };
const STORAGE_KEY = "boxing-timer-config";

function makeExpiry(seconds: number): Date {
  const t = new Date();
  t.setSeconds(t.getSeconds() + seconds);
  return t;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function fmtDuration(s: number): string {
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return rem === 0 ? `${m} min` : `${m}:${pad(rem)}`;
}

interface EditModalProps {
  visible: boolean;
  label: string;
  value: number;
  hint: string;
  min: number;
  max: number;
  onSave: (v: number) => void;
  onClose: () => void;
}

function EditModal({ visible, label, value, hint, min, max, onSave, onClose }: EditModalProps) {
  const [text, setText] = useState(String(value));

  useEffect(() => {
    if (visible) setText(String(value));
  }, [visible, value]);

  const handleSave = () => {
    const n = parseInt(text, 10);
    if (!isNaN(n)) onSave(Math.min(max, Math.max(min, n)));
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        className="flex-1 items-center justify-center bg-black/60"
        onPress={onClose}
      >
        <Pressable onPress={() => {}}>
          <View className="bg-boxing-white dark:bg-boxing-dark rounded-2xl px-6 py-6 w-72">
            <Text className="text-boxing-navy dark:text-boxing-white text-xs font-semibold uppercase tracking-widest mb-4">
              {label}
            </Text>
            <TextInput
              className="bg-boxing-navy/10 dark:bg-boxing-white/10 text-boxing-navy dark:text-boxing-white font-bold text-3xl rounded-xl px-4 py-3 text-center"
              value={text}
              onChangeText={setText}
              keyboardType="number-pad"
              returnKeyType="done"
              onSubmitEditing={handleSave}
              maxLength={4}
              selectTextOnFocus
              autoFocus
            />
            <Text className="text-boxing-navy/40 dark:text-boxing-white/40 text-xs mt-2 text-center">
              {hint}
            </Text>
            <View className="flex-row gap-3 mt-5">
              <Button
                size="md"
                action="secondary"
                className="flex-1 rounded-xl !bg-boxing-navy/10 dark:!bg-boxing-white/10"
                onPress={onClose}
              >
                <ButtonText className="!text-boxing-navy dark:!text-boxing-white">
                  Annuler
                </ButtonText>
              </Button>
              <Button
                size="md"
                action="primary"
                className="flex-1 rounded-xl !bg-boxing-navy dark:!bg-boxing-blue"
                onPress={handleSave}
              >
                <ButtonText className="font-bold">OK</ButtonText>
              </Button>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

interface ConfigRowProps {
  label: string;
  display: string;
  onEdit: () => void;
}

function ConfigRow({ label, display, onEdit }: ConfigRowProps) {
  return (
    <View className="flex-row items-center justify-between w-full px-8 py-3">
      <Text className="text-boxing-navy dark:text-boxing-sky text-xs font-semibold uppercase tracking-widest">
        {label}
      </Text>
      <View className="flex-row items-center gap-3">
        <Text className="text-boxing-navy dark:text-boxing-white font-bold text-sm">
          {display}
        </Text>
        <Pressable
          onPress={onEdit}
          className="p-1"
          hitSlop={8}
        >
          <MaterialCommunityIcons
            name="pencil-outline"
            size={18}
            color="#64b5f6"
          />
        </Pressable>
      </View>
    </View>
  );
}

type EditTarget = "rounds" | "roundDuration" | "restDuration" | null;

export default function Timer() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [currentRound, setCurrentRound] = useState(1);
  const [config, setConfig] = useState<Config>(DEFAULTS);
  const [editing, setEditing] = useState<EditTarget>(null);

  const phaseRef = useRef<Phase>("idle");
  const roundRef = useRef(1);
  const configRef = useRef<Config>(DEFAULTS);
  phaseRef.current = phase;
  roundRef.current = currentRound;
  configRef.current = config;

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val) setConfig(JSON.parse(val));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const { seconds, minutes, isRunning, pause, resume, restart } = useTimer({
    expiryTimestamp: makeExpiry(DEFAULTS.roundDuration),
    autoStart: false,
    interval: 1000,
    onExpire: () => {
      const p = phaseRef.current;
      const round = roundRef.current;
      const cfg = configRef.current;

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (p === "round") {
        if (round < cfg.rounds) {
          setPhase("rest");
          // setTimeout defers restart until after react-timer-hook sets isRunning=false internally
          setTimeout(() => restart(makeExpiry(cfg.restDuration), true), 0);
        } else {
          setPhase("done");
        }
      } else if (p === "rest") {
        setCurrentRound((r) => r + 1);
        setPhase("round");
        setTimeout(() => restart(makeExpiry(cfg.roundDuration), true), 0);
      }
    },
  });

  useEffect(() => {
    if (isRunning && minutes === 0 && seconds === 10) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  const handleToggle = () => {
    if (isRunning) {
      pause();
    } else if (phase === "idle") {
      setPhase("round");
      restart(makeExpiry(config.roundDuration), true);
    } else {
      resume();
    }
  };

  const handleReset = () => {
    setPhase("idle");
    setCurrentRound(1);
    restart(makeExpiry(config.roundDuration), false);
  };

  const handleSave = (key: keyof Config, value: number) => {
    setConfig((prev) => {
      const next = { ...prev, [key]: value };
      if (phase === "idle") restart(makeExpiry(next.roundDuration), false);
      return next;
    });
  };

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
    ? isRest ? "Repos" : "En cours"
    : phase === "idle" ? "Prêt"
    : phase === "done" ? "Terminé"
    : "En pause";

  const toggleLabel =
    isRunning ? "Pause" : phase === "idle" ? "Démarrer" : "Reprendre";

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
