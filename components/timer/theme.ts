import { Platform, useColorScheme } from "react-native";
import type { Phase } from "./machine";

type Scheme = {
  bg: string;
  groupedBg: string;
  text: string;
  secondary: string;
  red: string;
  green: string;
  track: string;
  neutral: string;
};

const PALETTES: Record<"ios" | "android", Record<"light" | "dark", Scheme>> = {
  ios: {
    light: {
      bg: "#FFFFFF",
      groupedBg: "#F2F2F7",
      text: "#000000",
      secondary: "#8E8E93",
      red: "#FF3B30",
      green: "#34C759",
      track: "#E5E5EA",
      neutral: "#8E8E93",
    },
    dark: {
      bg: "#000000",
      groupedBg: "#000000",
      text: "#FFFFFF",
      secondary: "#8E8E93",
      red: "#FF453A",
      green: "#30D158",
      track: "#2C2C2E",
      neutral: "#8E8E93",
    },
  },
  android: {
    light: {
      bg: "#FEF7FF",
      groupedBg: "#FEF7FF",
      text: "#1D1B20",
      secondary: "#49454F",
      red: "#B3261E",
      green: "#146C2E",
      track: "#E6E0E9",
      neutral: "#E6E0E9",
    },
    dark: {
      bg: "#141218",
      groupedBg: "#141218",
      text: "#E6E0E9",
      secondary: "#CAC4D0",
      red: "#FF5449",
      green: "#7DDB8A",
      track: "#36343B",
      neutral: "#36343B",
    },
  },
};

export function usePalette(phase: Phase) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const { red, green, ...rest } =
    PALETTES[Platform.OS === "ios" ? "ios" : "android"][scheme];
  return { ...rest, accent: phase === "rest" ? green : red };
}
