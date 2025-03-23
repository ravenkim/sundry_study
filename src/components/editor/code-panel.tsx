
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download } from "lucide-react";
import { EditorConfig } from "@/types/editor";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { ThemeStyles } from "../../types/theme";
import { ColorFormat } from "../../types";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/select";
import { ButtonStyles } from "@/types/button";
import { usePostHog } from "posthog-js/react";
import { useEditorStore } from "@/store/editor-store";

interface CodePanelProps {
  config: EditorConfig;
  styles: ThemeStyles | ButtonStyles;
}

const CodePanel: React.FC<CodePanelProps> = ({ config, styles }) => {
  const { type: editorType } = config;
  const [colorFormat, setColorFormat] = useState<ColorFormat>("oklch");
  const [tailwindVersion, setTailwindVersion] = useState<"3" | "4">("4");
  const code = config.codeGenerator.generateComponentCode(
    styles,
    colorFormat,
    tailwindVersion
  );
  const [copied, setCopied] = useState(false);
  const posthog = usePostHog();
  const preset = useEditorStore((state) => state.themeState.preset);

  const captureCopyEvent = () => {
    posthog.capture("COPY_CODE", {
      editorType,
      preset,
      colorFormat,
      tailwindVersion,
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      captureCopyEvent();
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const downloadFile = () => {
    const fileName = getFileName();
    const blob = new Blob([code], { type: "text/plain" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    
    posthog.capture("DOWNLOAD_CODE", {
      editorType,
      preset,
      colorFormat,
      tailwindVersion,
    });
  };

  const getFileName = () => {
    switch (editorType) {
      case "button":
        return "button.tsx";
      case "theme":
        return "index.css";
      default:
        return "index.tsx";
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex-none px-2 mb-4">
        <h2 className="text-lg font-semibold">Code</h2>
      </div>
      {editorType === "theme" && (
        <div className="flex items-center gap-2 mb-4 ">
          <Select
            value={tailwindVersion}
            onValueChange={(value: "3" | "4") => {
              setTailwindVersion(value);
              setColorFormat(value === "4" ? "oklch" : "hsl");
            }}
          >
            <SelectTrigger className="w-fit focus:ring-transparent focus:border-none bg-muted/50 outline-hidden border-none gap-1">
              <SelectValue className="focus:ring-transparent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">Tailwind v3</SelectItem>
              <SelectItem value="4">Tailwind v4</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={colorFormat}
            onValueChange={(value: ColorFormat) => setColorFormat(value)}
          >
            <SelectTrigger className="w-fit focus:ring-transparent focus:border-none bg-muted/50 outline-hidden border-none gap-1">
              <SelectValue className="focus:ring-transparent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hsl">hsl</SelectItem>
              <SelectItem value="oklch">oklch</SelectItem>
              <SelectItem value="rgb">rgb</SelectItem>
              <SelectItem value="hex">hex</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex-1 min-h-0 flex flex-col rounded-lg border overflow-hidden">
        <div className="flex-none flex justify-between items-center px-4 py-2 border-b bg-muted/50">
          <span className="text-sm font-medium">{getFileName()}</span>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(code)}
              className="h-8 px-2"
              aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  <span className="sr-only md:not-sr-only">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  <span className="sr-only md:not-sr-only">Copy</span>
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadFile}
              className="h-8 px-2"
              aria-label="Download file"
            >
              <Download className="h-4 w-4 mr-2" />
              <span className="sr-only md:not-sr-only">Download</span>
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 relative">
          <pre className="h-full p-4 text-sm">
            <code>{code}</code>
          </pre>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default CodePanel;
