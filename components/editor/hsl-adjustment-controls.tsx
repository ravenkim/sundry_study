"use client";

import React, { useCallback, useMemo, useRef, useEffect } from "react";
import { SliderWithInput } from "./slider-with-input";
import { useEditorStore } from "../../store/editor-store";
import { COMMON_STYLES, defaultThemeState } from "../../config/theme";
import { ThemeEditorState } from "@/types/editor";
import { converter, formatHex, Hsl } from "culori";
import { debounce } from "@/utils/debounce";
import { isDeepEqual } from "@/lib/utils";

// Adjusts a color by modifying HSL values
function adjustColorByHsl(
  color: string,
  hueShift: number,
  saturationScale: number,
  lightnessScale: number
): string {
  const hsl = converter("hsl")(color);
  const h = hsl?.h;
  const s = hsl?.s;
  const l = hsl?.l;

  if (h === undefined || s === undefined || l === undefined) {
    return color;
  }

  const adjustedHsl = {
    h: (((h + hueShift) % 360) + 360) % 360,
    s: Math.min(1, Math.max(0, s * saturationScale)),
    l: Math.min(1, Math.max(0.1, l * lightnessScale)),
  };

  const out = converter("hsl")(adjustedHsl as Hsl);
  return formatHex(out);
}

const HslAdjustmentControls = () => {
  const { themeState, setThemeState, saveThemeCheckpoint, themeCheckpoint } = useEditorStore();
  const debouncedUpdateRef = useRef<ReturnType<typeof debounce> | null>(null);

  // Get current HSL adjustments with fallback to defaults
  const currentHslAdjustments = useMemo(
    () => themeState.hslAdjustments ?? defaultThemeState.hslAdjustments!,
    [themeState.hslAdjustments]
  );

  // Save checkpoint if HSL adjustments are at default values
  useEffect(() => {
    if (isDeepEqual(themeState.hslAdjustments, defaultThemeState.hslAdjustments)) {
      saveThemeCheckpoint();
    }
  }, [themeState.hslAdjustments, saveThemeCheckpoint]);

  // Setup debounced update function
  useEffect(() => {
    debouncedUpdateRef.current = debounce((hslAdjustments: ThemeEditorState["hslAdjustments"]) => {
      const {
        hueShift = defaultThemeState.hslAdjustments!.hueShift,
        saturationScale = defaultThemeState.hslAdjustments!.saturationScale,
        lightnessScale = defaultThemeState.hslAdjustments!.lightnessScale,
      } = hslAdjustments ?? {};

      const adjustments = { hueShift, saturationScale, lightnessScale };
      const state = themeCheckpoint ?? themeState;
      const { light: lightStyles, dark: darkStyles } = state.styles;

      const updatedLightStyles = Object.keys(lightStyles)
        .filter((key) => !COMMON_STYLES.includes(key))
        .reduce<Record<string, string>>((acc, key) => {
          const colorKey = key as keyof typeof lightStyles;
          return {
            ...acc,
            [key]: adjustColorByHsl(
              lightStyles[colorKey],
              adjustments.hueShift,
              adjustments.saturationScale,
              adjustments.lightnessScale
            ),
          };
        }, {});

      const updatedDarkStyles = Object.keys(darkStyles)
        .filter((key) => !COMMON_STYLES.includes(key))
        .reduce<Record<string, string>>((acc, key) => {
          const colorKey = key as keyof typeof darkStyles;
          return {
            ...acc,
            [key]: adjustColorByHsl(
              darkStyles[colorKey],
              adjustments.hueShift,
              adjustments.saturationScale,
              adjustments.lightnessScale
            ),
          };
        }, {});

      // Update theme state with all changes
      setThemeState({
        ...state,
        hslAdjustments,
        styles: {
          light: { ...lightStyles, ...updatedLightStyles },
          dark: { ...darkStyles, ...updatedDarkStyles },
        },
      });
    }, 10);

    return () => debouncedUpdateRef.current?.cancel();
  }, [themeState, setThemeState, themeCheckpoint]);

  // Handle HSL value changes
  const handleHslChange = useCallback(
    (property: keyof typeof currentHslAdjustments, value: number) => {
      if (debouncedUpdateRef.current) {
        debouncedUpdateRef.current({
          ...currentHslAdjustments,
          [property]: value,
        });
      }
    },
    [currentHslAdjustments]
  );

  return (
    <>
      <SliderWithInput
        value={currentHslAdjustments.hueShift}
        onChange={(value) => handleHslChange("hueShift", value)}
        unit="deg"
        min={-180}
        max={180}
        step={1}
        label="Hue Shift"
      />
      <SliderWithInput
        value={currentHslAdjustments.saturationScale}
        onChange={(value) => handleHslChange("saturationScale", value)}
        unit="x"
        min={0}
        max={2}
        step={0.01}
        label="Saturation Multiplier"
      />
      <SliderWithInput
        value={currentHslAdjustments.lightnessScale}
        onChange={(value) => handleHslChange("lightnessScale", value)}
        unit="x"
        min={0.2}
        max={2}
        step={0.01}
        label="Lightness Multiplier"
      />
    </>
  );
};

export default HslAdjustmentControls;
