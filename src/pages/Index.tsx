import { getEditorConfig } from "@/config/editors";
import Editor from "@/components/editor/Editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import EditorCombobox from "../components/editor/EditorCombobox";
import { Moon, Sun } from "lucide-react";
import { useEditorStore } from "../store/editorStore";
import GitHubIcon from "@/assets/github.svg?react";
import { cn } from "../lib/utils";
import { useLayoutEffect } from "react";

const Index = () => {
  const { editorType = "button" } = useParams();
  const editorConfig = getEditorConfig(editorType);
  const { themeState, setThemeState } = useEditorStore();

  const toggleTheme = () => {
    const newMode = themeState.currentMode === "light" ? "dark" : "light";
    setThemeState({ ...themeState, currentMode: newMode });
  };

  useLayoutEffect(() => {
    if (themeState.currentMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeState.currentMode]);

  return (
    <div className={cn("h-screen flex flex-col text-foreground bg-background transition-colors")}>
      <header className="border-b">
        <div className="px-4 py-4 flex items-center gap-2 justify-between">
          <div className="flex items-center gap-1">
            <EditorCombobox />
            <Button variant="secondary" size="icon" onClick={toggleTheme}>
              {themeState.currentMode === "light" ? (
                <Sun className="h-6 w-6" />
              ) : (
                <Moon className="h-6 w-6" />
              )}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild size="icon">
              <a
                href="https://github.com/jnsahaj/tweakcn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <Editor config={editorConfig} />
      </main>
    </div>
  );
};

export default Index;
