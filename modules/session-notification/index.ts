import { requireOptionalNativeModule } from "expo";

export type SessionNotificationContent = {
  title: string;
  text: string;
  endsAt: number | null;
  color: string;
};

type SessionNotificationModule = {
  show(title: string, text: string, endsAt: number | null, color: string): void;
  hide(): void;
};

const native = requireOptionalNativeModule<SessionNotificationModule>("SessionNotification");

export const show = (c: SessionNotificationContent): void =>
  native?.show(c.title, c.text, c.endsAt, c.color);

export const hide = (): void => native?.hide();
