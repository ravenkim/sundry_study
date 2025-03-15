
import { EditorConfig } from '@/types/editor';
import { ButtonEditorState } from '@/types/editor';
import { ButtonStyleProps, ButtonVariant, ButtonSize } from '@/types/index';
import ControlPanel from '@/components/editor/ControlPanel';
import PreviewPanel from '@/components/editor/PreviewPanel';
import { generateButtonComponentCode } from '@/utils/buttonStyleGenerator';

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
  hoverTextColor: '#ffffff',
  hoverBorderColor: '#000000',
  hoverBackgroundOpacity: 90,
  transitionDuration: 200,
  transitionEasing: 'ease',
  focusBorderColor: '#000000',
  focusRingColor: '#000000',
  focusRingWidth: 2,
  activeBackgroundColor: '#1a1a1a',
  activeTextColor: '#ffffff',
  activeBorderColor: '#000000',
};

const defaultButtonState: ButtonEditorState = {
  styles: defaultButtonStyles,
  variant: 'default' as ButtonVariant,
  size: 'default' as ButtonSize,
};

export const buttonEditorConfig: EditorConfig = {
  type: 'button',
  name: 'Button',
  description: 'A versatile button component with customizable styles and states',
  defaultState: defaultButtonState,
  controls: ControlPanel,
  preview: PreviewPanel,
  codeGenerator: {
    generateComponentCode: (styles: any) => {
      // Extract variant and size from the full state object
      if (styles && 'styles' in styles) {
        const buttonState = styles as ButtonEditorState;
        return generateButtonComponentCode(
          buttonState.styles, 
          buttonState.variant, 
          buttonState.size
        );
      }
      // Fallback for direct style objects (legacy support)
      return generateButtonComponentCode(
        styles as ButtonStyleProps, 
        'default', 
        'default'
      );
    }
  },
};
