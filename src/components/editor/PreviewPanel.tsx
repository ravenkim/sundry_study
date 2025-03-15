
import React from 'react';
import { EditorPreviewProps } from '@/types/editor';
import ButtonPreview from './ButtonPreview';
import { ButtonEditorState } from '@/types/editor';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Info } from 'lucide-react';

const PreviewPanel: React.FC<EditorPreviewProps & Partial<ButtonEditorState>> = (props) => {
  // If this is a button editor state with styles, variant, and size
  if ('styles' in props && 'variant' in props && 'size' in props) {
    const { styles, variant, size } = props as ButtonEditorState;
    
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Button Preview</h2>
        </div>

        <div className="flex-1 rounded-lg border p-6 flex flex-col gap-8">
          {/* Main Preview Section */}
          <div className="flex flex-col">
            <h3 className="text-sm font-medium mb-3">Variant: {variant}</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col gap-2 items-center">
                <p className="text-xs text-muted-foreground">Default</p>
                <ButtonPreview styles={styles} variant={variant} size={size} />
              </div>
              <div className="flex flex-col gap-2 items-center">
                <p className="text-xs text-muted-foreground">Hover</p>
                <div className="relative">
                  <div className="absolute inset-0 bg-muted/20 rounded-md z-10 pointer-events-none" />
                  <ButtonPreview 
                    styles={styles} 
                    variant={variant} 
                    size={size} 
                    className="!pointer-events-none"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 items-center">
                <p className="text-xs text-muted-foreground">Active</p>
                <ButtonPreview 
                  styles={{
                    ...styles,
                    backgroundColor: styles.activeBackgroundColor,
                    textColor: styles.activeTextColor,
                    borderColor: styles.activeBorderColor
                  }} 
                  variant={variant} 
                  size={size} 
                />
              </div>
              <div className="flex flex-col gap-2 items-center">
                <p className="text-xs text-muted-foreground">Disabled</p>
                <ButtonPreview 
                  styles={styles} 
                  variant={variant} 
                  size={size} 
                  disabled={true} 
                />
              </div>
            </div>
          </div>

          {/* Size Preview Section */}
          <div className="flex flex-col">
            <h3 className="text-sm font-medium mb-3">Available Sizes</h3>
            <div className="flex flex-wrap gap-6 justify-center">
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
              <div className="flex flex-col gap-2 items-center">
                <p className="text-xs text-muted-foreground">Icon</p>
                <ButtonPreview 
                  styles={styles} 
                  variant={variant} 
                  size="icon" 
                  label="+" 
                />
              </div>
            </div>
          </div>

          {/* With Icons */}
          <div className="flex flex-col">
            <h3 className="text-sm font-medium mb-3">With Icons</h3>
            <div className="flex flex-wrap gap-6 justify-center">
              <div className="flex flex-col gap-2 items-center">
                <p className="text-xs text-muted-foreground">Start Icon</p>
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  <ButtonPreview styles={styles} variant={variant} size={size} />
                </div>
              </div>
              <div className="flex flex-col gap-2 items-center">
                <p className="text-xs text-muted-foreground">End Icon</p>
                <div className="flex items-center gap-2">
                  <ButtonPreview styles={styles} variant={variant} size={size} />
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              <div className="flex flex-col gap-2 items-center">
                <p className="text-xs text-muted-foreground">Both Icons</p>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <ButtonPreview styles={styles} variant={variant} size={size} />
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
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
