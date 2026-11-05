import type { ReactNode } from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface ProgressRingProps {
  size: number;
  progress: number;
  color: string;
  trackColor: string;
  children: ReactNode;
}

const STROKE = 10;

export default function ProgressRing({
  size,
  progress,
  color,
  trackColor,
  children,
}: ProgressRingProps) {
  const r = (size - STROKE) / 2;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.min(1, Math.max(0, progress));

  return (
    <View
      className="items-center justify-center"
      style={{ width: size, height: size }}
    >
      <View className="absolute inset-0">
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={trackColor}
            strokeWidth={STROKE}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - clamped)}
            rotation={-90}
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
      </View>
      {children}
    </View>
  );
}
