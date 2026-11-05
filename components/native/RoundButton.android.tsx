import {
  Button,
  FilledTonalButton,
  Host,
  Shape,
  Text,
} from "@expo/ui/jetpack-compose";
import { size as sizeMod } from "@expo/ui/jetpack-compose/modifiers";
import { useColorScheme } from "react-native";
import type { RoundButtonProps } from "./RoundButton";

export function RoundButton({
  label,
  onPress,
  tone,
  size,
  color,
  disabled = false,
}: RoundButtonProps) {
  const onAccent = useColorScheme() === "dark" ? "#141218" : "#FFFFFF";
  const Btn = tone === "accent" ? Button : FilledTonalButton;
  return (
    <Host matchContents style={{ width: size, height: size }}>
      <Btn
        onClick={onPress}
        enabled={!disabled}
        shape={Shape.Circle({})}
        contentPadding={{ start: 0, top: 0, end: 0, bottom: 0 }}
        colors={
          tone === "accent"
            ? { containerColor: color, contentColor: onAccent }
            : { containerColor: color }
        }
        modifiers={[sizeMod(size, size)]}
      >
        <Text
          maxLines={1}
          softWrap={false}
          style={{
            // Compose Text has no auto-shrink: scale long labels to fit the disc.
            fontSize: Math.round(
              Math.min(size * 0.18, (size * 1.4) / label.length),
            ),
            fontWeight: "600",
          }}
        >
          {label}
        </Text>
      </Btn>
    </Host>
  );
}
