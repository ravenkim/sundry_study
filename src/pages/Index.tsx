import React from 'react';
import { getEditorConfig } from '@/config/editors';
import Editor from '@/components/editor/Editor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GitHubIcon } from '@/components/icons/GitHubIcon';

const Index = () => {
  // For now, we're only using the button editor
  const editorConfig = getEditorConfig('button');

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b">
        <div className="px-4 py-4 flex items-center gap-2 justify-between">
          <div className='flex items-center gap-2'>
          <h1 className="text-2xl font-bold">tweakcn</h1>
          <Badge variant="secondary">BETA</Badge>
          </div>
            <Button variant="link" asChild>
              <a href="https://github.com/jnsahaj/tweakcn" target="_blank" rel="noopener noreferrer">
                <GitHubIcon />
              </a>
            </Button>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden">
        <Editor config={editorConfig} />
      </main>
    </div>
  );
};

export default Index;
