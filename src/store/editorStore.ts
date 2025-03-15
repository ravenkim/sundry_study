import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ButtonEditorState,
  ThemeEditorState,
  EditorType,
} from "@/types/editor";
import { ButtonVariant, ButtonSize } from "@/types/button";
import { isEqual } from "lodash";
import { defaultThemeState } from "@/config/theme";
import defaultButtonStyles from "@/config/button";

// Default button state
const defaultButtonState: ButtonEditorState = {
  styles: defaultButtonStyles,
  variant: "default" as ButtonVariant,
  size: "default" as ButtonSize,
};

interface EditorStore {
  buttonState: ButtonEditorState;
  themeState: ThemeEditorState;
  setButtonState: (state: ButtonEditorState) => void;
  setThemeState: (state: ThemeEditorState) => void;
  resetToDefault: (type: EditorType) => void;
  hasStateChanged: (type: EditorType) => boolean;
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      buttonState: defaultButtonState,
      themeState: defaultThemeState,
      setButtonState: (state: ButtonEditorState) => set({ buttonState: state }),
      setThemeState: (state: ThemeEditorState) => set({ themeState: state }),
      resetToDefault: (type: EditorType) => {
        if (type === "button") {
          set({ buttonState: defaultButtonState });
        } else if (type === "theme") {
          set({ themeState: defaultThemeState });
        }
      },
      hasStateChanged: (type: EditorType) => {
        const state = get();
        if (type === "button") {
          return !isEqual(state.buttonState, defaultButtonState);
        } else if (type === "theme") {
          return !isEqual(state.themeState.styles, defaultThemeState.styles);
        }
        return false;
      },
    }),
    {
      name: "editor-storage", // unique name for localStorage
    },
  ),
);

