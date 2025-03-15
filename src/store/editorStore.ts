import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BaseEditorState, ButtonEditorState, ThemeEditorState, EditorType } from '@/types/editor';
import { ButtonStyleProps, ButtonVariant, ButtonSize } from '@/types/button';
import { isEqual } from 'lodash';
import { defaultThemeState } from '@/config/theme';

// Default button styles
const defaultButtonStyles: ButtonStyleProps = {
  backgroundColor: '#000000',
  textColor: '#ffffff',
  borderColor: '#000000',
  borderWidth: 0,
  borderRadius: 6,
  paddingX: 16,
  paddingY: 8,
  fontSize: 14,
  fontWeight: '500',
  textTransform: 'none',
  letterSpacing: 0,
  lineHeight: 1.5,
  shadowOpacity: 0,
  shadowColor: '#000000',
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  shadowBlur: 0,
  shadowSpread: 0,
  hoverBackgroundColor: '#2a2a2a',
  hoverBackgroundOpacity: 90,
  hoverTextColor: '#ffffff',
  hoverBorderColor: '#000000',
  focusBorderColor: '#000000',
  focusRingColor: '#000000',
  focusRingWidth: 2,
  activeBackgroundColor: '#1a1a1a',
  activeTextColor: '#ffffff',
  activeBorderColor: '#000000',
  transitionDuration: 200,
  transitionEasing: 'ease',
};

// Default button state
const defaultButtonState: ButtonEditorState = {
  styles: defaultButtonStyles,
  variant: 'default' as ButtonVariant,
  size: 'default' as ButtonSize,
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
        if (type === 'button') {
          set({ buttonState: defaultButtonState });
        } else if (type === 'theme') {
          set({ themeState: defaultThemeState });
        }
      },
      hasStateChanged: (type: EditorType) => {
        const state = get();
        if (type === 'button') {
          return !isEqual(state.buttonState, defaultButtonState);
        } else if (type === 'theme') {
          return !isEqual(state.themeState, defaultThemeState);
        }
        return false;
      },
    }),
    {
      name: 'editor-storage', // unique name for localStorage
    }
  )
); 