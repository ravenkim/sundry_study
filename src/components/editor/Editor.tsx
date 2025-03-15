import React, { useEffect, useLayoutEffect } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EditorConfig, BaseEditorState, ButtonEditorState, ThemeEditorState } from '@/types/editor';
import { ThemeStyles } from '@/types/theme';
import { ButtonStyleProps } from '@/types/button';
import CodePanel from './CodePanel';
import { Sliders, RotateCcw } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { convertToHSL } from '../../utils/colorConverter';

interface EditorProps {
  config: EditorConfig;
  initialState?: BaseEditorState;
}

const isThemeStyles = (styles: any): styles is ThemeStyles => {
  return !!styles && 'light' in styles && 'dark' in styles;
};

const Editor: React.FC<EditorProps> = ({ config }) => {
  const { buttonState, themeState, setButtonState, setThemeState, resetToDefault, hasStateChanged } = useEditorStore();
  const { toast } = useToast();
  const Controls = config.controls;
  const Preview = config.preview;

  const state = config.type === 'theme' ? themeState : buttonState;
  const hasChanges = hasStateChanged(config.type);

  const handleStyleChange = (newStyles: ThemeStyles | ButtonStyleProps) => {
    if (config.type === 'theme') {
      setThemeState({ ...themeState, styles: newStyles as ThemeStyles });
    } else {
      setButtonState({ ...buttonState, styles: newStyles as ButtonStyleProps });
    }
  };

  const handleModeChange = (mode: 'light' | 'dark') => {
    if (config.type === 'theme') {
      setThemeState({ ...themeState, currentMode: mode });
    }
  };

  const handleReset = () => {
    resetToDefault(config.type);
    toast({
      title: "Reset successful",
      description: "All settings have been restored to their default values.",
    });
  };

  const isThemeEditor = config.type === 'theme';

  // Ensure we have valid theme styles for theme editor
  const styles = isThemeEditor && !isThemeStyles(state.styles)
    ? (config.defaultState as ThemeEditorState).styles
    : state.styles;

  useLayoutEffect(() => {
    const mode = themeState.currentMode;
    let root: Element | null = null;
    if (mode === 'light') {
      root = document.querySelector('.preview-theme');
    } else if (mode === 'dark') {
      root = document.querySelector('.preview-theme-dark');
    }
    if (!root) {
      console.error('Preview root not found');
      return;
    }

    const themeStyles = themeState.styles;

    Object.entries(themeStyles[mode]).forEach(([key, value]) => {
      if (typeof value === 'string' && (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl'))) {
        // Convert the color to HSL format
        const hslValue = convertToHSL(value);
        root.style.setProperty(`--${key}`, hslValue);
      }
    });
  }, [themeState]);

  return (
    <div className="h-full overflow-hidden">
      {/* Desktop Layout */}
      <div className="h-full hidden md:block">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
            <div className="h-full p-4 overflow-y-auto">
              <Controls
                styles={state.styles}
                onChange={handleStyleChange}
                onReset={handleReset}
                hasChanges={hasChanges}
                {...(isThemeEditor && {
                  currentMode: (state as ThemeEditorState).currentMode,
                  onModeChange: handleModeChange
                })}
              />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>
            <ResizablePanelGroup direction="horizontal" className="h-full">
              <ResizablePanel defaultSize={60} minSize={40}>
                <div className="h-full p-4">
                  <Preview
                    styles={styles}
                    {...(isThemeEditor && {
                      currentMode: (state as ThemeEditorState).currentMode,
                      onModeChange: handleModeChange
                    })}
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={40} minSize={30}>
                <CodePanel
                  code={config.codeGenerator.generateComponentCode(styles)}
                  editorType={config.type}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile Layout */}
      <div className="h-full md:hidden">
        <Tabs defaultValue="controls" className="h-full">
          <TabsList className="w-full">
            <TabsTrigger value="controls" className="flex-1">
              <Sliders className="h-4 w-4 mr-2" />
              Controls
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
            <TabsTrigger value="code" className="flex-1">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="controls" className="h-[calc(100%-2.5rem)]">
            <div className="h-full p-4 overflow-y-auto">
              <Controls
                styles={styles}
                onChange={handleStyleChange}
                onReset={handleReset}
                hasChanges={hasChanges}
                {...(isThemeEditor && {
                  currentMode: (state as ThemeEditorState).currentMode,
                  onModeChange: handleModeChange
                })}
              />
            </div>
          </TabsContent>
          <TabsContent value="preview" className="h-[calc(100%-2.5rem)]">
            <div className="h-full p-4">
              <Preview
                styles={styles}
                {...(isThemeEditor && {
                  currentMode: (state as ThemeEditorState).currentMode,
                  onModeChange: handleModeChange
                })}
              />
            </div>
          </TabsContent>
          <TabsContent value="code" className="h-[calc(100%-2.5rem)]">
            <CodePanel
              code={config.codeGenerator.generateComponentCode(styles)}
              editorType={config.type}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Editor;
