import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { usePalette } from "@/components/timer/theme";

export default function Community() {
  const palette = usePalette("round");
  return (
    <View
      className="flex-1 items-center justify-center gap-4 px-8"
      style={{ backgroundColor: palette.bg }}
    >
      <MaterialCommunityIcons
        name="account-group"
        size={64}
        color={palette.accent}
      />
      <Text
        className="text-2xl font-bold"
        style={{ color: palette.text }}
      >
        Community
      </Text>
      <Text className="text-center" style={{ color: palette.secondary }}>
        Partage tes workouts et découvre ceux de la communauté.
      </Text>
      <Text
        className="text-sm font-medium"
        style={{ color: palette.secondary }}
      >
        Bientôt disponible.
      </Text>
    </View>
  );
}
