import { ThemeStyles } from "@/types/theme";
import { ButtonStyles } from "@/types/button";
import { colorFormatter } from "./colorConverter";
import { ColorFormat } from "../types";

export const generateThemeCode = (
  styles: ButtonStyles | ThemeStyles,
  colorFormat: ColorFormat = "hsl",
): string => {
  if (!("light" in styles) || !("dark" in styles)) {
    throw new Error("Invalid theme styles: missing light or dark mode");
  }

  const formatColor = (color: string) => colorFormatter(color, colorFormat);

  const themeStyles = styles as ThemeStyles;
  return `:root {
  --background: ${formatColor(themeStyles.light.background)};
  --foreground: ${formatColor(themeStyles.light.foreground)};
  --card: ${formatColor(themeStyles.light.card)};
  --card-foreground: ${formatColor(themeStyles.light["card-foreground"])};
  --popover: ${formatColor(themeStyles.light.popover)};
  --popover-foreground: ${formatColor(themeStyles.light["popover-foreground"])};
  --primary: ${formatColor(themeStyles.light.primary)};
  --primary-foreground: ${formatColor(themeStyles.light["primary-foreground"])};
  --secondary: ${formatColor(themeStyles.light.secondary)};
  --secondary-foreground: ${formatColor(themeStyles.light["secondary-foreground"])};
  --muted: ${formatColor(themeStyles.light.muted)};
  --muted-foreground: ${formatColor(themeStyles.light["muted-foreground"])};
  --accent: ${formatColor(themeStyles.light.accent)};
  --accent-foreground: ${formatColor(themeStyles.light["accent-foreground"])};
  --destructive: ${formatColor(themeStyles.light.destructive)};
  --destructive-foreground: ${formatColor(themeStyles.light["destructive-foreground"])};
  --border: ${formatColor(themeStyles.light.border)};
  --input: ${formatColor(themeStyles.light.input)};
  --ring: ${formatColor(themeStyles.light.ring)};
  --chart-1: ${formatColor(themeStyles.light["chart-1"])};
  --chart-2: ${formatColor(themeStyles.light["chart-2"])};
  --chart-3: ${formatColor(themeStyles.light["chart-3"])};
  --chart-4: ${formatColor(themeStyles.light["chart-4"])};
  --chart-5: ${formatColor(themeStyles.light["chart-5"])};
  --sidebar: ${formatColor(themeStyles.light.sidebar)};
  --sidebar-foreground: ${formatColor(themeStyles.light["sidebar-foreground"])};
  --sidebar-primary: ${formatColor(themeStyles.light["sidebar-primary"])};
  --sidebar-primary-foreground: ${formatColor(themeStyles.light["sidebar-primary-foreground"])};
  --sidebar-accent: ${formatColor(themeStyles.light["sidebar-accent"])};
  --sidebar-accent-foreground: ${formatColor(themeStyles.light["sidebar-accent-foreground"])};
  --sidebar-border: ${formatColor(themeStyles.light["sidebar-border"])};
  --sidebar-ring: ${formatColor(themeStyles.light["sidebar-ring"])};

  --font-sans: ${themeStyles.light["font-sans"]};
  --font-serif: ${themeStyles.light["font-serif"]};
  --font-mono: ${themeStyles.light["font-mono"]};

  --radius: ${themeStyles.light.radius};
}

.dark {
  --background: ${formatColor(themeStyles.dark.background)};
  --foreground: ${formatColor(themeStyles.dark.foreground)};
  --card: ${formatColor(themeStyles.dark.card)};
  --card-foreground: ${formatColor(themeStyles.dark["card-foreground"])};
  --popover: ${formatColor(themeStyles.dark.popover)};
  --popover-foreground: ${formatColor(themeStyles.dark["popover-foreground"])};
  --primary: ${formatColor(themeStyles.dark.primary)};
  --primary-foreground: ${formatColor(themeStyles.dark["primary-foreground"])};
  --secondary: ${formatColor(themeStyles.dark.secondary)};
  --secondary-foreground: ${formatColor(themeStyles.dark["secondary-foreground"])};
  --muted: ${formatColor(themeStyles.dark.muted)};
  --muted-foreground: ${formatColor(themeStyles.dark["muted-foreground"])};
  --accent: ${formatColor(themeStyles.dark.accent)};
  --accent-foreground: ${formatColor(themeStyles.dark["accent-foreground"])};
  --destructive: ${formatColor(themeStyles.dark.destructive)};
  --destructive-foreground: ${formatColor(themeStyles.dark["destructive-foreground"])};
  --border: ${formatColor(themeStyles.dark.border)};
  --input: ${formatColor(themeStyles.dark.input)};
  --ring: ${formatColor(themeStyles.dark.ring)};
  --chart-1: ${formatColor(themeStyles.dark["chart-1"])};
  --chart-2: ${formatColor(themeStyles.dark["chart-2"])};
  --chart-3: ${formatColor(themeStyles.dark["chart-3"])};
  --chart-4: ${formatColor(themeStyles.dark["chart-4"])};
  --chart-5: ${formatColor(themeStyles.dark["chart-5"])};
  --sidebar: ${formatColor(themeStyles.dark.sidebar)};
  --sidebar-foreground: ${formatColor(themeStyles.dark["sidebar-foreground"])};
  --sidebar-primary: ${formatColor(themeStyles.dark["sidebar-primary"])};
  --sidebar-primary-foreground: ${formatColor(themeStyles.dark["sidebar-primary-foreground"])};
  --sidebar-accent: ${formatColor(themeStyles.dark["sidebar-accent"])};
  --sidebar-accent-foreground: ${formatColor(themeStyles.dark["sidebar-accent-foreground"])};
  --sidebar-border: ${formatColor(themeStyles.dark["sidebar-border"])};
  --sidebar-ring: ${formatColor(themeStyles.dark["sidebar-ring"])};
}`;
};
