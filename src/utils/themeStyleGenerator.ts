import { ThemeStyles } from '@/types/theme';
import { ButtonStyleProps } from '@/types/button';

export const generateThemeCode = (styles: ButtonStyleProps | ThemeStyles): string => {
  if (!('light' in styles) || !('dark' in styles)) {
    throw new Error('Invalid theme styles: missing light or dark mode');
  }

  const themeStyles = styles as ThemeStyles;
  return `:root {
  --background: ${themeStyles.light.background};
  --foreground: ${themeStyles.light.foreground};
  --card: ${themeStyles.light.card};
  --card-foreground: ${themeStyles.light['card-foreground']};
  --popover: ${themeStyles.light.popover};
  --popover-foreground: ${themeStyles.light['popover-foreground']};
  --primary: ${themeStyles.light.primary};
  --primary-foreground: ${themeStyles.light['primary-foreground']};
  --secondary: ${themeStyles.light.secondary};
  --secondary-foreground: ${themeStyles.light['secondary-foreground']};
  --muted: ${themeStyles.light.muted};
  --muted-foreground: ${themeStyles.light['muted-foreground']};
  --accent: ${themeStyles.light.accent};
  --accent-foreground: ${themeStyles.light['accent-foreground']};
  --destructive: ${themeStyles.light.destructive};
  --destructive-foreground: ${themeStyles.light['destructive-foreground']};
  --border: ${themeStyles.light.border};
  --input: ${themeStyles.light.input};
  --ring: ${themeStyles.light.ring};
  --chart-1: ${themeStyles.light['chart-1']};
  --chart-2: ${themeStyles.light['chart-2']};
  --chart-3: ${themeStyles.light['chart-3']};
  --chart-4: ${themeStyles.light['chart-4']};
  --chart-5: ${themeStyles.light['chart-5']};
  --radius: ${themeStyles.light.radius};
  --sidebar: ${themeStyles.light.sidebar};
  --sidebar-foreground: ${themeStyles.light['sidebar-foreground']};
  --sidebar-primary: ${themeStyles.light['sidebar-primary']};
  --sidebar-primary-foreground: ${themeStyles.light['sidebar-primary-foreground']};
  --sidebar-accent: ${themeStyles.light['sidebar-accent']};
  --sidebar-accent-foreground: ${themeStyles.light['sidebar-accent-foreground']};
  --sidebar-border: ${themeStyles.light['sidebar-border']};
  --sidebar-ring: ${themeStyles.light['sidebar-ring']};
}

.dark {
  --background: ${themeStyles.dark.background};
  --foreground: ${themeStyles.dark.foreground};
  --card: ${themeStyles.dark.card};
  --card-foreground: ${themeStyles.dark['card-foreground']};
  --popover: ${themeStyles.dark.popover};
  --popover-foreground: ${themeStyles.dark['popover-foreground']};
  --primary: ${themeStyles.dark.primary};
  --primary-foreground: ${themeStyles.dark['primary-foreground']};
  --secondary: ${themeStyles.dark.secondary};
  --secondary-foreground: ${themeStyles.dark['secondary-foreground']};
  --muted: ${themeStyles.dark.muted};
  --muted-foreground: ${themeStyles.dark['muted-foreground']};
  --accent: ${themeStyles.dark.accent};
  --accent-foreground: ${themeStyles.dark['accent-foreground']};
  --destructive: ${themeStyles.dark.destructive};
  --destructive-foreground: ${themeStyles.dark['destructive-foreground']};
  --border: ${themeStyles.dark.border};
  --input: ${themeStyles.dark.input};
  --ring: ${themeStyles.dark.ring};
  --chart-1: ${themeStyles.dark['chart-1']};
  --chart-2: ${themeStyles.dark['chart-2']};
  --chart-3: ${themeStyles.dark['chart-3']};
  --chart-4: ${themeStyles.dark['chart-4']};
  --chart-5: ${themeStyles.dark['chart-5']};
  --sidebar: ${themeStyles.dark.sidebar};
  --sidebar-foreground: ${themeStyles.dark['sidebar-foreground']};
  --sidebar-primary: ${themeStyles.dark['sidebar-primary']};
  --sidebar-primary-foreground: ${themeStyles.dark['sidebar-primary-foreground']};
  --sidebar-accent: ${themeStyles.dark['sidebar-accent']};
  --sidebar-accent-foreground: ${themeStyles.dark['sidebar-accent-foreground']};
  --sidebar-border: ${themeStyles.dark['sidebar-border']};
  --sidebar-ring: ${themeStyles.dark['sidebar-ring']};
}`;
}; 