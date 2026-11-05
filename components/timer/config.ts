export interface Config {
  rounds: number;
  roundDuration: number;
  restDuration: number;
}

export const DEFAULTS: Config = {
  rounds: 3,
  roundDuration: 180,
  restDuration: 60,
};

export const LIMITS: Record<keyof Config, [number, number]> = {
  rounds: [1, 100],
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

export function fmtDuration(s: number): string {
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return rem === 0 ? `${m} min` : `${m}:${pad(rem)}`;
}
