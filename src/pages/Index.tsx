import React, { useState, useEffect } from 'react';
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from '@/components/ui/resizable';
import { getDefaultButtonStyles } from '@/utils/buttonStyleGenerator';
import { ButtonStyleProps, ButtonVariant, ButtonSize } from '@/types';
import ControlPanel from '@/components/editor/ControlPanel';
import PreviewPanel from '@/components/editor/PreviewPanel';
import CodePanel from '@/components/editor/CodePanel';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GitHubIcon } from '@/components/icons/GitHubIcon';

const Index = () => {
  const [variant, setVariant] = useState<ButtonVariant>('default');
  const [size, setSize] = useState<ButtonSize>('default');
  const [styles, setStyles] = useState<ButtonStyleProps>(getDefaultButtonStyles(variant));
  const [showMobileNav, setShowMobileNav] = useState(false);
  
  // Update styles when variant changes
  useEffect(() => {
    setStyles(getDefaultButtonStyles(variant));
  }, [variant]);

  const handleStyleChange = React.useCallback((newStyles: ButtonStyleProps) => {
    setStyles(newStyles);
  }, []);
  
  return (
    <div className="h-screen w-full bg-editor overflow-hidden flex flex-col">
      <header className="h-14 border-b px-4 flex items-center justify-between bg-background/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">tweakcn</h1>
          <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">BETA</span>
        </div>
        
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/jnsahaj/tweakcn"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <GitHubIcon />
            <span>GitHub</span>
          </a>
          <button
            className="md:hidden block p-2"
            onClick={() => setShowMobileNav(!showMobileNav)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              {showMobileNav ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </header>
      
      <div className="flex-1 overflow-hidden">
        {/* Desktop Layout */}
        <div className="h-full hidden md:block">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
              <div className="h-full p-4 overflow-y-auto">
                <ControlPanel 
                  styles={styles} 
                  onChange={handleStyleChange}
                  variant={variant}
                  onVariantChange={setVariant}
                  size={size}
                  onSizeChange={setSize}
                />
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={45}>
              <div className="h-full p-4">
                <PreviewPanel styles={styles} variant={variant} size={size} />
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={30}>
              <div className="h-full p-4 overflow-hidden">
                <CodePanel styles={styles} variant={variant} size={size} />
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
                <ControlPanel 
                  styles={styles} 
                  onChange={handleStyleChange}
                  variant={variant}
                  onVariantChange={setVariant}
                  size={size}
                  onSizeChange={setSize}
                />
              </TabsContent>
              
              <TabsContent value="preview" className="h-full m-0 overflow-hidden p-4">
                <div className="h-full">
                  <PreviewPanel styles={styles} variant={variant} size={size} />
                </div>
              </TabsContent>
              
              <TabsContent value="code" className="h-full m-0 overflow-hidden p-4">
                <div className="h-full">
                  <CodePanel styles={styles} variant={variant} size={size} />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
      
      {/* Mobile menu overlay */}
      {showMobileNav && (
        <div 
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          onClick={() => setShowMobileNav(false)}
        >
          <div 
            className="absolute right-0 top-0 h-full w-3/4 max-w-xs bg-background border-l shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b">
              <button 
                className="p-2 float-right"
                onClick={() => setShowMobileNav(false)}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-xl font-medium">Menu</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
