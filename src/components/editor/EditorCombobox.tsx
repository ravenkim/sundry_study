import React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { editorTypes, getEditorConfig } from '@/config/editors';
import { useNavigate, useParams } from 'react-router-dom';
import { CommandList } from 'cmdk';

const EditorCombobox = ({ className }: { className?: string }) => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { editorType = 'theme' } = useParams();

  // Create a list of editors from the registry
  const editors = editorTypes.map(getEditorConfig).map((config) => ({
    value: config.type,
    label: config.name
  }));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[150px] md:w-[200px] justify-between", className)}
        >
          {editorType ?
            editors.find((editor) => editor.value === editorType)?.label :
            "Select editor..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0">
        <Command>
          <CommandInput placeholder="Search editor..." />
          <CommandEmpty>No editor found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {editors.map((editor) => (
                <CommandItem
                  key={editor.value}
                  value={editor.value}
                  onSelect={(currentValue) => {
                    navigate(`/editor/${currentValue}`);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      editorType === editor.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {editor.label}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default EditorCombobox;
