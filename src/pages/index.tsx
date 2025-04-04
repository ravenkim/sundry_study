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
  const siteName = "tweakcn";
  const siteUrl = "https://tweakcn.com/";
  const ogImage = "https://tweakcn.com/og-image.png";
  const shortTitle = "Theme Editor for shadcn/ui — tweakcn";
  const longTitle =
    "Beautiful themes for shadcn/ui — tweakcn | Theme Editor & Generator";
  const shortDescription =
    "Customize theme for shadcn/ui with tweakcn's interactive editor. Supports Tailwind CSS v4, Shadcn UI, and custom styles. Modify properties, preview changes, and get the code in real time.";
  const longDescription =
    "tweakcn is a powerful theme editor for shadcn/ui components, offering beautifully designed themes and seamless Tailwind CSS integration. Create, customize, and export themes instantly.";

  return [
    { title: shortTitle },
    { name: "description", content: shortDescription },
    {
      name: "keywords",
      content:
        "theme editor, theme generator, shadcn, ui, components, react, tailwind, button, editor, visual editor, component editor, web development, frontend, design system, UI components, React components, Tailwind CSS, shadcn/ui themes",
    },
    { name: "author", content: "Sahaj Jain" },
    { name: "image", content: ogImage },
    { name: "url", content: siteUrl },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:url", content: siteUrl },
    { name: "twitter:title", content: longTitle },
    { name: "twitter:description", content: longDescription },
    { name: "twitter:image", content: ogImage },
    { name: "robots", content: "index, follow" },
    { name: "language", content: "English" },
    { name: "revisit-after", content: "7 days" },
    { name: "generator", content: "Vite" },
    { name: "charset", content: "UTF-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: siteUrl },
    { property: "og:title", content: longTitle },
    { property: "og:description", content: longDescription },
    { property: "og:image", content: ogImage },
    { property: "og:site_name", content: siteName },
  ];
}

export function links() {
  return [
    {
      rel: "canonical",
      href: "https://tweakcn.com/",
    },
    {
      rel: "apple-touch-icon",
      href: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
    },
    {
      rel: "manifest",
      href: "/site.webmanifest",
    },
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Fira+Code:wght@300..700&family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400..700;1,400..700&family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Outfit:wght@100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100..900;1,100..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&family=Space+Grotesk:wght@300..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap",
    },
  ];
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
