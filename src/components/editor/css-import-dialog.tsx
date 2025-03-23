
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface CssImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (css: string) => void;
}

const CssImportDialog: React.FC<CssImportDialogProps> = ({
  open,
  onOpenChange,
  onImport,
}) => {
  const [cssText, setCssText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleImport = () => {
    // Basic validation - check if the CSS contains some expected variables
    if (!cssText.trim()) {
      setError("Please enter CSS content");
      return;
    }

    try {
      // Here you would add more sophisticated CSS parsing validation
      // For now we'll just do a simple check
      if (!cssText.includes("--") || !cssText.includes(":")) {
        setError("Invalid CSS format. CSS should contain variable definitions like --primary: #color");
        return;
      }

      onImport(cssText);
      setCssText("");
      setError(null);
      onOpenChange(false);
    } catch (err) {
      setError("Failed to parse CSS. Please check your syntax.");
    }
  };

  const handleClose = () => {
    setCssText("");
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Import Custom CSS</DialogTitle>
          <DialogDescription>
            Paste your CSS variables below to customize the theme colors.
            Make sure to include variables like --primary, --background, etc.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 py-4">
          <Textarea
            placeholder=":root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* Add more variables */
}"
            className="min-h-[300px] font-mono text-sm"
            value={cssText}
            onChange={(e) => {
              setCssText(e.target.value);
              if (error) setError(null);
            }}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleImport}>Import</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CssImportDialog;
