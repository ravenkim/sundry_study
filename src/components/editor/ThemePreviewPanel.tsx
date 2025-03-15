
import React from 'react';
import { ThemeEditorPreviewProps } from '@/types/theme';
import { Sun, Moon, Mail, Check, Settings, Trash, Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ThemePreviewPanel = ({ styles, currentMode, onModeChange }: ThemeEditorPreviewProps) => {
  if (!styles || !styles[currentMode]) {
    return null;
  }

  const renderColorPreview = (label: string, color: string) => (
    <div className="flex items-center gap-4">
      <div 
        className="w-12 h-12 rounded-md" 
        style={{ backgroundColor: color }}
      />
      <div className="flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{color}</p>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Theme Preview</h2>
        <div className="flex border rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => onModeChange('light')}
            className={`p-1.5 ${
              currentMode === 'light' 
                ? 'bg-muted text-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
            aria-label="Light mode"
          >
            <Sun className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onModeChange('dark')}
            className={`p-1.5 ${
              currentMode === 'dark' 
                ? 'bg-muted text-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
            aria-label="Dark mode"
          >
            <Moon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className={`flex-1 rounded-lg border overflow-y-auto ${currentMode === 'dark' ? 'dark' : ''}`}>
        <Tabs defaultValue="components" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="colors">Color Palette</TabsTrigger>
          </TabsList>
          
          <TabsContent value="components" className="p-4 space-y-6">
            {/* Button showcase */}
            <section className="space-y-4">
              <h3 className="text-sm font-medium">Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button disabled>Disabled</Button>
                <Button size="sm">Small</Button>
                <Button size="lg">Large</Button>
                <Button><Mail className="mr-2 h-4 w-4" /> With Icon</Button>
              </div>
            </section>

            {/* Card showcase */}
            <section className="space-y-4">
              <h3 className="text-sm font-medium">Card</h3>
              <Card>
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>Card description goes here</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">This is the main content of the card.</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="ghost">Cancel</Button>
                  <Button>Submit</Button>
                </CardFooter>
              </Card>
            </section>

            {/* Badge & Alert showcase */}
            <section className="space-y-4">
              <h3 className="text-sm font-medium">Badges & Alerts</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
              <Alert>
                <Settings className="h-4 w-4" />
                <AlertTitle>Settings Updated</AlertTitle>
                <AlertDescription>
                  Your settings have been updated successfully.
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <Trash className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  There was an error processing your request.
                </AlertDescription>
              </Alert>
            </section>

            {/* Interactive components */}
            <section className="space-y-4">
              <h3 className="text-sm font-medium">Interactive Elements</h3>
              <div className="flex items-center space-x-2 mb-4">
                <Switch id="airplane-mode" />
                <label htmlFor="airplane-mode">Airplane Mode</label>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button><Plus className="mr-2 h-4 w-4" /> Create New</Button>
                <Button variant="outline"><Check className="mr-2 h-4 w-4" /> Confirm</Button>
                <Button variant="secondary">Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </div>
            </section>
          </TabsContent>
          
          <TabsContent value="colors" className="p-4 space-y-4">
            <div className="space-y-4">
              {renderColorPreview('Background', styles[currentMode].background)}
              {renderColorPreview('Foreground', styles[currentMode].foreground)}
              {renderColorPreview('Card Background', styles[currentMode].card)}
              {renderColorPreview('Card Foreground', styles[currentMode]['card-foreground'])}
              {renderColorPreview('Popover Background', styles[currentMode].popover)}
              {renderColorPreview('Popover Foreground', styles[currentMode]['popover-foreground'])}
              {renderColorPreview('Primary', styles[currentMode].primary)}
              {renderColorPreview('Primary Foreground', styles[currentMode]['primary-foreground'])}
              {renderColorPreview('Secondary', styles[currentMode].secondary)}
              {renderColorPreview('Secondary Foreground', styles[currentMode]['secondary-foreground'])}
              {renderColorPreview('Muted', styles[currentMode].muted)}
              {renderColorPreview('Muted Foreground', styles[currentMode]['muted-foreground'])}
              {renderColorPreview('Accent', styles[currentMode].accent)}
              {renderColorPreview('Accent Foreground', styles[currentMode]['accent-foreground'])}
              {renderColorPreview('Destructive', styles[currentMode].destructive)}
              {renderColorPreview('Destructive Foreground', styles[currentMode]['destructive-foreground'])}
              {renderColorPreview('Border', styles[currentMode].border)}
              {renderColorPreview('Input', styles[currentMode].input)}
              {renderColorPreview('Ring', styles[currentMode].ring)}
              {renderColorPreview('Chart 1', styles[currentMode]['chart-1'])}
              {renderColorPreview('Chart 2', styles[currentMode]['chart-2'])}
              {renderColorPreview('Chart 3', styles[currentMode]['chart-3'])}
              {renderColorPreview('Chart 4', styles[currentMode]['chart-4'])}
              {renderColorPreview('Chart 5', styles[currentMode]['chart-5'])}
              {renderColorPreview('Sidebar Background', styles[currentMode].sidebar)}
              {renderColorPreview('Sidebar Foreground', styles[currentMode]['sidebar-foreground'])}
              {renderColorPreview('Sidebar Primary', styles[currentMode]['sidebar-primary'])}
              {renderColorPreview('Sidebar Primary Foreground', styles[currentMode]['sidebar-primary-foreground'])}
              {renderColorPreview('Sidebar Accent', styles[currentMode]['sidebar-accent'])}
              {renderColorPreview('Sidebar Accent Foreground', styles[currentMode]['sidebar-accent-foreground'])}
              {renderColorPreview('Sidebar Border', styles[currentMode]['sidebar-border'])}
              {renderColorPreview('Sidebar Ring', styles[currentMode]['sidebar-ring'])}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ThemePreviewPanel;
