"use client";

import { useState } from "react";
import { useEditorStore } from "@/store/editor-store";
import { parseCssInput } from "@/utils/parse-css-input";
import { toast } from "@/hooks/use-toast";
import { CodePanelDialog } from "@/components/editor/code-panel-dialog";
import CssImportDialog from "@/components/editor/css-import-dialog";
import { ThemeSaveDialog } from "@/components/editor/theme-save-dialog";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth-store";
import { usePostLoginAction } from "@/hooks/use-post-login-action";
import { useThemeActions } from "@/hooks/use-theme-actions";
import { ActionBarButtons } from "@/components/editor/action-bar/components/action-bar-buttons";
import { usePostHog } from "posthog-js/react";
import { AIGenerateDialog } from "@/components/editor/action-bar/components/ai-generate-dialog";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";

export function ActionBar() {
  const { themeState, setThemeState, applyThemePreset } = useEditorStore();
  const [cssImportOpen, setCssImportOpen] = useState(false);
  const [codePanelOpen, setCodePanelOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [aiGenerateOpen, setAiGenerateOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);
  const { data: session } = authClient.useSession();
  const { openAuthDialog } = useAuthStore();
  const { createTheme, isCreatingTheme } = useThemeActions();
  const posthog = usePostHog();
  const { generateTheme, loading: aiGenerateLoading } = useAIThemeGeneration({
    onSuccess: () => {
      setAiGenerateOpen(false);
      setDialogKey((prev) => prev + 1);
    },
  });

  usePostLoginAction("SAVE_THEME", () => {
    setSaveDialogOpen(true);
  });

  usePostLoginAction("AI_GENERATE", () => {
    setAiGenerateOpen(true);
  });

  const handleGenerateTheme = async (
    promptText: string,
    jsonPromptText: string
  ) => {
    if (!promptText.trim()) return;
    await generateTheme(promptText, jsonPromptText);
  };

  const handleAiGenerateClick = () => {
    if (!session) {
      openAuthDialog("signin", "AI_GENERATE");
      return;
    }

    setAiGenerateOpen(true);
  };

  const handleCssImport = (css: string) => {
    const { lightColors, darkColors } = parseCssInput(css);
    const styles = {
      ...themeState.styles,
      light: { ...themeState.styles.light, ...lightColors },
      dark: { ...themeState.styles.dark, ...darkColors },
    };

    setThemeState({
      ...themeState,
      styles,
    });

    toast({
      title: "CSS imported",
      description: "Your custom CSS has been imported successfully",
    });
  };

  const handleSaveClick = () => {
    if (!session) {
      openAuthDialog("signin", "SAVE_THEME");
      return;
    }

    setSaveDialogOpen(true);
  };

  const saveTheme = async (themeName: string) => {
    const themeData = {
      name: themeName,
      styles: themeState.styles,
    };

    try {
      const theme = await createTheme(themeData);
      posthog.capture("CREATE_THEME", {
        theme_id: theme?.id,
        theme_name: theme?.name,
      });
      applyThemePreset(theme?.id || themeState.preset || "default");
      setTimeout(() => {
        if (!theme) return;
        setSaveDialogOpen(false);
      }, 50);
    } catch (error) {
      console.error(
        "Save operation failed (error likely handled by hook):",
        error
      );
    }
  };

  return (
    <div className="border-b">
      <div className="flex h-14 items-center justify-end gap-4 px-4">
        <ActionBarButtons
          onImportClick={() => setCssImportOpen(true)}
          onCodeClick={() => setCodePanelOpen(true)}
          onSaveClick={handleSaveClick}
          onAiGenerateClick={handleAiGenerateClick}
          isSaving={isCreatingTheme}
        />
      </div>

      <CssImportDialog
        open={cssImportOpen}
        onOpenChange={setCssImportOpen}
        onImport={handleCssImport}
      />
      <CodePanelDialog
        open={codePanelOpen}
        onOpenChange={setCodePanelOpen}
        themeEditorState={themeState}
      />
      <ThemeSaveDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        onSave={saveTheme}
        isSaving={isCreatingTheme}
      />
      <AIGenerateDialog
        key={dialogKey}
        open={aiGenerateOpen}
        onOpenChange={setAiGenerateOpen}
        loading={aiGenerateLoading}
        onGenerate={handleGenerateTheme}
      />
    </div>
  );
}
