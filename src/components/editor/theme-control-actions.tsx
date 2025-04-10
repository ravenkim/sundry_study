import React from "react";
import { FileCode, MoreVertical, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ResetButton from "./reset-button";

interface ThemeControlActionsProps {
  hasChanges: boolean;
  onReset: () => void;
  onImportClick: () => void;
}

const ThemeControlActions = ({
  hasChanges,
  onReset,
  onImportClick,
}: ThemeControlActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onImportClick}>
          <FileCode className="mr-2 h-4 w-4" />
          Import CSS
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onReset}
          disabled={!hasChanges}
          title={hasChanges ? "Reset theme" : "No changes to reset"}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset theme
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeControlActions;
