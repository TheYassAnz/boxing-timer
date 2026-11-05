import { Host, Picker, Text } from "@expo/ui/swift-ui";
import { pickerStyle, tag } from "@expo/ui/swift-ui/modifiers";
import type { PresetPickerProps } from "./PresetPicker";

export function PresetPicker({
  labels,
  selectedIndex,
  onSelect,
}: PresetPickerProps) {
  return (
    <Host matchContents={{ vertical: true }}>
      <Picker<number>
        selection={selectedIndex}
        onSelectionChange={onSelect}
        modifiers={[pickerStyle("segmented")]}
      >
        {labels.map((l, i) => (
          <Text key={l} modifiers={[tag(i)]}>
            {l}
          </Text>
        ))}
      </Picker>
    </Host>
  );
}
