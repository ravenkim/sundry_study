
import React, { useState } from 'react';
import { getEditorConfig, editorTypes } from '@/config/editors';
import Editor from '@/components/editor/Editor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GitHubIcon } from '@/components/icons/GitHubIcon';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const Index = () => {
  const [editorType, setEditorType] = useState('button');
  const editorConfig = getEditorConfig(editorType);

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b">
        <div className="px-4 py-4 flex items-center gap-2 justify-between">
          <div className='flex items-center gap-2'>
            <h1 className="text-2xl font-bold">tweakcn</h1>
            <Badge variant="secondary">BETA</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Select
              value={editorType}
              onValueChange={setEditorType}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select editor" />
              </SelectTrigger>
              <SelectContent>
                {editorTypes.map((type) => (
                  <SelectItem key={type} value={type} className="capitalize">
                    {type} Editor
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
