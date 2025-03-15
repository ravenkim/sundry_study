import React, { useState, useEffect } from 'react';
import { getEditorConfig, editorTypes } from '@/config/editors';
import Editor from '@/components/editor/Editor';
import EditorTypeSelect from '@/components/editor/EditorTypeSelect';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GitHubIcon } from '@/components/icons/GitHubIcon';
import { useSearchParams } from 'react-router-dom';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const editorType = searchParams.get('editor') || 'button';
  const editorConfig = getEditorConfig(editorType);

  const handleEditorChange = (value: string) => {
    setSearchParams({ editor: value });
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b">
        <div className="px-4 py-4 flex items-center gap-2 justify-between">
          <div className='flex items-center gap-1'>
            <h1 className="text-2xl font-bold">tweakcn</h1>
            <Badge variant="secondary" className='bg-blue-100 text-blue-500 hidden md:block'>BETA</Badge>
          </div>
          <EditorTypeSelect value={editorType} onValueChange={handleEditorChange} />
          <div className="flex items-center gap-4">
            <Button variant="link" asChild>
              <a href="https://github.com/jnsahaj/tweakcn" target="_blank" rel="noopener noreferrer">
                <GitHubIcon />
              </a>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden">
        <Editor config={editorConfig} />
      </main>
    </div>
  );
};

export default Index;
