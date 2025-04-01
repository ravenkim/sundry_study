import React, { useCallback, useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ThemePreset } from "../../types/theme";
import { useEditorStore } from "../../store/editor-store";
import { getPresetThemeStyles } from "../../utils/theme-presets";
import { Button } from "../ui/button";
import { Shuffle, Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";

interface ThemePresetSelectProps {
  presets: Record<string, ThemePreset>;
  currentPreset: string | null;
  onPresetChange: (preset: string) => void;
}

const ColorBox = ({ color }: { color: string }) => {
  return (
    <div
      className="w-3 h-3 rounded-sm border border-muted"
      style={{ backgroundColor: color }}
    />
  );
};

const ThemePresetSelect: React.FC<ThemePresetSelectProps> = ({
  presets,
  currentPreset,
  onPresetChange,
}) => {
  const { themeState } = useEditorStore();
  const { theme, toggleTheme } = useTheme();
  const mode = themeState.currentMode;
  const presetNames = useMemo(() => ["default", ...Object.keys(presets)], [presets]);
  const value = presetNames?.find((name) => name === currentPreset);
  const currentIndex = useMemo(
    () => presetNames.indexOf(value || "default"),
    [presetNames, value]
  );

  const randomize = useCallback(() => {
    const random = Math.floor(Math.random() * presetNames.length);
    onPresetChange(presetNames[random]);
  }, [onPresetChange, presetNames]);

  const cycleTheme = useCallback(
    (direction: "prev" | "next") => {
      const newIndex =
        direction === "next"
          ? (currentIndex + 1) % presetNames.length
          : (currentIndex - 1 + presetNames.length) % presetNames.length;
      onPresetChange(presetNames[newIndex]);
    },
    [currentIndex, presetNames, onPresetChange]
  );

  return (
    <div className="flex items-center gap-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full md:min-w-72 h-10 justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                <ColorBox
                  color={getPresetThemeStyles(value || "default")[mode].primary}
                />
                <ColorBox
                  color={getPresetThemeStyles(value || "default")[mode].accent}
                />
                <ColorBox
                  color={getPresetThemeStyles(value || "default")[mode].secondary}
                />
                <ColorBox
                  color={getPresetThemeStyles(value || "default")[mode].border}
                />
              </div>
              <span className="capitalize font-medium">
                {(value || "default").replace(/-/g, " ")}
              </span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="md:w-full p-6" align="start">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">Theme Mode</h4>
                <p className="text-xs text-muted-foreground">
                  Switch between light and dark mode
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9"
              >
                {theme === "light" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm">Theme Presets</h4>
                  <p className="text-xs text-muted-foreground">
                    Choose from our curated collection of themes
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={randomize}
                  title="Random theme"
                >
                  <Shuffle className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="h-[400px] -mr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pr-4">
                  {presetNames.map((presetName) => (
                    <Button
                      key={presetName}
                      variant={presetName === value ? "default" : "outline"}
                      className="h-auto py-2.5 px-3 justify-start transition-colors min-w-56"
                      onClick={() => onPresetChange(presetName)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex gap-0.5">
                          <ColorBox
                            color={getPresetThemeStyles(presetName)[mode].primary}
                          />
                          <ColorBox
                            color={getPresetThemeStyles(presetName)[mode].accent}
                          />
                          <ColorBox
                            color={getPresetThemeStyles(presetName)[mode].secondary}
                          />
                          <ColorBox
                            color={getPresetThemeStyles(presetName)[mode].border}
                          />
                        </div>
                        <span className="capitalize text-sm font-medium">
                          {presetName.replace(/-/g, " ")}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 shrink-0"
        onClick={() => cycleTheme("prev")}
        title="Previous theme"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 shrink-0"
        onClick={() => cycleTheme("next")}
        title="Next theme"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ThemePresetSelect;
