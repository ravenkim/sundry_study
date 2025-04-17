import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ThemeEditorState } from "@/types/editor";
import { ThemeStyleProps } from "@/types/theme";
// @ts-expect-error: owned by ngard
import { isEqual } from "@ngard/tiny-isequal";
import { defaultThemeState, COMMON_STYLES } from "@/config/theme";
import { getPresetThemeStyles } from "@/utils/theme-presets";

interface EditorStore {
  themeState: ThemeEditorState;
  setThemeState: (state: ThemeEditorState) => void;
  applyThemePreset: (preset: string) => void;
  resetToDefault: () => void;
  resetToCurrentPreset: () => void;
  hasDefaultThemeChanged: () => boolean;
  hasCurrentPresetChanged: () => boolean;
  hasChangedThemeFromDefault: boolean;
  updateStyle: <K extends keyof ThemeStyleProps>(
    key: K,
    value: ThemeStyleProps[K]
  ) => void;
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      themeState: defaultThemeState,
      hasChangedThemeFromDefault: false,
      setThemeState: (state: ThemeEditorState) => {
        set({ themeState: state });
      },
      applyThemePreset: (preset: string) => {
        const themeState = get().themeState;
        const updates: Partial<EditorStore> = {
          themeState: {
            ...themeState,
            preset,
            styles: getPresetThemeStyles(preset),
          },
        };
        if (preset !== "default") {
          updates.hasChangedThemeFromDefault = true;
        }
        set(updates);
      },
      resetToDefault: () => {
        const mode = get().themeState.currentMode;
        set({ themeState: { ...defaultThemeState, currentMode: mode } });
      },
      resetToCurrentPreset: () => {
        const themeState = get().themeState;
        set({
          themeState: {
            ...themeState,
            styles: getPresetThemeStyles(themeState.preset || "default"),
          },
        });
      },
      hasDefaultThemeChanged: () => {
        const state = get();
        return !isEqual(state.themeState.styles, defaultThemeState.styles);
      },
      hasCurrentPresetChanged: () => {
        const state = get();
        const presetStyles = getPresetThemeStyles(
          state.themeState.preset || "default"
        );
        return !isEqual(state.themeState.styles, presetStyles);
      },
      updateStyle: (key, value) =>
        set((state) => {
          const currentMode = state.themeState.currentMode;
          const currentStyles = state.themeState.styles;

          let newStyles = { ...currentStyles };

          if (COMMON_STYLES.includes(key as string)) {
            newStyles = {
              ...newStyles,
              light: { ...newStyles.light, [key]: value },
              dark: { ...newStyles.dark, [key]: value },
            };
          } else {
            newStyles = {
              ...newStyles,
              [currentMode]: {
                ...(newStyles[currentMode] || {}),
                [key]: value,
              },
            };
          }

          return {
            themeState: {
              ...state.themeState,
              styles: newStyles,
            },
          };
        }),
    }),
    {
      name: "editor-storage", // unique name for localStorage
    }
  )
);
