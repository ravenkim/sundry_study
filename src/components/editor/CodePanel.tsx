
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { EditorType } from '@/types/editor';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

interface CodePanelProps {
  code: string;
  editorType: EditorType;
}

const CodePanel: React.FC<CodePanelProps> = ({ code, editorType }) => {
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
    <div className="h-full flex flex-col p-4">
      <div className="flex-none px-2 mb-4">
        <h2 className="text-lg font-semibold">Code</h2>
      </div>

      <div className="flex-1 min-h-0 flex flex-col rounded-lg border overflow-hidden">
        <div className="flex-none flex justify-between items-center px-4 py-2 border-b bg-muted/50">
          <span className="text-xs font-medium">{getFileName()}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(code)}
            className="h-8 px-2"
            aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                <span className="sr-only md:not-sr-only">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                <span className="sr-only md:not-sr-only">Copy</span>
              </>
            )}
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <pre className="h-full p-4 text-sm">
            <code>{code}</code>
          </pre>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </div>
    </div>
  );
};

export default CodePanel;
