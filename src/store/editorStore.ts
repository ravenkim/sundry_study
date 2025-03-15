import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BaseEditorState, ButtonEditorState, ThemeEditorState, EditorType } from '@/types/editor';
import { buttonEditorConfig } from '@/config/editors/button';
import { themeEditorConfig } from '@/config/editors/theme';
import { isEqual } from 'lodash';

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
      buttonState: buttonEditorConfig.defaultState as ButtonEditorState,
      themeState: themeEditorConfig.defaultState as ThemeEditorState,
      setButtonState: (state: ButtonEditorState) => set({ buttonState: state }),
      setThemeState: (state: ThemeEditorState) => set({ themeState: state }),
      resetToDefault: (type: EditorType) => {
        if (type === 'button') {
          set({ buttonState: buttonEditorConfig.defaultState as ButtonEditorState });
        } else if (type === 'theme') {
          set({ themeState: themeEditorConfig.defaultState as ThemeEditorState });
        }
      },
      hasStateChanged: (type: EditorType) => {
        const state = get();
        if (type === 'button') {
          return !isEqual(state.buttonState, buttonEditorConfig.defaultState);
        } else if (type === 'theme') {
          return !isEqual(state.themeState, themeEditorConfig.defaultState);
        }
        return false;
      },
    }),
    {
      name: 'editor-storage', // unique name for localStorage
    }
  )
); 