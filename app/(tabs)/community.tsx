import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function Community() {
  return (
    <View className="flex-1 items-center justify-center gap-4 px-8">
      <MaterialCommunityIcons name="account-group" size={64} color="#6b7280" />
      <Text className="text-2xl font-bold text-white">Community</Text>
      <Text className="text-center text-gray-400">
        Partage tes workouts et découvre ceux de la communauté.
      </Text>
      <Text className="text-sm font-medium text-gray-500">
        Bientôt disponible.
      </Text>
    </View>
  );
}
