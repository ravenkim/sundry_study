import { createContext, useContext, useEffect, useLayoutEffect } from "react"
import { useEditorStore } from "../store/editorStore"
import { convertToHSL } from "../utils/colorConverter";

type Theme = "dark" | "light";

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  toggleTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  const { themeState, setThemeState } = useEditorStore();

  useLayoutEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("preview-theme", "preview-theme-dark")

    const theme = themeState.currentMode === "light" ? "preview-theme" : "preview-theme-dark"
    root.classList.add(theme);

    const mode = themeState.currentMode;
    const themeStyles = themeState.styles;
    Object.entries(themeStyles[mode]).forEach(([key, value]) => {
      if (typeof value === 'string' && (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl'))) {
        // Convert the color to HSL format
        const hslValue = convertToHSL(value);
        root?.setAttribute(`style`, `${root.getAttribute('style') || ''}--${key}: ${hslValue};`);
      }
    });
  }, [themeState])

  const value = {
    theme: themeState.currentMode,
    setTheme: (theme: Theme) => {
      setThemeState({ ...themeState, currentMode: theme })
    },
    toggleTheme: () => {
      setThemeState({ ...themeState, currentMode: themeState.currentMode === "light" ? "dark" : "light" })
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
