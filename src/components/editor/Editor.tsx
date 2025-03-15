import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EditorConfig, BaseEditorState } from '@/types/editor';
import CodePanel from './CodePanel';

interface EditorProps {
  config: EditorConfig;
  initialState?: BaseEditorState;
}

const Editor: React.FC<EditorProps> = ({ config, initialState }) => {
  const [state, setState] = useState<BaseEditorState>(initialState || config.defaultState);
  const Controls = config.controls;
  const Preview = config.preview;

  const handleStyleChange = (newStyles: Record<string, any>) => {
    setState(prev => ({ ...prev, styles: newStyles }));
  };

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
              />
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={45}>
            <div className="h-full p-4">
              <Preview
                styles={state.styles}
              />
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={30}>
            <div className="h-full p-4 overflow-hidden">
              <CodePanel
                styles={state.styles}
                codeGenerator={config.codeGenerator}
                editorType={config.type}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      
      {/* Mobile Layout */}
      <div className="h-full md:hidden overflow-hidden">
        <Tabs defaultValue="controls" className="h-full flex flex-col">
          <TabsList className="w-full">
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-hidden">
            <TabsContent value="controls" className="h-full m-0 overflow-y-auto p-4">
              <Controls
                styles={state.styles}
                onChange={handleStyleChange}
              />
            </TabsContent>
            
            <TabsContent value="preview" className="h-full m-0 overflow-hidden p-4">
              <div className="h-full">
                <Preview
                  styles={state.styles}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="code" className="h-full m-0 overflow-hidden p-4">
              <div className="h-full">
                <CodePanel
                  styles={state.styles}
                  codeGenerator={config.codeGenerator}
                  editorType={config.type}
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Editor; 