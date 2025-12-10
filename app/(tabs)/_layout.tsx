import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Icon, NativeTabs, VectorIcon } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index" options={{ title: "Timer" }}>
        <Icon
          src={<VectorIcon family={MaterialCommunityIcons} name="timer" />}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="community" options={{ title: "Community" }}>
        <Icon
          src={
            <VectorIcon family={MaterialCommunityIcons} name="account-group" />
          }
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="about" options={{ title: "About" }}>
        <Icon
          src={
            <VectorIcon family={MaterialCommunityIcons} name="information" />
          }
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
