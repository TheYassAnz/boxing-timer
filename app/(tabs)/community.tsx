import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function Community() {
  return (
    <View className="flex-1 items-center justify-center gap-4 px-8 bg-boxing-white dark:bg-boxing-dark">
      <MaterialCommunityIcons name="account-group" size={64} color="#6096ba" />
      <Text className="text-2xl font-bold text-boxing-navy dark:text-boxing-white">
        Community
      </Text>
      <Text className="text-center text-boxing-blue dark:text-boxing-sky">
        Partage tes workouts et découvre ceux de la communauté.
      </Text>
      <Text className="text-sm font-medium text-boxing-navy/50 dark:text-boxing-white/50">
        Bientôt disponible.
      </Text>
    </View>
  );
}
