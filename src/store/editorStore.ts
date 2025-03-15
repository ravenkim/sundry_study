import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BaseEditorState, ButtonEditorState, ThemeEditorState } from '@/types/editor';
import { buttonEditorConfig } from '@/config/editors/button';
import { themeEditorConfig } from '@/config/editors/theme';

interface EditorStore {
  buttonState: ButtonEditorState;
  themeState: ThemeEditorState;
  setButtonState: (state: ButtonEditorState) => void;
  setThemeState: (state: ThemeEditorState) => void;
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set) => ({
      buttonState: buttonEditorConfig.defaultState as ButtonEditorState,
      themeState: themeEditorConfig.defaultState as ThemeEditorState,
      setButtonState: (state: ButtonEditorState) => set({ buttonState: state }),
      setThemeState: (state: ThemeEditorState) => set({ themeState: state }),
    }),
    {
      name: 'editor-storage', // unique name for localStorage
    }
  )
); 