import {
  Button,
  FilledTonalButton,
  Host,
  Shape,
  Text,
} from "@expo/ui/jetpack-compose";
import { size as sizeMod } from "@expo/ui/jetpack-compose/modifiers";
import { usePalette } from "@/components/timer/theme";
import type { RoundButtonProps } from "./RoundButton";

export function RoundButton({
  label,
  onPress,
  tone,
  size,
  color,
  disabled = false,
}: RoundButtonProps) {
  const { text, bg } = usePalette("idle");
  const r = size / 2;
  const Btn = tone === "accent" ? Button : FilledTonalButton;
  return (
    <Host matchContents style={{ width: size, height: size }}>
      <Btn
        onClick={onPress}
        enabled={!disabled}
        // Shape.Circle({}) renders the button invisible; a full corner radius draws the disc.
        shape={Shape.RoundedCorner({
          cornerRadii: { topStart: r, topEnd: r, bottomStart: r, bottomEnd: r },
        })}
        contentPadding={{ start: 0, top: 0, end: 0, bottom: 0 }}
        colors={{
          containerColor: color,
          contentColor: tone === "accent" ? bg : text,
        }}
        modifiers={[sizeMod(size, size)]}
      >
        <Text
          maxLines={1}
          softWrap={false}
          style={{ fontSize: Math.round(size * 0.18), fontWeight: "600" }}
        >
          {label}
        </Text>
      </Btn>
    </Host>
  );
}
