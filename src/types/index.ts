import { ButtonStyles } from "./button";

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
  styles: ButtonStyles;
  onChange: (styles: ButtonStyles) => void;
  onReset: () => void;
  hasChanges?: boolean;
};

export type PreviewPanelProps = {
  styles: ButtonStyles;
  variant: ButtonVariant;
  size: ButtonSize;
};

export type CodePanelProps = {
  styles: ButtonStyles;
  variant: ButtonVariant;
  size: ButtonSize;
};

export type ButtonPreviewProps = {
  styles: ButtonStyles;
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
