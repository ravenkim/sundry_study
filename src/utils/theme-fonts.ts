import { ThemeEditorState, ThemeStyleProps } from "../types/theme";

export const fonts = {
  Inter: "Inter, sans-serif",
  Roboto: "Roboto, sans-serif",
  Monospace: "Monospace, monospace",
  Poppins: '"Poppins", sans-serif',
  Lato: '"Lato", sans-serif',
  "Open Sans": '"Open Sans", sans-serif',
  "Source Sans Pro": '"Source Sans Pro", sans-serif',
  "Ubuntu Mono": "Ubuntu Mono, monospace",
  "Fira Code": "Fira Code, monospace",
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
