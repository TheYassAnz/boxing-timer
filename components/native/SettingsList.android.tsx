import {
  FilledTonalIconButton,
  Host,
  ListItem,
  Row,
  Text,
  Column,
} from "@expo/ui/jetpack-compose";
import {
  type Config,
  fmtClock,
  stepDuration,
  stepRounds,
  UNLIMITED,
  LIMITS,
} from "@/components/timer/config";
import type { SettingsListProps } from "./SettingsList";

export function SettingsList({ config, onChange, tint }: SettingsListProps) {
  const row = (
    key: keyof Config,
    label: string,
    display: string,
    step: (v: number, d: 1 | -1) => number,
  ) => {
    const v = config[key];
    const [min, max] = LIMITS[key];
    const btn = (d: 1 | -1) => (
      <FilledTonalIconButton
        enabled={d < 0 ? v > min : v < max}
        colors={{ contentColor: tint }}
        onClick={() => onChange({ ...config, [key]: step(v, d) })}
      >
        <Text style={{ fontSize: 20, fontWeight: "600" }}>
          {d < 0 ? "−" : "+"}
        </Text>
      </FilledTonalIconButton>
    );
    return (
      <ListItem key={key}>
        <ListItem.HeadlineContent>
          <Text>{label}</Text>
        </ListItem.HeadlineContent>
        <ListItem.TrailingContent>
          <Row
            verticalAlignment="center"
            horizontalArrangement={{ spacedBy: 12 }}
          >
            {btn(-1)}
            <Text style={{ typography: "titleMedium", textAlign: "center" }}>
              {display}
            </Text>
            {btn(1)}
          </Row>
        </ListItem.TrailingContent>
      </ListItem>
    );
  };

  return (
    <Host matchContents={{ vertical: true }}>
      <Column>
        {row(
          "rounds",
          "Rounds",
          config.rounds === UNLIMITED ? "Illimité" : String(config.rounds),
          stepRounds,
        )}
        {row(
          "roundDuration",
          "Durée du round",
          fmtClock(config.roundDuration),
          stepDuration,
        )}
        {row(
          "restDuration",
          "Repos",
          fmtClock(config.restDuration),
          stepDuration,
        )}
      </Column>
    </Host>
  );
}
