import React, { useState, useEffect } from 'react';
import { getEditorConfig, editorTypes } from '@/config/editors';
import Editor from '@/components/editor/Editor';
import EditorTypeSelect from '@/components/editor/EditorTypeSelect';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GitHubIcon } from '@/components/icons/GitHubIcon';
import { useParams, useNavigate } from 'react-router-dom';

const Index = () => {
  const { editorType = 'button' } = useParams();
  const navigate = useNavigate();
  const editorConfig = getEditorConfig(editorType);

  const handleEditorChange = (value: string) => {
    navigate(`/editor/${value}`);
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b">
        <div className="px-4 py-4 flex items-center gap-2 justify-between">
          <div className='flex items-center gap-1'>
            <h1 className="text-2xl font-bold">tweakcn</h1>
            <Badge variant="secondary" className='bg-blue-100 text-blue-500 hidden md:block'>BETA</Badge>
            <div className='ml-2'>
              <EditorTypeSelect value={editorType} onValueChange={handleEditorChange} />
            </div>
          </div>
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
