import { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";

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

export default function EditModal({
  visible,
  label,
  value,
  hint,
  min,
  max,
  onSave,
  onClose,
}: EditModalProps) {
  const [text, setText] = useState(String(value));
  const [wasVisible, setWasVisible] = useState(visible);

  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setText(String(value));
  }

  const handleSave = () => {
    const n = parseInt(text, 10);
    if (!isNaN(n)) onSave(Math.min(max, Math.max(min, n)));
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
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
