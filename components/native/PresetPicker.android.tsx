import {
  Host,
  SegmentedButton,
  SingleChoiceSegmentedButtonRow,
  Text,
} from "@expo/ui/jetpack-compose";
import { fillMaxWidth } from "@expo/ui/jetpack-compose/modifiers";
import { usePalette } from "@/components/timer/theme";
import type { PresetPickerProps } from "./PresetPicker";

export function PresetPicker({
  labels,
  selectedIndex,
  onSelect,
}: PresetPickerProps) {
  const { accent, neutral, text, secondary, groupedBg } = usePalette("idle");
  return (
    <Host matchContents={{ vertical: true }}>
      <SingleChoiceSegmentedButtonRow modifiers={[fillMaxWidth()]}>
        {labels.map((l, i) => (
          <SegmentedButton
            key={l}
            selected={i === selectedIndex}
            onClick={() => onSelect(i)}
            colors={{
              activeContainerColor: neutral,
              activeContentColor: accent,
              activeBorderColor: secondary,
              inactiveContainerColor: groupedBg,
              inactiveContentColor: text,
              inactiveBorderColor: secondary,
            }}
          >
            <SegmentedButton.Label>
              <Text maxLines={1}>{l}</Text>
            </SegmentedButton.Label>
          </SegmentedButton>
        ))}
      </SingleChoiceSegmentedButtonRow>
    </Host>
  );
}
