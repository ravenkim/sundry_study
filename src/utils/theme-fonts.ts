import { ThemeEditorState, ThemeStyleProps } from "../types/theme";

export const fonts = {
  Inter: "Inter, sans-serif",
  Roboto: "Roboto, sans-serif",
  Montserrat: "Montserrat, sans-serif",
  "Open Sans": '"Open Sans", sans-serif',
  Lato: '"Lato", sans-serif',
  Georgia: "Georgia, serif",
  Merriweather: '"Merriweather", serif',
  "Source Code Pro": '"Source Code Pro", monospace',
  "JetBrains Mono": '"JetBrains Mono", monospace',
  "Fira Code": '"Fira Code", monospace',
};

export const getAppliedThemeFont = (
  state: ThemeEditorState,
  fontKey: keyof ThemeStyleProps,
): string | null => {
  const fontSans = state.styles.light[fontKey];
  // find key of font in fonts object based on value
  const key = Object.keys(fonts).find((key) => fonts[key].includes(fontSans));
  return key ? key : null;
};
