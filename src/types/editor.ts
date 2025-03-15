import { ButtonStyleProps, ButtonVariant, ButtonSize } from './button';

// Base interface for any editor's state
export interface BaseEditorState {
  styles: Record<string, any>;
}

// Interface for editor-specific controls
export interface EditorControls {
  // Controls can be added per editor type as needed
}

// Interface for editor-specific preview props
export interface EditorPreviewProps {
  styles: Record<string, any>;
}

// Interface for editor-specific code generation
export interface EditorCodeGenerator {
  generateComponentCode: (styles: Record<string, any>) => string;
}

// Button-specific editor state
export interface ButtonEditorState extends BaseEditorState {
  styles: ButtonStyleProps;
}

// Type for available editors
export type EditorType = 'button' | 'input' | 'card' | 'dialog' | 'theme';

// Interface for editor configuration
export interface EditorConfig {
  type: EditorType;
  name: string;
  description: string;
  defaultState: BaseEditorState;
  controls: React.ComponentType<any>;
  preview: React.ComponentType<EditorPreviewProps>;
  codeGenerator: EditorCodeGenerator;
} 