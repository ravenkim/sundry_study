export type ButtonStyleProps = {
  // Base properties
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  fontSize: number;
  fontWeight: string;
  paddingX: number;
  paddingY: number;

  // Hover states
  hoverBackgroundColor: string;
  hoverTextColor: string;
  hoverBorderColor: string;
  hoverBackgroundOpacity: number;

  // Transitions
  transitionDuration: number;
  transitionEasing: string;

  // Shadow
  shadowColor: string;
  shadowOpacity: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowBlur: number;
  shadowSpread: number;

  // Text properties
  textTransform: "none" | "uppercase" | "lowercase" | "capitalize";
  letterSpacing: number;
  lineHeight: number;

  // Focus states
  focusBorderColor: string;
  focusRingColor: string;
  focusRingWidth: number;

  // Active states
  activeBackgroundColor: string;
  activeTextColor: string;
  activeBorderColor: string;
};

export type ButtonVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link";
export type ButtonSize = "default" | "sm" | "lg" | "icon";

export type ControlSectionProps = {
  title: string;
  children: React.ReactNode;
  expanded?: boolean;
  className?: string;
  id?: string;
};

export type ColorPickerProps = {
  color: string;
  onChange: (color: string) => void;
  label: string;
};

export type SliderInputProps = {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  label: string;
  unit?: string;
};

export type ToggleOptionProps<T> = {
  value: T;
  options: { label: string; value: T }[];
  onChange: (value: T) => void;
  label: string;
};

export type ControlPanelProps = {
  styles: ButtonStyleProps;
  onChange: (styles: ButtonStyleProps) => void;
  onReset: () => void;
  hasChanges?: boolean;
};

export type PreviewPanelProps = {
  styles: ButtonStyleProps;
  variant: ButtonVariant;
  size: ButtonSize;
};

export type CodePanelProps = {
  styles: ButtonStyleProps;
  variant: ButtonVariant;
  size: ButtonSize;
};

export type ButtonPreviewProps = {
  styles: ButtonStyleProps;
  variant: ButtonVariant;
  size: ButtonSize;
  label?: string;
  className?: string;
  disabled?: boolean;
  hover?: boolean;
};

export type ReadOnlyColorDisplayProps = {
  color: string;
  label: string;
  linkTo: string;
};

export type ColorFormat = "hex" | "rgb" | "hsl" | "oklch";
