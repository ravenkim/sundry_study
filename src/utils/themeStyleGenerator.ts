import { ThemeStyles } from "@/types/theme";
import { ButtonStyleProps } from "@/types/button";
import { convertToHSL } from "./colorConverter";

export const generateThemeCode = (
  styles: ButtonStyleProps | ThemeStyles,
): string => {
  if (!("light" in styles) || !("dark" in styles)) {
    throw new Error("Invalid theme styles: missing light or dark mode");
  }
  const themeStyles = styles as ThemeStyles;
  return `:root {
  --background: ${convertToHSL(themeStyles.light.background)};
  --foreground: ${convertToHSL(themeStyles.light.foreground)};
  --card: ${convertToHSL(themeStyles.light.card)};
  --card-foreground: ${convertToHSL(themeStyles.light["card-foreground"])};
  --popover: ${convertToHSL(themeStyles.light.popover)};
  --popover-foreground: ${convertToHSL(themeStyles.light["popover-foreground"])};
  --primary: ${convertToHSL(themeStyles.light.primary)};
  --primary-foreground: ${convertToHSL(themeStyles.light["primary-foreground"])};
  --secondary: ${convertToHSL(themeStyles.light.secondary)};
  --secondary-foreground: ${convertToHSL(themeStyles.light["secondary-foreground"])};
  --muted: ${convertToHSL(themeStyles.light.muted)};
  --muted-foreground: ${convertToHSL(themeStyles.light["muted-foreground"])};
  --accent: ${convertToHSL(themeStyles.light.accent)};
  --accent-foreground: ${convertToHSL(themeStyles.light["accent-foreground"])};
  --destructive: ${convertToHSL(themeStyles.light.destructive)};
  --destructive-foreground: ${convertToHSL(themeStyles.light["destructive-foreground"])};
  --border: ${convertToHSL(themeStyles.light.border)};
  --input: ${convertToHSL(themeStyles.light.input)};
  --ring: ${convertToHSL(themeStyles.light.ring)};
  --chart-1: ${convertToHSL(themeStyles.light["chart-1"])};
  --chart-2: ${convertToHSL(themeStyles.light["chart-2"])};
  --chart-3: ${convertToHSL(themeStyles.light["chart-3"])};
  --chart-4: ${convertToHSL(themeStyles.light["chart-4"])};
  --chart-5: ${convertToHSL(themeStyles.light["chart-5"])};
  --radius: ${themeStyles.light.radius};
  --sidebar: ${convertToHSL(themeStyles.light.sidebar)};
  --sidebar-foreground: ${convertToHSL(themeStyles.light["sidebar-foreground"])};
  --sidebar-primary: ${convertToHSL(themeStyles.light["sidebar-primary"])};
  --sidebar-primary-foreground: ${convertToHSL(themeStyles.light["sidebar-primary-foreground"])};
  --sidebar-accent: ${convertToHSL(themeStyles.light["sidebar-accent"])};
  --sidebar-accent-foreground: ${convertToHSL(themeStyles.light["sidebar-accent-foreground"])};
  --sidebar-border: ${convertToHSL(themeStyles.light["sidebar-border"])};
  --sidebar-ring: ${convertToHSL(themeStyles.light["sidebar-ring"])};
}
.dark {
  --background: ${convertToHSL(themeStyles.dark.background)};
  --foreground: ${convertToHSL(themeStyles.dark.foreground)};
  --card: ${convertToHSL(themeStyles.dark.card)};
  --card-foreground: ${convertToHSL(themeStyles.dark["card-foreground"])};
  --popover: ${convertToHSL(themeStyles.dark.popover)};
  --popover-foreground: ${convertToHSL(themeStyles.dark["popover-foreground"])};
  --primary: ${convertToHSL(themeStyles.dark.primary)};
  --primary-foreground: ${convertToHSL(themeStyles.dark["primary-foreground"])};
  --secondary: ${convertToHSL(themeStyles.dark.secondary)};
  --secondary-foreground: ${convertToHSL(themeStyles.dark["secondary-foreground"])};
  --muted: ${convertToHSL(themeStyles.dark.muted)};
  --muted-foreground: ${convertToHSL(themeStyles.dark["muted-foreground"])};
  --accent: ${convertToHSL(themeStyles.dark.accent)};
  --accent-foreground: ${convertToHSL(themeStyles.dark["accent-foreground"])};
  --destructive: ${convertToHSL(themeStyles.dark.destructive)};
  --destructive-foreground: ${convertToHSL(themeStyles.dark["destructive-foreground"])};
  --border: ${convertToHSL(themeStyles.dark.border)};
  --input: ${convertToHSL(themeStyles.dark.input)};
  --ring: ${convertToHSL(themeStyles.dark.ring)};
  --chart-1: ${convertToHSL(themeStyles.dark["chart-1"])};
  --chart-2: ${convertToHSL(themeStyles.dark["chart-2"])};
  --chart-3: ${convertToHSL(themeStyles.dark["chart-3"])};
  --chart-4: ${convertToHSL(themeStyles.dark["chart-4"])};
  --chart-5: ${convertToHSL(themeStyles.dark["chart-5"])};
  --sidebar: ${convertToHSL(themeStyles.dark.sidebar)};
  --sidebar-foreground: ${convertToHSL(themeStyles.dark["sidebar-foreground"])};
  --sidebar-primary: ${convertToHSL(themeStyles.dark["sidebar-primary"])};
  --sidebar-primary-foreground: ${convertToHSL(themeStyles.dark["sidebar-primary-foreground"])};
  --sidebar-accent: ${convertToHSL(themeStyles.dark["sidebar-accent"])};
  --sidebar-accent-foreground: ${convertToHSL(themeStyles.dark["sidebar-accent-foreground"])};
  --sidebar-border: ${convertToHSL(themeStyles.dark["sidebar-border"])};
  --sidebar-ring: ${convertToHSL(themeStyles.dark["sidebar-ring"])};
}`;
};

