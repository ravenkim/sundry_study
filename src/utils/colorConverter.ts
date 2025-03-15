import Color from "color"; // You'll need to install this package: npm install color

export const convertToHSL = (colorValue: string): string => {
  try {
    // Use the color library to parse any color format
    const color = Color(colorValue);

    // Convert to HSL and format as "H S% L%" for CSS variables
    const hsl = color.hsl().round().array();
    return `${hsl[0]} ${hsl[1]}% ${hsl[2]}%`;
  } catch (error) {
    console.error(`Failed to convert color: ${colorValue}`, error);
    return colorValue; // Return original if conversion fails
  }
};
