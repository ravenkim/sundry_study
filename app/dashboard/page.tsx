import { Theme } from "@/types/theme";
import { getThemes } from "@/actions/themes";
import { ThemeCard } from "./components/theme-card";
import { Header } from "@/components/editor/header";
import { Palette } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
  const themes = await getThemes();
  const sortedThemes = themes.sort((a, b) => {
    return b.createdAt?.getTime() - a.createdAt?.getTime();
  });

  return (
    <>
      <Header />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Your Themes</h1>
        {sortedThemes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl mb-4">
              <Palette className="size-12" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No themes yet</h2>
            <p className="text-gray-500 mb-4">
              Create your first theme to get started
            </p>
            <Link href="/editor/theme">
              <Button>Create Theme</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedThemes.map((theme: Theme) => (
              <ThemeCard key={theme.id} theme={theme} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
