import { useEffect, useRef } from "react";
import { PermissionsAndroid } from "react-native";
import { hide, show, type SessionNotificationContent } from "@/modules/session-notification";
import { fmtClock, type Config } from "@/components/timer/config";
import { lockScreenContent } from "@/components/timer/lockScreen";
import type { TimerState } from "@/components/timer/machine";

const COLORS = { red: "#B3261E", green: "#146C2E" };

export function useLockScreen(state: TimerState, config: Config) {
  const shownRef = useRef(false);
  const permRef = useRef<Promise<unknown> | null>(null);
  const latestRef = useRef<SessionNotificationContent | null>(null);
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
          latestRef.current = null;
        }
        return;
      }
      shownRef.current = true;
      latestRef.current = {
        title,
        text: endsAt ? phaseLabel : `${phaseLabel} · En pause ${fmtClock(Math.ceil(remaining / 1000))}`,
        endsAt: endsAt ?? null,
        color: COLORS[tint],
      };
      permRef.current ??= PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      // Read the ref after the permission prompt so a stale closure never overwrites a newer phase.
      permRef.current
        .then(() => {
          if (shownRef.current && latestRef.current) show(latestRef.current);
        })
        .catch(() => {});
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, phaseLabel, tint, endsAt]);

  useEffect(
    () => () => {
      try {
        if (shownRef.current) hide();
      } catch {}
      shownRef.current = false;
      latestRef.current = null;
    },
    [],
  );
}
