import type { Config } from "@/components/timer/config";

export type SettingsListProps = {
  config: Config;
  onChange: (c: Config) => void;
  tint: string;
};

export declare function SettingsList(
  props: SettingsListProps,
): React.JSX.Element;
