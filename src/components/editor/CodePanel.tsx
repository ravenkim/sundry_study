
import React, { useState } from 'react';
import { CodePanelProps } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { 
  generateCssOutput, 
  generateButtonComponentCode,
  generateTailwindConfig,
  generateShadcnConfig
} from '@/utils/buttonStyleGenerator';
import { toast } from 'sonner';

const CodePanel = ({ styles, variant, size }: CodePanelProps) => {
  const [copied, setCopied] = useState(false);
  
  const cssCode = generateCssOutput(styles, variant, size);
  const componentCode = generateButtonComponentCode(styles, variant, size);
  const tailwindCode = generateTailwindConfig(styles, variant);
  const shadcnCode = generateShadcnConfig(styles, variant);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-medium">Generated Code</h2>
        <p className="text-sm text-muted-foreground">
          Copy and paste this code into your project to use your customized button.
        </p>
      </div>
      
      <Tabs defaultValue="component" className="flex-1 flex flex-col">
        <TabsList className="mb-4">
          <TabsTrigger value="component">Component</TabsTrigger>
          <TabsTrigger value="css">CSS</TabsTrigger>
          <TabsTrigger value="tailwind">Tailwind Config</TabsTrigger>
          <TabsTrigger value="shadcn">ShadCN Config</TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value="component" className="h-full mt-0 flex flex-col">
            <div className="flex justify-between items-center mb-2 px-4 py-2 border-b">
              <span className="text-xs font-medium">button.tsx</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard(componentCode)}
                className="h-8 px-2"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="ml-1 text-xs">Copy</span>
              </Button>
            </div>
            <div className="flex-1 overflow-auto bg-slate-950 rounded-md p-4 text-sm font-mono text-slate-50">
              <pre className="whitespace-pre-wrap">{componentCode}</pre>
            </div>
          </TabsContent>
          
          <TabsContent value="css" className="h-full mt-0 flex flex-col">
            <div className="flex justify-between items-center mb-2 px-4 py-2 border-b">
              <span className="text-xs font-medium">button.css</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard(cssCode)}
                className="h-8 px-2"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="ml-1 text-xs">Copy</span>
              </Button>
            </div>
            <div className="flex-1 overflow-auto bg-slate-950 rounded-md p-4 text-sm font-mono text-slate-50">
              <pre className="whitespace-pre-wrap">{cssCode}</pre>
            </div>
          </TabsContent>
          
          <TabsContent value="tailwind" className="h-full mt-0 flex flex-col">
            <div className="flex justify-between items-center mb-2 px-4 py-2 border-b">
              <span className="text-xs font-medium">tailwind.config.js</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard(tailwindCode)}
                className="h-8 px-2"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="ml-1 text-xs">Copy</span>
              </Button>
            </div>
            <div className="flex-1 overflow-auto bg-slate-950 rounded-md p-4 text-sm font-mono text-slate-50">
              <pre className="whitespace-pre-wrap">{tailwindCode}</pre>
            </div>
          </TabsContent>
          
          <TabsContent value="shadcn" className="h-full mt-0 flex flex-col">
            <div className="flex justify-between items-center mb-2 px-4 py-2 border-b">
              <span className="text-xs font-medium">components.json</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard(shadcnCode)}
                className="h-8 px-2"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="ml-1 text-xs">Copy</span>
              </Button>
            </div>
            <div className="flex-1 overflow-auto bg-slate-950 rounded-md p-4 text-sm font-mono text-slate-50">
              <pre className="whitespace-pre-wrap">{shadcnCode}</pre>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default CodePanel;
