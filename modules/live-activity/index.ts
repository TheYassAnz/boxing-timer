import { requireOptionalNativeModule } from "expo";

export type LiveActivityState = {
  title: string;
  phaseLabel: string;
  isRest: boolean;
  endsAt: number | null;
  pausedText: string | null;
};

type LiveActivityModule = {
  start(state: LiveActivityState): Promise<void>;
  update(state: LiveActivityState): Promise<void>;
  end(): Promise<void>;
};

const native = requireOptionalNativeModule<LiveActivityModule>("LiveActivity");

export const start = (state: LiveActivityState): Promise<void> =>
  native ? native.start(state) : Promise.resolve();

export const update = (state: LiveActivityState): Promise<void> =>
  native ? native.update(state) : Promise.resolve();

export const end = (): Promise<void> => (native ? native.end() : Promise.resolve());
