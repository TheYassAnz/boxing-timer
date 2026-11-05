import { requireNativeModule } from "expo";

export type LiveActivityState = {
  title: string;
  phaseLabel: string;
  isRest: boolean;
  endsAt: number | null;
  pausedText: string | null;
};

const native = requireNativeModule("LiveActivity");

export const start = (state: LiveActivityState): Promise<void> => native.start(state);

export const update = (state: LiveActivityState): Promise<void> => native.update(state);

export const end = (): Promise<void> => native.end();
