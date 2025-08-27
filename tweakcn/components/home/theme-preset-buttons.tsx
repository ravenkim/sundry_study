"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { getPresetThemeStyles } from "@/utils/theme-preset-helper";
import { cn } from "@/lib/utils";
import { colorFormatter } from "@/utils/color-converter";
import { ThemeEditorState } from "@/types/editor";

// ColorBox component remains internal to ThemePresetButtons
const ColorBox = ({ color }: { color: string }) => {
  return (
    <div
      className="w-3 h-3 rounded-sm border"
      style={{ backgroundColor: color }}
    />
  );
};

interface ThemePresetButtonsProps {
  presetNames: string[];
  mode: "light" | "dark";
  themeState: ThemeEditorState;
  applyThemePreset: (presetName: string) => void;
}

export function ThemePresetButtons({
  presetNames,
  mode,
  themeState,
  applyThemePreset,
}: ThemePresetButtonsProps) {
  // Use the intended slice of presets
  const presetsToShow = presetNames || [];
  const numUniquePresets = presetsToShow.length;

  // Avoid rendering if no presets
  if (numUniquePresets === 0) {
    return null;
  }

  // --- Configuration ---
  const numRows = 3;
  const buttonWidthPx = 160; // Keep consistent with previous style
  const gapPx = 16; // space-x-4 -> 1rem = 16px
  const rowGapPx = 16; // gap-y-4 -> 1rem = 16px
  const duplicationFactor = 4; // Duplicate multiple times for wider screens
  const baseDurationPerItem = 5; // Seconds per item for animation speed
  // ---------------------

  // Distribute presets somewhat evenly across rows
  const presetsByRow: string[][] = Array.from({ length: numRows }, () => []);
  presetsToShow.forEach((preset, index) => {
    presetsByRow[index % numRows].push(preset);
  });

  // Function to create props for a single row
  const createRowProps = (rowIndex: number) => {
    const rowPresets = presetsByRow[rowIndex];
    const numPresetsInRow = rowPresets.length;
    if (numPresetsInRow === 0) return null;

    const duplicatedRowPresets = Array(duplicationFactor)
      .fill(rowPresets)
      .flat();
    const totalWidth = numPresetsInRow * (buttonWidthPx + gapPx);
    const duration = numPresetsInRow * baseDurationPerItem;

    // Alternate direction for the middle row
    // Stagger start slightly for visual effect
    const initialOffset = 0;

    return {
      key: `row-${rowIndex}`,
      presets: duplicatedRowPresets,
      numOriginalPresets: numPresetsInRow,
      animate: { x: [initialOffset, initialOffset - totalWidth] }, // Animate based on original set width, starting from offset
      transition: {
        duration,
        ease: "linear",
        repeat: Infinity,
      },
      style: { x: initialOffset }, // Apply initial offset
    };
  };

  const rowsData = Array.from({ length: numRows }, (_, i) =>
    createRowProps(i)
  ).filter(Boolean);

  return (
    // Container for the rows with vertical gap
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full overflow-hidden mb-8 flex flex-col py-2 -my-2"
      style={{
        gap: `${rowGapPx}px`,
        maskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)", // Added mask for fading edges
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)", // Added for Safari compatibility
      }}
    >
      {rowsData.map((rowData) => (
        <motion.div
          key={rowData!.key}
          className="flex"
          style={rowData!.style} // Apply dynamic styles like initial offset
          animate={rowData!.animate}
          transition={rowData!.transition}
          whileHover={{ animationPlayState: "paused" }} // Pause row on hover
        >
          {/* Inner div necessary for spacing when using justify-content */}
          <div className="flex flex-shrink-0" style={{ gap: `${gapPx}px` }}>
            {rowData!.presets.map((presetName, index) => {
              const themeStyles = getPresetThemeStyles(presetName)[mode];
              const bgColor = colorFormatter(themeStyles.primary, "hsl", "4");
              const isSelected = presetName === themeState.preset;

              return (
                // Wrapper for each button
                <motion.div
                  key={`${presetName}-${rowData!.key}-${index}`} // More unique key
                  className="flex-shrink-0 min-w-[160px]" // Fixed width
                  whileHover={{ scale: 1.02, y: -3, zIndex: 20 }} // Pop on hover
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <Button
                    className={cn(
                      "flex w-full h-full items-center justify-center relative transition-colors duration-200 bg-primary/10",
                      "hover:shadow-lg px-4 py-3",
                      isSelected ? "ring-2 ring-primary/50 shadow-md" : ""
                    )}
                    variant="ghost"
                    style={{
                      backgroundColor: bgColor
                        .replace("hsl", "hsla")
                        .replace(/\s+/g, ", ")
                        .replace(")", ", 0.10)"),
                      color: themeStyles.foreground,
                    }}
                    onClick={() => applyThemePreset(presetName)}
                  >
                    <div className="flex items-center gap-2.5 text-center">
                      <div className="flex gap-1">
                        <ColorBox color={themeStyles.primary} />
                        <ColorBox color={themeStyles.secondary} />
                        <ColorBox color={themeStyles.accent} />
                      </div>
                      <span className="capitalize px-1 leading-tight">
                        {presetName.replace(/-/g, " ")}
                      </span>
                    </div>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
