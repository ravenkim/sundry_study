import React from 'react';
import { editorTypes } from '@/config/editors';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface EditorTypeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

const EditorTypeSelect: React.FC<EditorTypeSelectProps> = ({ value, onValueChange }) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[200px] h-10 text-base font-medium bg-background border-2 hover:border-primary/50 focus:border-primary transition-colors">
        <SelectValue placeholder="Select editor" />
      </SelectTrigger>
      <SelectContent>
        {editorTypes.map((type) => (
          <SelectItem key={type} value={type} className="text-base py-2">
            {type.charAt(0).toUpperCase() + type.slice(1)} Editor
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default EditorTypeSelect; 