import { EditorConfig } from "@/types/editor";
import { ButtonEditorState } from "@/types/editor";
import { ButtonVariant, ButtonSize } from "@/types/index";
import ControlPanel from "@/components/editor/control-panel";
import PreviewPanel from "@/components/editor/preview-panel";
import { generateButtonComponentCode } from "@/utils/button-style-generator";
import defaultButtonStyles from "@/config/button";
import { ButtonStyles } from "@/types/button";

const defaultButtonState: ButtonEditorState = {
  styles: defaultButtonStyles,
  variant: "default" as ButtonVariant,
  size: "default" as ButtonSize,
};

export const buttonEditorConfig: EditorConfig = {
  type: "button",
  name: "Button",
  description: "A versatile button component with customizable styles and states",
  defaultState: defaultButtonState,
  controls: ControlPanel,
  preview: PreviewPanel,
  codeGenerator: {
    generateComponentCode: (styles: any) => {
      // Extract variant and size from the full state object
      if (styles && "styles" in styles) {
        const buttonState = styles as ButtonEditorState;
        return generateButtonComponentCode(
          buttonState.styles,
          buttonState.variant,
          buttonState.size
        );
      }
      // Fallback for direct style objects (legacy support)
      return generateButtonComponentCode(
        styles as ButtonStyles,
        "default",
        "default"
      );
    },
  },
};
