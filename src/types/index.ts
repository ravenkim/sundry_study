
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
  
  // Focus states
  focusBorderColor: string;
  focusRingColor: string;
  focusRingWidth: number;
  
  // Active states
  activeBackgroundColor: string;
  activeTextColor: string;
  activeBorderColor: string;
  
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
  textTransform: string;
  letterSpacing: number;
  lineHeight: number;
};

export type ButtonVariant = 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export type ControlSectionProps = {
  title: string;
  children: React.ReactNode;
  expanded?: boolean;
  className?: string;
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
  variant: ButtonVariant;
  onVariantChange: (variant: ButtonVariant) => void;
  size: ButtonSize;
  onSizeChange: (size: ButtonSize) => void;
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
};
