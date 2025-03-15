import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { EditorCodeGenerator, EditorType } from '@/types/editor';

interface CodePanelProps {
  styles: Record<string, any>;
  codeGenerator: EditorCodeGenerator;
  editorType: EditorType;
}

const CodePanel: React.FC<CodePanelProps> = ({ styles, codeGenerator, editorType }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const componentCode = codeGenerator.generateComponentCode(styles);

  const getFileName = () => {
    switch (editorType) {
      case 'button':
        return 'button.tsx';
      case 'theme':
        return 'index.css';
      default:
        return 'index.tsx';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none px-2 mb-4">
        <h2 className="text-lg font-medium">Code</h2>
      </div>
      
      <div className="flex-1 min-h-0 flex flex-col rounded-lg border overflow-hidden">
        <div className="flex-none flex justify-between items-center px-4 py-2 border-b bg-muted/50">
          <span className="text-xs font-medium">{getFileName()}</span>
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
        <div className="flex-1 overflow-auto bg-slate-950 p-4">
          <pre className="text-sm font-mono text-slate-50 whitespace-pre-wrap">{componentCode}</pre>
        </div>
      </div>
    </div>
  );
};

export default CodePanel;
