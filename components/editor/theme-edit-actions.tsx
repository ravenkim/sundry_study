import { Button } from "../ui/button";
import { X, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import { useThemeActions } from "@/hooks/use-theme-actions";
import { useEditorStore } from "@/store/editor-store";
import { Theme } from "@/types/theme";
import { ThemeSaveDialog } from "./theme-save-dialog";
import { useState } from "react";

interface ThemeEditActionsProps {
  theme: Theme;
}

const ThemeEditActions: React.FC<ThemeEditActionsProps> = ({ theme }) => {
  const router = useRouter();
  const { updateTheme } = useThemeActions();
  const { themeState } = useEditorStore();
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleThemeEditCancel = () => {
    router.push("/editor/theme");
  };

  const handleSaveTheme = async (newName: string) => {
    setIsSaving(true);
    const dataToUpdate: {
      id: string;
      name?: string;
      styles?: Theme["styles"];
    } = {
      id: theme.id,
    };

    if (newName !== theme.name) {
      dataToUpdate.name = newName;
    } else {
      dataToUpdate.name = theme.name;
    }

    if (themeState.styles) {
      dataToUpdate.styles = themeState.styles;
    }

    if (!dataToUpdate.name && !dataToUpdate.styles) {
      console.log("No changes detected.");
      setIsNameDialogOpen(false);
      setIsSaving(false);
      return;
    }

    const result = await updateTheme(dataToUpdate);
    setIsSaving(false);

    if (result) {
      setIsNameDialogOpen(false);
      router.push("/editor/theme");
    } else {
      console.error("Failed to update theme");
    }
  };

  const handleThemeEditSave = () => {
    setIsNameDialogOpen(true);
  };

  return (
    <>
      <div className="flex items-center">
        <div className="flex flex-1 items-center gap-2 bg-muted/10 min-h-14 px-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">
              Editing
            </span>
          </div>
          <span className="text-sm font-semibold px-2 truncate max-w-56">
            {theme.name}
          </span>
        </div>

        <Separator orientation="vertical" className="h-8" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-14 shrink-0 rounded-none bg-muted/10"
                onClick={handleThemeEditCancel}
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Cancel changes</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="h-8" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-14 shrink-0 rounded-none bg-muted/10"
                onClick={handleThemeEditSave}
              >
                <Check className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save changes</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <ThemeSaveDialog
        open={isNameDialogOpen}
        onOpenChange={setIsNameDialogOpen}
        onSave={handleSaveTheme}
        isSaving={isSaving}
        initialThemeName={theme.name}
        title="Save Theme Changes"
        description="Confirm or update the theme name before saving."
        ctaLabel="Save Changes"
      />
    </>
  );
};

export default ThemeEditActions;
