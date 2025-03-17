import Color from "color"; // You'll need to install this package: npm install color
import { ColorFormat } from "../types";

export const colorFormatter = (
  colorValue: string,
  format: ColorFormat = "hsl",
): string => {
  try {
    // Use the color library to parse any color format
    const color = Color(colorValue);

    if (format === "hsl") {
      const hsl = color.hsl().round().array();
      return `${hsl[0]} ${hsl[1]}% ${hsl[2]}%`;
    }

    if (format === "rgb") {
      const rgb = color.rgb().round().array();
      return `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]})`;
    }

    if (format === "cmyk") {
      const cmyk = color.cmyk().round().array();
      return `cmyk(${cmyk[0]} ${cmyk[1]} ${cmyk[2]} ${cmyk[3]})`;
    }

    if (format === "oklch") {
      const oklch = color.lch().round().array();
      return `oklch(${oklch[0]} ${oklch[1]} ${oklch[2]})`;
    }

    if (format === "hex") {
      return color.hex();
    }
  } catch (error) {
    console.error(`Failed to convert color: ${colorValue}`, error);
    return colorValue; // Return original if conversion fails
  }
};

export const convertToHSL = (colorValue: string): string => {
  return colorFormatter(colorValue, "hsl");
};
