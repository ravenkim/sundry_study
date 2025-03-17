export type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";
export type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonStyles {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  paddingX: number;
  paddingY: number;
  fontSize: number;
  fontWeight: string;
  textTransform: "none" | "uppercase" | "lowercase" | "capitalize";
  letterSpacing: number;
  lineHeight: number;
  shadowOpacity: number;
  shadowColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowBlur: number;
  shadowSpread: number;
  hoverBackgroundColor: string;
  hoverBackgroundOpacity: number;
  hoverTextColor: string;
  hoverBorderColor: string;
  focusBorderColor: string;
  focusRingColor: string;
  focusRingWidth: number;
  activeBackgroundColor: string;
  activeTextColor: string;
  activeBorderColor: string;
  transitionDuration: number;
  transitionEasing: string;
}
