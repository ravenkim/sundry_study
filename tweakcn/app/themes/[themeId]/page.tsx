import { getTheme } from "@/actions/themes";
import ThemeView from "@/components/theme-view";
import { Metadata } from "next";

interface ThemePageProps {
  params: Promise<{
    themeId: string;
  }>;
}

export async function generateMetadata({ params }: ThemePageProps): Promise<Metadata> {
  const { themeId } = await params;
  const theme = await getTheme(themeId);

  return {
    title: theme?.name + " - tweakcn",
    description: `Discover shadcn/ui themes - ${theme?.name} theme`,
    openGraph: {
      title: `${theme?.name} - tweakcn`,
      description: `Discover shadcn/ui themes - ${theme?.name} theme`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${theme?.name} - tweakcn`,
      description: `Discover shadcn/ui themes - ${theme?.name} theme`,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function ThemePage({ params }: ThemePageProps) {
  const { themeId } = await params;
  const theme = await getTheme(themeId);

  return (
    <div className="flex flex-1 flex-col">
      <div className="container mx-auto px-4 py-8">
        <ThemeView theme={theme} />
      </div>
    </div>
  );
}
