
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { ColorPickerProps } from '@/types';

const ColorPicker = ({ color, onChange, label }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1.5">
        <Label htmlFor={`color-${label.replace(/\s+/g, '-').toLowerCase()}`} className="text-xs font-medium">
          {label}
        </Label>
        <div className="text-xs text-muted-foreground">{color}</div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="h-8 w-8 rounded border cursor-pointer overflow-hidden relative flex items-center justify-center"
          style={{ backgroundColor: color }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <input
            type="color"
            id={`color-${label.replace(/\s+/g, '-').toLowerCase()}`}
            value={color}
            onChange={handleChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </div>

        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 h-8 px-2 text-sm rounded-md border bg-background"
        />
      </div>
    </div>
  );
};

export default ColorPicker;
