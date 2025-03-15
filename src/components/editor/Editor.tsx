import React, { useState, useEffect } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EditorConfig, BaseEditorState, ButtonEditorState, ThemeEditorState } from '@/types/editor';
import { ThemeStyles } from '@/types/theme';
import CodePanel from './CodePanel';
import { Sliders } from 'lucide-react';

interface EditorProps {
  config: EditorConfig;
  initialState?: BaseEditorState;
}

const isThemeStyles = (styles: any): styles is ThemeStyles => {
  return 'light' in styles && 'dark' in styles;
};

const Editor: React.FC<EditorProps> = ({ config, initialState }) => {
  const [state, setState] = useState<BaseEditorState>(initialState || config.defaultState);
  const Controls = config.controls;
  const Preview = config.preview;
  
  // Reset state when config changes (i.e., when switching editor types)
  useEffect(() => {
    if (config.defaultState) {
      setState(config.defaultState);
    }
  }, [config]);

  const handleStyleChange = (newStyles: BaseEditorState['styles']) => {
    setState(prev => ({ ...prev, styles: newStyles }));
  };

  const handleModeChange = (mode: 'light' | 'dark') => {
    if (config.type === 'theme') {
      setState(prev => ({
        ...prev,
        currentMode: mode
      }));
    }
  };

  const isThemeEditor = config.type === 'theme';
  const themeState = state as ThemeEditorState;
  const buttonState = state as ButtonEditorState;

  // Ensure we have valid theme styles for theme editor
  const styles = isThemeEditor && !isThemeStyles(state.styles) 
    ? (config.defaultState as ThemeEditorState).styles 
    : state.styles;

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
                {...(isThemeEditor && {
                  currentMode: themeState.currentMode,
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
                      currentMode: themeState.currentMode,
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
                {...(isThemeEditor && {
                  currentMode: themeState.currentMode,
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
                  currentMode: themeState.currentMode,
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
