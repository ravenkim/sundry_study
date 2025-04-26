import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ThemeEditorState } from "@/types/editor";
import { defaultThemeState } from "@/config/theme";
import { getPresetThemeStyles } from "@/utils/theme-preset-helper";
import { isDeepEqual } from "@/lib/utils";

interface EditorStore {
  themeState: ThemeEditorState;
  themeCheckpoint: ThemeEditorState | null;
  setThemeState: (state: ThemeEditorState) => void;
  applyThemePreset: (preset: string) => void;
  saveThemeCheckpoint: () => void;
  restoreThemeCheckpoint: () => void;
  hasThemeChangedFromCheckpoint: () => boolean;
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      themeState: defaultThemeState,
      themeCheckpoint: null,
      setThemeState: (state: ThemeEditorState) => {
        set({ themeState: state });
      },
      applyThemePreset: (preset: string) => {
        const themeState = get().themeState;
        const newStyles = getPresetThemeStyles(preset);
        const newThemeState: ThemeEditorState = {
          ...themeState,
          preset,
          styles: newStyles,
        };
        const updates: Partial<EditorStore> & { themeState: ThemeEditorState } =
          {
            themeState: newThemeState,
            themeCheckpoint: newThemeState,
          };
        set(updates);
      },
      saveThemeCheckpoint: () => {
        set({ themeCheckpoint: get().themeState });
      },
      restoreThemeCheckpoint: () => {
        const checkpoint = get().themeCheckpoint;
        if (checkpoint) {
          set({ themeState: checkpoint });
        } else {
          console.warn("No theme checkpoint available to restore to.");
        }
      },
      hasThemeChangedFromCheckpoint: () => {
        const checkpoint = get().themeCheckpoint;
        return !isDeepEqual(get().themeState, checkpoint);
      },
    }),
    {
      name: "editor-storage",
    }
  )
);
