"use client";

import { Badge } from "@/components/ui/badge";
import { useEditorStore } from "@/store/editor-store";
import { motion } from "motion/react";
import { defaultPresets } from "@/utils/theme-presets";
import { DemoContainer } from "@/components/examples/demo-cards";
import { DemoGithub } from "@/components/examples/cards/github-card";
import { DemoStats } from "@/components/examples/cards/stats";
import { lazy, Suspense } from "react";
import { Loading } from "../loading";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemePresetButtons } from "@/components/home/theme-preset-buttons";

const DemoMail = lazy(() => import("@/components/examples/mail"));

export function ThemePresetSelector() {
  const { themeState, applyThemePreset } = useEditorStore();
  const mode = themeState.currentMode;
  const presetNames = Object.keys(defaultPresets);
  const isMobile = useIsMobile();

  return (
    <section id="examples" className="w-full py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Badge
              className="rounded-full px-4 py-1.5 text-sm font-medium shadow-sm"
              variant="secondary"
            >
              <span className="mr-1 text-primary">✦</span> Theme Presets
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            Elevate Your Design Instantly
          </h2>
          <p className="max-w-[800px] text-muted-foreground md:text-lg">
            Apply theme presets with a single click. See how each option
            enhances the look.
          </p>
        </motion.div>

        {/* Theme Selector Buttons */}
        <ThemePresetButtons
          presetNames={presetNames}
          mode={mode}
          themeState={themeState}
          applyThemePreset={applyThemePreset}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="@container relative overflow-hidden border rounded-lg max-h-[60vh] md:max-h-[70vh] shadow-lg bg-gradient-to-b from-card/50 to-card/30 backdrop-blur-sm"
        >
          <div
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0), var(--background))",
            }}
          />
          <Suspense fallback={<Loading />}>
            {!isMobile ? (
              <DemoMail />
            ) : (
              <div className="p-4 flex flex-col gap-4">
                <DemoContainer>
                  <DemoStats />
                </DemoContainer>
                <DemoContainer>
                  <DemoGithub />
                </DemoContainer>
              </div>
            )}
          </Suspense>
        </motion.div>
      </div>
    </section>
  );
}
