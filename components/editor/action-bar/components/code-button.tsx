import { Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CodeButtonProps {
  onCodeClick: () => void;
}

export function CodeButton({ onCodeClick }: CodeButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          variant="secondary"
          size="sm"
          className="h-8 px-2 gap-1.5"
          onClick={onCodeClick}
        >
          <Code className="size-3.5" />
          <span className="text-sm">Code</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>View theme code</TooltipContent>
    </Tooltip>
  );
}
