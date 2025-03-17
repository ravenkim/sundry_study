import React from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ResetButtonProps {
  onReset: () => void;
  label?: string;
}

const ResetButton = ({
  onReset,
  label = "Reset to default",
}: ResetButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="link"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground h-6"
          >
            <RotateCcw className="h-1 w-1" /> Reset
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ResetButton;
