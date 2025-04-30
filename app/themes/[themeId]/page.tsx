import { Suspense } from "react";
import { getTheme } from "@/actions/themes";
import ThemeView from "@/components/theme-view";
import { Metadata } from "next";
import { Header } from "@/components/editor/header";
import { Loading } from "@/components/loading";
interface ThemePageProps {
  params: Promise<{
    themeId: string;
  }>;
}

export async function generateMetadata({
  params,
}: ThemePageProps): Promise<Metadata> {
  const { themeId } = await params;
  const theme = await getTheme(themeId);

  return {
    title: theme?.name + " - tweakcn",
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
    <Suspense
      fallback={
        <>
          <Header />
          <Loading />
        </>
      }
    >
      <ThemeView theme={theme} />
    </Suspense>
  );
}
