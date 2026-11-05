export type RoundButtonProps = {
  label: string;
  onPress: () => void;
  tone: "accent" | "neutral";
  size: number;
  color: string;
  disabled?: boolean;
};

export declare function RoundButton(props: RoundButtonProps): React.JSX.Element;
