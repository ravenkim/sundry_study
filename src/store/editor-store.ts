import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ThemeEditorState, EditorType } from "@/types/editor";
import { isEqual } from "@ngard/tiny-isequal";
import { defaultThemeState } from "@/config/theme";
import { getPresetThemeStyles } from "../utils/theme-presets";
import { ColorFormat } from "@/types";

interface EditorStore {
  themeState: ThemeEditorState;
  tailwindVersion: "3" | "4";
  colorFormat: ColorFormat;
  setThemeState: (state: ThemeEditorState) => void;
  setTailwindVersion: (version: "3" | "4") => void;
  setColorFormat: (format: ColorFormat) => void;
  applyThemePreset: (preset: string) => void;
  resetToDefault: () => void;
  resetToCurrentPreset: () => void;
  hasDefaultThemeChanged: () => boolean;
  hasCurrentPresetChanged: () => boolean;
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      themeState: defaultThemeState,
      tailwindVersion: "4",
      colorFormat: "oklch",
      setThemeState: (state: ThemeEditorState) => {
        set({ themeState: state });
      },
      setTailwindVersion: (version: "3" | "4") => {
        set({ tailwindVersion: version });
      },
      setColorFormat: (format: ColorFormat) => {
        set({ colorFormat: format });
      },
      applyThemePreset: (preset: string) => {
        const themeState = get().themeState;
        set({
          themeState: {
            ...themeState,
            preset,
            styles: getPresetThemeStyles(preset),
          },
        });
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
            styles: getPresetThemeStyles(themeState.preset),
          },
        });
      },
      hasDefaultThemeChanged: () => {
        const state = get();
        return !isEqual(state.themeState.styles, defaultThemeState.styles);
      },
      hasCurrentPresetChanged: () => {
        const state = get();
        const presetStyles = getPresetThemeStyles(state.themeState.preset);
        return !isEqual(state.themeState.styles, presetStyles);
      },
    }),
    {
      name: "editor-storage", // unique name for localStorage
    }
  )
);
