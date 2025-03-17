import { EditorConfig } from "@/types/editor";
import ThemeControlPanel from "@/components/editor/ThemeControlPanel";
import ThemePreviewPanel from "@/components/editor/ThemePreviewPanel";
import { generateThemeCode } from "@/utils/themeStyleGenerator";
import { defaultThemeState } from "@/config/theme";

export const themeEditorConfig: EditorConfig = {
  type: "theme",
  name: "Theme",
  description: "Customize your global theme colors",
  defaultState: defaultThemeState,
  controls: ThemeControlPanel,
  preview: ThemePreviewPanel,
  codeGenerator: {
    generateComponentCode: generateThemeCode,
  },
};
