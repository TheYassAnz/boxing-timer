import {
  Host,
  SegmentedButton,
  SingleChoiceSegmentedButtonRow,
  Text,
} from "@expo/ui/jetpack-compose";
import { fillMaxWidth } from "@expo/ui/jetpack-compose/modifiers";
import type { PresetPickerProps } from "./PresetPicker";

export function PresetPicker({
  labels,
  selectedIndex,
  onSelect,
}: PresetPickerProps) {
  return (
    <Host matchContents={{ vertical: true }}>
      <SingleChoiceSegmentedButtonRow modifiers={[fillMaxWidth()]}>
        {labels.map((l, i) => (
          <SegmentedButton
            key={l}
            selected={i === selectedIndex}
            onClick={() => onSelect(i)}
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
