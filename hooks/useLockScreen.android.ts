import { useEffect, useRef } from "react";
import { PermissionsAndroid } from "react-native";
import { hide, show } from "@/modules/session-notification";
import { fmtClock, type Config } from "@/components/timer/config";
import { lockScreenContent } from "@/components/timer/lockScreen";
import type { TimerState } from "@/components/timer/machine";

const COLORS = { red: "#B3261E", green: "#146C2E" };

export function useLockScreen(state: TimerState, config: Config) {
  const shownRef = useRef(false);
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
        if (shownRef.current) {
          hide();
          shownRef.current = false;
        }
        return;
      }
      const first = !shownRef.current;
      shownRef.current = true;
      const run = async () => {
        if (first) await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        if (!shownRef.current) return;
        show({
          title,
          text: endsAt ? phaseLabel : `${phaseLabel} · En pause ${fmtClock(Math.ceil(remaining / 1000))}`,
          endsAt: endsAt ?? null,
          color: COLORS[tint],
        });
      };
      run().catch(() => {});
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, phaseLabel, tint, endsAt]);

  useEffect(
    () => () => {
      try {
        if (shownRef.current) hide();
      } catch {}
      shownRef.current = false;
    },
    [],
  );
}
