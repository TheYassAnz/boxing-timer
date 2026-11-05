import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface ConfigRowProps {
  label: string;
  display: string;
  onEdit: () => void;
}

export default function ConfigRow({ label, display, onEdit }: ConfigRowProps) {
  return (
    <View className="flex-row items-center justify-between w-full px-8 py-3">
      <Text className="text-boxing-navy dark:text-boxing-sky text-xs font-semibold uppercase tracking-widest">
        {label}
      </Text>
      <View className="flex-row items-center gap-3">
        <Text className="text-boxing-navy dark:text-boxing-white font-bold text-sm">
          {display}
        </Text>
        <Pressable onPress={onEdit} className="p-1" hitSlop={8}>
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
