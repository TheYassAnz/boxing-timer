import { Button, Host, Text } from "@expo/ui/swift-ui";
import {
  background,
  buttonStyle,
  contentShape,
  disabled as disabledMod,
  font,
  foregroundStyle,
  frame,
  opacity,
  shapes,
} from "@expo/ui/swift-ui/modifiers";
import type { RoundButtonProps } from "./RoundButton";

export function RoundButton({
  label,
  onPress,
  tone,
  size,
  color,
  disabled = false,
}: RoundButtonProps) {
  return (
    <Host matchContents style={{ width: size, height: size }}>
      <Button
        onPress={onPress}
        modifiers={[
          buttonStyle("plain"),
          disabledMod(disabled),
          opacity(disabled ? 0.4 : 1),
        ]}
      >
        <Text
          modifiers={[
            font({ size: Math.round(size * 0.2), weight: "semibold" }),
            foregroundStyle(tone === "accent" ? color : "primary"),
            frame({ width: size, height: size }),
            // 8-digit hex = color at ~25% alpha, like the Clock app's tinted discs.
            background(`${color}40`, shapes.circle()),
            contentShape(shapes.circle()),
          ]}
        >
          {label}
        </Text>
      </Button>
    </Host>
  );
}
