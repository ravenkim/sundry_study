import React, { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ThemeFontSelectProps {
  fonts: Record<string, string>;
  defaultValue: string;
  currentFont: string | null;
  onFontChange: (font: string) => void;
}

const ThemeFontSelect: React.FC<ThemeFontSelectProps> = ({
  fonts,
  defaultValue,
  currentFont,
  onFontChange,
}) => {
  const fontNames = useMemo(() => ["Default", ...Object.keys(fonts)], [fonts]);
  const value = fonts[currentFont] ?? defaultValue;

  return (
    <Select value={value} onValueChange={onFontChange}>
      <div className="flex gap-1 items-center">
        <SelectTrigger className="w-full md:w-64">
          <SelectValue placeholder="Select theme font" />
        </SelectTrigger>
      </div>
      <SelectContent>
        <SelectGroup>
          {fontNames.map((fontName) => (
            <SelectItem key={fontName} value={fonts[fontName] ?? defaultValue}>
              <span className="capitalize ml-2">
                {fontName}
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ThemeFontSelect;
