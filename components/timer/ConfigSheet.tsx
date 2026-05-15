import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Button, ButtonText } from "@/components/ui/button";

export interface Config {
  rounds: number;
  roundDuration: number;
  restDuration: number;
}

interface Props {
  visible: boolean;
  config: Config;
  onSave: (c: Config) => void;
  onClose: () => void;
}

function Field({
  label,
  value,
  onChangeText,
  hint,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  hint: string;
}) {
  return (
    <View className="mb-5">
      <Text className="text-boxing-navy dark:text-boxing-sky text-xs font-semibold uppercase tracking-widest mb-2">
        {label}
      </Text>
      <TextInput
        className="bg-boxing-navy/10 dark:bg-boxing-white/10 text-boxing-navy dark:text-boxing-white font-bold text-xl rounded-xl px-4 py-3"
        value={value}
        onChangeText={onChangeText}
        keyboardType="number-pad"
        returnKeyType="done"
        maxLength={4}
        selectTextOnFocus
        placeholderTextColor="rgba(0,0,0,0.3)"
      />
      <Text className="text-boxing-navy/40 dark:text-boxing-white/40 text-xs mt-1">
        {hint}
      </Text>
    </View>
  );
}

export default function ConfigSheet({ visible, config, onSave, onClose }: Props) {
  const [rounds, setRounds] = useState(String(config.rounds));
  const [roundDuration, setRoundDuration] = useState(String(config.roundDuration));
  const [restDuration, setRestDuration] = useState(String(config.restDuration));

  useEffect(() => {
    if (visible) {
      setRounds(String(config.rounds));
      setRoundDuration(String(config.roundDuration));
      setRestDuration(String(config.restDuration));
    }
  }, [visible, config]);

  const handleSave = () => {
    const r = Math.min(12, Math.max(1, parseInt(rounds) || 1));
    const rd = Math.min(600, Math.max(30, parseInt(roundDuration) || 180));
    const rest = Math.min(300, Math.max(15, parseInt(restDuration) || 60));
    onSave({ rounds: r, roundDuration: rd, restDuration: rest });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <Pressable
          className="absolute top-0 left-0 right-0 bottom-0 bg-black/50"
          onPress={onClose}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View className="bg-boxing-white dark:bg-boxing-dark rounded-t-3xl px-6 pt-4 pb-10">
            <View className="w-10 h-1 bg-boxing-navy/20 dark:bg-boxing-white/20 rounded-full self-center mb-6" />
            <Text className="text-boxing-navy dark:text-boxing-white text-lg font-bold uppercase tracking-widest mb-6">
              Réglages
            </Text>
            <Field
              label="Rounds"
              value={rounds}
              onChangeText={setRounds}
              hint="1 – 12"
            />
            <Field
              label="Durée du round (sec)"
              value={roundDuration}
              onChangeText={setRoundDuration}
              hint="30 – 600  ·  ex: 180 = 3 min"
            />
            <Field
              label="Temps de repos (sec)"
              value={restDuration}
              onChangeText={setRestDuration}
              hint="15 – 300  ·  ex: 60 = 1 min"
            />
            <Button
              size="xl"
              action="primary"
              className="rounded-full !bg-boxing-navy dark:!bg-boxing-blue w-full mt-2"
              onPress={handleSave}
            >
              <ButtonText className="uppercase tracking-widest font-bold">
                Valider
              </ButtonText>
            </Button>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
