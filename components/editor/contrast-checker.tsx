import React from "react";
import { useContrastChecker } from "../../hooks/use-contrast-checker";
import { ThemeStyleProps } from "@/types/theme";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import ColorPicker from "./color-picker";
import { useEditorStore } from "@/store/editor-store";
import { Contrast, Check, AlertTriangle } from "lucide-react";

type ContrastCheckerProps = {
  currentStyles: ThemeStyleProps | Partial<ThemeStyleProps>;
};

const MIN_CONTRAST_RATIO = 4.5;

type ColorPair = {
  id: string;
  foregroundId: keyof ThemeStyleProps;
  backgroundId: keyof ThemeStyleProps;
  foreground: string | undefined;
  background: string | undefined;
  label: string;
};

const ContrastChecker = ({ currentStyles }: ContrastCheckerProps) => {
  const colorPairsToCheck: ColorPair[] = [
    {
      id: "primary",
      foregroundId: "primary-foreground",
      backgroundId: "primary",
      foreground: currentStyles?.["primary-foreground"],
      background: currentStyles?.["primary"],
      label: "Primary",
    },
    {
      id: "secondary",
      foregroundId: "secondary-foreground",
      backgroundId: "secondary",
      foreground: currentStyles?.["secondary-foreground"],
      background: currentStyles?.["secondary"],
      label: "Secondary",
    },
    {
      id: "accent",
      foregroundId: "accent-foreground",
      backgroundId: "accent",
      foreground: currentStyles?.["accent-foreground"],
      background: currentStyles?.["accent"],
      label: "Accent",
    },
    {
      id: "base",
      foregroundId: "foreground",
      backgroundId: "background",
      foreground: currentStyles?.["foreground"],
      background: currentStyles?.["background"],
      label: "Base",
    },
    {
      id: "card",
      foregroundId: "card-foreground",
      backgroundId: "card",
      foreground: currentStyles?.["card-foreground"],
      background: currentStyles?.["card"],
      label: "Card",
    },
    {
      id: "popover",
      foregroundId: "popover-foreground",
      backgroundId: "popover",
      foreground: currentStyles?.["popover-foreground"],
      background: currentStyles?.["popover"],
      label: "Popover",
    },
    {
      id: "muted",
      foregroundId: "muted-foreground",
      backgroundId: "muted",
      foreground: currentStyles?.["muted-foreground"],
      background: currentStyles?.["muted"],
      label: "Muted",
    },
    {
      id: "destructive",
      foregroundId: "destructive-foreground",
      backgroundId: "destructive",
      foreground: currentStyles?.["destructive-foreground"],
      background: currentStyles?.["destructive"],
      label: "Destructive",
    },
    {
      id: "sidebar",
      foregroundId: "sidebar-foreground",
      backgroundId: "sidebar",
      foreground: currentStyles?.["sidebar-foreground"],
      background: currentStyles?.["sidebar"],
      label: "Sidebar Base",
    },
    {
      id: "sidebar-primary",
      foregroundId: "sidebar-primary-foreground",
      backgroundId: "sidebar-primary",
      foreground: currentStyles?.["sidebar-primary-foreground"],
      background: currentStyles?.["sidebar-primary"],
      label: "Sidebar Primary",
    },
    {
      id: "sidebar-accent",
      foregroundId: "sidebar-accent-foreground",
      backgroundId: "sidebar-accent",
      foreground: currentStyles?.["sidebar-accent-foreground"],
      background: currentStyles?.["sidebar-accent"],
      label: "Sidebar Accent",
    },
  ];

  const { updateStyle } = useEditorStore();

  const validColorPairsToCheck = colorPairsToCheck.filter(
    (pair): pair is ColorPair & { foreground: string; background: string } =>
      !!pair.foreground && !!pair.background
  );
  const contrastResults = useContrastChecker(validColorPairsToCheck);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">
              <Contrast />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Check Contrast</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contrast Checker</DialogTitle>
          <DialogDescription>
            Check the contrast ratios of your theme colors to ensure they meet
            accessibility standards. You can also adjust the colors using the
            color pickers below. The recommended minimum contrast ratio is{" "}
            <span className="font-bold">{MIN_CONTRAST_RATIO}</span>.
          </DialogDescription>
          <div className="space-y-4 pt-4">
            {colorPairsToCheck.map((pair) => {
              const result = contrastResults?.find((res) => res.id === pair.id);

              return (
                <div key={pair.id} className="flex flex-col gap-2 w-full">
                  <p className="text-sm text-center font-medium">
                    {pair.label}
                  </p>
                  <div className="flex h-8 w-full gap-2 items-center">
                    <ColorPicker
                      color={pair.background ?? ""}
                      onChange={(color) =>
                        updateStyle(pair.backgroundId, color)
                      }
                      label={pair.label}
                      onlyShowPicker
                    />
                    <div
                      style={{
                        backgroundColor: pair.background ?? "transparent",
                      }}
                      className="h-8 flex-1 rounded border flex items-center justify-center"
                    >
                      {pair.foreground && pair.background && (
                        <p
                          style={{ color: pair.foreground }}
                          className="text-lg"
                        >
                          Aa
                        </p>
                      )}
                      {(!pair.foreground || !pair.background) && (
                        <p className="text-xs text-muted-foreground">N/A</p>
                      )}
                    </div>
                    <ColorPicker
                      color={pair.foreground ?? ""}
                      onChange={(color) =>
                        updateStyle(pair.foregroundId, color)
                      }
                      label={pair.label}
                      onlyShowPicker
                    />
                  </div>
                  <p className="text-end text-sm">
                    {result ? (
                      <>
                        Contrast Ratio: {result.contrastRatio.toFixed(2)}{" "}
                        {result.contrastRatio >= MIN_CONTRAST_RATIO ? (
                          <Check className="inline h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="inline h-4 w-4 text-yellow-600" />
                        )}
                      </>
                    ) : (
                      "N/A"
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ContrastChecker;
