import { ButtonStyleProps, ButtonVariant, ButtonSize } from './button';

// Base interface for any editor's state
export interface BaseEditorState {
  styles: Record<string, any>;
  variant?: string;
  size?: string;
}

// Interface for editor-specific controls
export interface EditorControls {
  variant?: {
    value: string;
    onChange: (value: string) => void;
  };
  size?: {
    value: string;
    onChange: (value: string) => void;
  };
}

// Interface for editor-specific preview props
export interface EditorPreviewProps {
  styles: Record<string, any>;
  variant?: string;
  size?: string;
}

// Interface for editor-specific code generation
export interface EditorCodeGenerator {
  generateComponentCode: (styles: Record<string, any>, variant?: string, size?: string) => string;
}

// Button-specific editor state
export interface ButtonEditorState extends BaseEditorState {
  styles: ButtonStyleProps;
  variant: ButtonVariant;
  size: ButtonSize;
}

// Type for available editors
export type EditorType = 'button' | 'input' | 'card' | 'dialog';

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