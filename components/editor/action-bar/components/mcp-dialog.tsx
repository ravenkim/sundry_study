import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";

interface MCPDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mcpConfig = {
  mcpServers: {
    shadcn: {
      command: "npx",
      args: ["-y", "shadcn@canary", "registry:mcp"],
      env: {
        REGISTRY_URL: "https://alpine-registry.vercel.app//r/registry",
      },
    },
  },
};

export function MCPDialog({ open, onOpenChange }: MCPDialogProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(mcpConfig, null, 2));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Setup MCP</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Use the code below to configure the registry MCP in your IDE.
          </p>
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Copy and paste the code into .cursor/mcp.json
            </p>
            <div className="relative">
              <pre className="p-4 rounded-lg bg-muted overflow-x-auto max-w-full">
                <code className="block whitespace-pre-wrap break-all">
                  {JSON.stringify(mcpConfig, null, 2)}
                </code>
              </pre>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={handleCopy}
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
