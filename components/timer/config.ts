export interface Config {
  rounds: number;
  roundDuration: number;
  restDuration: number;
}

export const UNLIMITED = 0;

export const DEFAULTS: Config = {
  rounds: 3,
  roundDuration: 180,
  restDuration: 60,
};

export const LIMITS: Record<keyof Config, [number, number]> = {
  rounds: [UNLIMITED, 100],
  roundDuration: [1, 300],
  restDuration: [1, 300],
};

export function parseConfig(raw: string): Config {
  let data: Partial<Record<keyof Config, unknown>> = {};
  try {
    data = JSON.parse(raw) ?? {};
  } catch {}
  const out = { ...DEFAULTS };
  for (const key of Object.keys(LIMITS) as (keyof Config)[]) {
    const v = data[key];
    if (typeof v === "number" && Number.isFinite(v)) {
      const [min, max] = LIMITS[key];
      out[key] = Math.min(max, Math.max(min, Math.round(v)));
    }
  }
  return out;
}

export function pad(n: number) {
  return String(n).padStart(2, "0");
}

export const PRESETS: { label: string; config: Config }[] = [
  { label: "Échauffement", config: { rounds: UNLIMITED, roundDuration: 30, restDuration: 30 } },
  { label: "Assauts", config: { rounds: UNLIMITED, roundDuration: 90, restDuration: 35 } },
  { label: "Sparring", config: { rounds: 12, roundDuration: 180, restDuration: 60 } },
];

export const sameConfig = (a: Config, b: Config) =>
  a.rounds === b.rounds &&
  a.roundDuration === b.roundDuration &&
  a.restDuration === b.restDuration;

export const presetIndex = (c: Config) =>
  PRESETS.findIndex((p) => sameConfig(p.config, c));

const clamp = (n: number, [min, max]: [number, number]) =>
  Math.min(max, Math.max(min, n));

export const stepRounds = (n: number, delta: 1 | -1) =>
  clamp(n + delta, LIMITS.rounds);

export const stepDuration = (s: number, delta: 1 | -1) =>
  clamp(
    delta > 0 ? (Math.floor(s / 5) + 1) * 5 : (Math.ceil(s / 5) - 1) * 5,
    LIMITS.roundDuration,
  );

export const fromMinSec = (m: number, s: number) =>
  clamp(m * 60 + s, LIMITS.roundDuration);

export const fmtClock = (s: number) => `${Math.floor(s / 60)}:${pad(s % 60)}`;

export const roundLabel = (round: number, rounds: number) =>
  rounds === UNLIMITED ? `Round ${round}` : `Round ${round} / ${rounds}`;
