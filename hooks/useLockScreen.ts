import { useEffect, useRef } from "react";
import { end, start, update } from "@/modules/live-activity";
import { fmtClock, type Config } from "@/components/timer/config";
import { lockScreenContent } from "@/components/timer/lockScreen";
import type { TimerState } from "@/components/timer/machine";

export function useLockScreen(state: TimerState, config: Config) {
  const activeRef = useRef(false);
  const queueRef = useRef<Promise<void>>(Promise.resolve());
  const content = lockScreenContent(state, config);
  const remaining = content?.remaining ?? 0;
  const title = content?.title;
  const phaseLabel = content?.phaseLabel;
  const tint = content?.tint;
  const endsAt = content?.endsAt;

  // Native calls are async: chain them so a slow start never lands after a later update or end.
  const run = (op: () => Promise<void>) => {
    queueRef.current = queueRef.current.then(op).catch(() => {});
  };

  // `remaining` is deliberately omitted: it changes every tick, and only matters when endsAt is null (pause).
  useEffect(() => {
    try {
      if (title === undefined || phaseLabel === undefined || tint === undefined) {
        if (activeRef.current) {
          activeRef.current = false;
          run(end);
        }
        return;
      }
      const next = {
        title,
        phaseLabel,
        isRest: tint === "green",
        endsAt: endsAt ?? null,
        pausedText: endsAt ? null : fmtClock(Math.ceil(remaining / 1000)),
      };
      const op = activeRef.current ? update : start;
      activeRef.current = true;
      run(() => op(next));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, phaseLabel, tint, endsAt]);

  useEffect(
    () => () => {
      try {
        if (activeRef.current) run(end);
      } catch {}
      activeRef.current = false;
    },
    [],
  );
}
