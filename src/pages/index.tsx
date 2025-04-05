import { getEditorConfig } from "@/config/editors";
import Editor from "@/components/editor/editor";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Moon, Sun } from "lucide-react";
import GitHubIcon from "@/assets/github.svg?react";
import { cn } from "../lib/utils";
import { useTheme } from "../components/theme-provider";
import logo from "@/assets/logo.png";
import { useGithubStars } from "@/hooks/use-github-stars";
import BuyMeACoffeeIcon from "@/assets/buymeacoffee.svg?react";

export function meta() {
  const title = "Theme Editor for shadcn/ui — tweakcn";
  return [{ title }];
}

export default function Component() {
  const { theme, toggleTheme } = useTheme();
  const { stargazersCount } = useGithubStars("jnsahaj", "tweakcn");

  return (
    <div
      className={cn(
        "h-screen flex flex-col text-foreground bg-background transition-colors"
      )}
    >
      <header className="border-b">
        <div className="px-2 md:px-4 py-4 flex items-center gap-2 justify-between">
          <div className="flex items-center gap-1">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="tweakcn" className="h-8 w-8" title="tweakcn" />
              <span className="font-bold">tweakcn</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="icon" className="group">
              <a
                href="https://buymeacoffee.com/sahajjain1z"
                target="_blank"
                rel="noopener noreferrer"
                className="group-hover:scale-130 group-hover:rotate-16 transition-all duration-200"
              >
                <BuyMeACoffeeIcon className="size-12" />
              </a>
            </Button>
            <Button variant="secondary" asChild>
              <a
                href="https://github.com/jnsahaj/tweakcn"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold"
              >
                <GitHubIcon className="h-5 w-5" />
                {stargazersCount > 0 && stargazersCount}
              </a>
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={toggleTheme}
              className="group"
            >
              {theme === "light" ? (
                <Sun className="size-6 group-hover:scale-110 group-hover:rotate-16 transition-all duration-200" />
              ) : (
                <Moon className="size-6 group-hover:scale-110 group-hover:-rotate-16 transition-all duration-200" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <Editor config={getEditorConfig("theme")} />
      </main>
    </div>
  );
}
