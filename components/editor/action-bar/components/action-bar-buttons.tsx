import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "./theme-toggle";
import { ImportButton } from "./import-button";
import { ResetButton } from "./reset-button";
import { SaveButton } from "./save-button";
import { CodeButton } from "./code-button";
import ContrastChecker from "@/components/editor/contrast-checker";
import { useEditorStore } from "@/store/editor-store";

interface ActionBarButtonsProps {
  onImportClick: () => void;
  onCodeClick: () => void;
  onSaveClick: () => void;
  isSaving: boolean;
}

export function ActionBarButtons({
  onImportClick,
  onCodeClick,
  onSaveClick,
  isSaving,
}: ActionBarButtonsProps) {
  const { themeState, restoreThemeCheckpoint, hasThemeChangedFromCheckpoint } =
    useEditorStore();

  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <Separator orientation="vertical" className="h-8" />
      <ContrastChecker
        currentStyles={themeState.styles[themeState.currentMode]}
      />
      <ImportButton onImportClick={onImportClick} />
      <ResetButton
        onReset={restoreThemeCheckpoint}
        isDisabled={!hasThemeChangedFromCheckpoint()}
      />
      <Separator orientation="vertical" className="h-8" />
      <SaveButton onSaveClick={onSaveClick} isSaving={isSaving} />
      <CodeButton onCodeClick={onCodeClick} />
    </div>
  );
}
