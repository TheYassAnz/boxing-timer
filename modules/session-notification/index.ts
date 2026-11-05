import { requireNativeModule } from "expo";

export type SessionNotificationContent = {
  title: string;
  text: string;
  endsAt: number | null;
  color: string;
};

const native = requireNativeModule("SessionNotification");

export const show = (c: SessionNotificationContent): void =>
  native.show(c.title, c.text, c.endsAt, c.color);

export const hide = (): void => native.hide();
