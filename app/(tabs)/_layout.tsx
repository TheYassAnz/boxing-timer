import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { NativeTabs } from "expo-router/native-tabs";

import { usePalette } from "@/components/timer/theme";

export default function TabLayout() {
  const { accent } = usePalette("round");
  return (
    <NativeTabs tintColor={accent}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Timer</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={
            <NativeTabs.Trigger.VectorIcon
              family={MaterialCommunityIcons}
              name="timer"
            />
          }
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="community">
        <NativeTabs.Trigger.Label>Community</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={
            <NativeTabs.Trigger.VectorIcon
              family={MaterialCommunityIcons}
              name="account-group"
            />
          }
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
