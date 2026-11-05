import {
  startActivity,
  stopActivity,
  updateActivity,
  type LiveActivityState,
} from "expo-live-activity";
import { useEffect, useRef } from "react";
import { fmtClock, type Config } from "@/components/timer/config";
import { lockScreenContent } from "@/components/timer/lockScreen";
import type { TimerState } from "@/components/timer/machine";

const COLORS = { red: "#FF3B30", green: "#34C759" };

export function useLockScreen(state: TimerState, config: Config) {
  const idRef = useRef<string | null>(null);
  const content = lockScreenContent(state, config);
  const remaining = content?.remaining ?? 0;
  const title = content?.title;
  const phaseLabel = content?.phaseLabel;
  const tint = content?.tint;
  const endsAt = content?.endsAt;

  // `remaining` is deliberately omitted: it changes every tick, and only matters when endsAt is null (pause).
  useEffect(() => {
    try {
      if (title === undefined || phaseLabel === undefined || tint === undefined) {
        if (idRef.current) {
          stopActivity(idRef.current, { title: "" });
          idRef.current = null;
        }
        return;
      }
      const next: LiveActivityState = endsAt
        ? { title, subtitle: phaseLabel, progressBar: { date: endsAt } }
        : {
            title,
            subtitle: `${phaseLabel} · En pause ${fmtClock(Math.ceil(remaining / 1000))}`,
          };
      if (idRef.current) {
        updateActivity(idRef.current, next);
      } else {
        // Colors are start-only in the library: a start in Repos stays green, a start in Round red.
        idRef.current =
          startActivity(next, {
            backgroundColor: "#000000",
            titleColor: "#FFFFFF",
            subtitleColor: COLORS[tint],
            progressViewTint: COLORS[tint],
            progressViewLabelColor: "#FFFFFF",
          }) ?? null;
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, phaseLabel, tint, endsAt]);

  useEffect(
    () => () => {
      try {
        if (idRef.current) stopActivity(idRef.current, { title: "" });
      } catch {}
      idRef.current = null;
    },
    [],
  );
}
