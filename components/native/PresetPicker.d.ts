export type PresetPickerProps = {
  labels: string[];
  selectedIndex: number;
  onSelect: (i: number) => void;
};

export declare function PresetPicker(
  props: PresetPickerProps,
): React.JSX.Element;
