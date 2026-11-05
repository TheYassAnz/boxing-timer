import { useState } from "react";
import {
  Form,
  Host,
  HStack,
  Picker,
  Section,
  Spacer,
  Stepper,
  Text,
} from "@expo/ui/swift-ui";
import {
  contentShape,
  foregroundStyle,
  labelsHidden,
  monospacedDigit,
  onTapGesture,
  pickerStyle,
  shapes,
  tag,
  tint as tintMod,
} from "@expo/ui/swift-ui/modifiers";
import {
  type Config,
  fmtClock,
  fromMinSec,
  UNLIMITED,
} from "@/components/timer/config";
import type { SettingsListProps } from "./SettingsList";

type DurationKey = "roundDuration" | "restDuration";

const MINUTES = Array.from({ length: 6 }, (_, i) => i);
const SECONDS = Array.from({ length: 60 }, (_, i) => i);

export function SettingsList({ config, onChange, tint }: SettingsListProps) {
  const [open, setOpen] = useState<DurationKey | null>(null);
  const set = (patch: Partial<Config>) => onChange({ ...config, ...patch });

  const durationRow = (key: DurationKey, label: string) => {
    const s = config[key];
    const wheel = (
      values: number[],
      value: number,
      onPick: (v: number) => void,
      unit: string,
    ) => (
      <HStack spacing={4}>
        <Picker<number>
          selection={value}
          onSelectionChange={onPick}
          modifiers={[pickerStyle("wheel"), labelsHidden()]}
        >
          {values.map((v) => (
            <Text key={v} modifiers={[tag(v)]}>
              {String(v)}
            </Text>
          ))}
        </Picker>
        <Text>{unit}</Text>
      </HStack>
    );
    return [
      <HStack
        key={key}
        modifiers={[
          contentShape(shapes.rectangle()),
          onTapGesture(() => setOpen(open === key ? null : key)),
        ]}
      >
        <Text>{label}</Text>
        <Spacer />
        <Text
          modifiers={[
            monospacedDigit(),
            foregroundStyle(open === key ? tint : "secondary"),
          ]}
        >
          {fmtClock(s)}
        </Text>
      </HStack>,
      open === key && (
        <HStack key={`${key}-wheels`}>
          {wheel(
            MINUTES,
            Math.floor(s / 60),
            (m) => set({ [key]: fromMinSec(m, s % 60) }),
            "min",
          )}
          {wheel(
            SECONDS,
            s % 60,
            (sec) => set({ [key]: fromMinSec(Math.floor(s / 60), sec) }),
            "s",
          )}
        </HStack>
      ),
    ];
  };

  return (
    <Host style={{ flex: 1 }}>
      <Form modifiers={[tintMod(tint)]}>
        <Section>
          <Stepper
            label={`Rounds : ${config.rounds === UNLIMITED ? "Illimité" : config.rounds}`}
            value={config.rounds}
            min={UNLIMITED}
            max={100}
            onValueChange={(v) => set({ rounds: v })}
          />
          {durationRow("roundDuration", "Durée du round")}
          {durationRow("restDuration", "Repos")}
        </Section>
      </Form>
    </Host>
  );
}
