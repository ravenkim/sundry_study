
import React, { useState } from 'react';
import { PreviewPanelProps } from '@/types';
import ButtonPreview from './ButtonPreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Monitor, Moon, Sun, Smartphone } from 'lucide-react';

const PreviewPanel = ({ styles, variant, size }: PreviewPanelProps) => {
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light');
  const [viewportSize, setViewportSize] = useState<'desktop' | 'mobile'>('desktop');
  
  return (
    <div className="h-full flex flex-col">
      <div className="px-2 mb-4 flex justify-between items-center">
        <h2 className="text-lg font-medium">Preview</h2>
        
        <div className="flex space-x-2">
          <div className="flex border rounded-md overflow-hidden">
            <button
              type="button"
              onClick={() => setViewportSize('desktop')}
              className={`p-1.5 ${
                viewportSize === 'desktop' 
                  ? 'bg-muted text-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
              aria-label="Desktop view"
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewportSize('mobile')}
              className={`p-1.5 ${
                viewportSize === 'mobile' 
                  ? 'bg-muted text-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
              aria-label="Mobile view"
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex border rounded-md overflow-hidden">
            <button
              type="button"
              onClick={() => setPreviewMode('light')}
              className={`p-1.5 ${
                previewMode === 'light' 
                  ? 'bg-muted text-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
              aria-label="Light mode"
            >
              <Sun className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode('dark')}
              className={`p-1.5 ${
                previewMode === 'dark' 
                  ? 'bg-muted text-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
              aria-label="Dark mode"
            >
              <Moon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div 
          className={`h-full w-full flex flex-col rounded-lg border shadow-sm overflow-hidden transition-colors ${
            previewMode === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
          }`}
          style={{
            maxWidth: viewportSize === 'mobile' ? '375px' : '100%',
            margin: viewportSize === 'mobile' ? '0 auto' : '0',
          }}
        >
          <div className={`border-b p-3 ${previewMode === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
            {viewportSize === 'mobile' && (
              <div className="h-1.5 w-12 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto"></div>
            )}
            {viewportSize === 'desktop' && (
              <div className="flex gap-1.5">
                <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              </div>
            )}
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto">
            <Tabs defaultValue="default" className="w-full">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="default">Default</TabsTrigger>
                <TabsTrigger value="hover">Hover</TabsTrigger>
                <TabsTrigger value="contexts">Contexts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="default" className="mt-0 py-6 flex flex-col items-center justify-center space-y-4">
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-xs text-muted-foreground mb-2">Button Preview</span>
                  <ButtonPreview styles={styles} variant={variant} size={size} />
                </div>
                
                <div className="flex flex-col items-center space-y-2 mt-8">
                  <span className="text-xs text-muted-foreground mb-2">All Sizes</span>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <ButtonPreview styles={styles} variant={variant} size="sm" label="Small" />
                    <ButtonPreview styles={styles} variant={variant} size="default" label="Default" />
                    <ButtonPreview styles={styles} variant={variant} size="lg" label="Large" />
                    <ButtonPreview styles={styles} variant={variant} size="icon" label="+" />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="hover" className="mt-0 py-6 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-6">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground mb-2">Normal State</span>
                    <ButtonPreview styles={styles} variant={variant} size={size} />
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground mb-2">Hover State</span>
                    <ButtonPreview 
                      styles={styles} 
                      variant={variant} 
                      size={size} 
                      className="[&:not(:hover)]:bg-[var(--hover-bg)]" 
                      label="Hover State"
                      // Apply hover styles
                    />
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground mb-2">Focus State</span>
                    <ButtonPreview 
                      styles={styles} 
                      variant={variant} 
                      size={size} 
                      className="focus:outline-none focus:ring-2" 
                      label="Focus State"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="contexts" className="mt-0 py-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Button in Card</h3>
                    <Card className={`p-6 ${previewMode === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
                      <div className="space-y-4">
                        <h4 className="text-base font-medium">Card Title</h4>
                        <p className="text-sm text-muted-foreground">This is some sample content to show the button in context.</p>
                        <div>
                          <ButtonPreview styles={styles} variant={variant} size={size} />
                        </div>
                      </div>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Button in Form</h3>
                    <Card className={`p-6 ${previewMode === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email</label>
                          <input 
                            type="email" 
                            className={`w-full p-2 rounded-md border ${
                              previewMode === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'
                            }`}
                            placeholder="example@email.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Password</label>
                          <input 
                            type="password" 
                            className={`w-full p-2 rounded-md border ${
                              previewMode === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'
                            }`}
                            placeholder="••••••••"
                          />
                        </div>
                        <div>
                          <ButtonPreview styles={styles} variant={variant} size={size} label="Sign In" />
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
