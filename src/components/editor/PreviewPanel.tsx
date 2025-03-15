
import React from 'react';
import { EditorPreviewProps } from '@/types/editor';
import ButtonPreview from './ButtonPreview';
import { ButtonEditorState } from '@/types/editor';
import { Button } from '@/components/ui/button';

const PreviewPanel: React.FC<EditorPreviewProps & Partial<ButtonEditorState>> = (props) => {
  // If this is a button editor state with styles, variant, and size
  if ('styles' in props && 'variant' in props && 'size' in props) {
    const { styles, variant, size } = props as ButtonEditorState;
    
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Button Preview</h2>
        </div>

        <div className="flex-1 rounded-lg border p-6 flex flex-col items-center justify-center space-y-8">
          {/* <div className="flex flex-col gap-2 items-center">
            <p className="text-sm font-medium text-muted-foreground">Custom Button</p>
            <ButtonPreview styles={styles} variant={variant} size={size} />
          </div> */}
          
          {/* <div className="flex flex-col gap-2 items-center">
            <p className="text-sm font-medium text-muted-foreground">Regular ShadCN Button</p>
            <Button variant={variant} size={size}>Button</Button>
          </div> */}
          
          {/* <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="flex flex-col gap-2 items-center">
              <p className="text-xs text-muted-foreground">Default</p>
              <ButtonPreview styles={styles} variant="default" size={size} />
            </div>
            <div className="flex flex-col gap-2 items-center">
              <p className="text-xs text-muted-foreground">Secondary</p>
              <ButtonPreview styles={styles} variant="secondary" size={size} />
            </div>
            <div className="flex flex-col gap-2 items-center">
              <p className="text-xs text-muted-foreground">Destructive</p>
              <ButtonPreview styles={styles} variant="destructive" size={size} />
            </div>
            <div className="flex flex-col gap-2 items-center">
              <p className="text-xs text-muted-foreground">Outline</p>
              <ButtonPreview styles={styles} variant="outline" size={size} />
            </div>
          </div> */}

          <div className="flex items-center gap-4 max-w-md">
            <div className="flex flex-col gap-2 items-center">
              <p className="text-xs text-muted-foreground">Small</p>
              <ButtonPreview styles={styles} variant={variant} size="sm" />
            </div>
            <div className="flex flex-col gap-2 items-center">
              <p className="text-xs text-muted-foreground">Default</p>
              <ButtonPreview styles={styles} variant={variant} size="default" />
            </div>
            <div className="flex flex-col gap-2 items-center">
              <p className="text-xs text-muted-foreground">Large</p>
              <ButtonPreview styles={styles} variant={variant} size="lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Fallback for other types of editors or missing props
  return (
    <div className="h-full flex items-center justify-center">
      <p className="text-muted-foreground">Preview not available</p>
    </div>
  );
};

export default PreviewPanel;
