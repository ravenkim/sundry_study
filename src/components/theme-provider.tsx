import { createContext, useContext, useLayoutEffect } from "react";
import { useEditorStore } from "../store/editorStore";
import { colorFormatter } from "../utils/colorConverter";

type Theme = "dark" | "light";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  toggleTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

function applyStyleToElement(element: HTMLElement, key: string, value: string) {
  element.setAttribute(`style`, `${element.getAttribute("style") || ""}--${key}: ${value};`);
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { themeState, setThemeState } = useEditorStore();

  useLayoutEffect(() => {
    const root = window.document.documentElement;
    const mode = themeState.currentMode;
    const themeStyles = themeState.styles;

    const commonNonColorKeys = ["font-sans", "font-serif", "font-mono", "radius"];
    Object.entries(themeStyles.light)
      .filter(([key]) => commonNonColorKeys.includes(key))
      .forEach(([key, value]) => {
        applyStyleToElement(root, key, value);
      });

    Object.entries(themeStyles[mode]).forEach(([key, value]) => {
      if (typeof value === "string" && !commonNonColorKeys.includes(key)) {
        const hslValue = colorFormatter(value, "hsl", "4");
        applyStyleToElement(root, key, hslValue);
      }
    });
  }, [themeState]);

  const value = {
    theme: themeState.currentMode,
    setTheme: (theme: Theme) => {
      setThemeState({ ...themeState, currentMode: theme });
    },
    toggleTheme: () => {
      setThemeState({
        ...themeState,
        currentMode: themeState.currentMode === "light" ? "dark" : "light",
      });
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
