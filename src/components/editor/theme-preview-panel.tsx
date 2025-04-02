import { ThemeEditorPreviewProps } from "@/types/theme";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import ColorPreview from "./theme-preview/color-preview";
import ComponentsShowcase from "./theme-preview/components-showcase";
import ExamplesPreview from "./theme-preview/examples-preview-container";
import TabsTriggerPill from "./theme-preview/tabs-trigger-pill";
import ExamplesPreviewContainer from "./theme-preview/examples-preview-container";
import { lazy } from "react";

const DemoCards = lazy(() => import("@/components/examples/demo-cards"));
const DemoMail = lazy(() => import("@/components/examples/mail"));
const DemoTasks = lazy(() => import("@/components/examples/tasks"));

const ThemePreviewPanel = ({ styles, currentMode }: ThemeEditorPreviewProps) => {
  if (!styles || !styles[currentMode]) {
    return null;
  }

  return (
    <div className="max-h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Theme Preview</h2>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <Tabs defaultValue="cards" className="flex flex-col overflow-hidden">
          <TabsList className="inline-flex w-fit h-9 items-center justify-center rounded-full bg-background px-0 text-muted-foreground">
            <TabsTriggerPill value="cards">Cards</TabsTriggerPill>
            <div className="hidden md:flex">
              <TabsTriggerPill value="mail">Mail</TabsTriggerPill>
              <TabsTriggerPill value="tasks">Tasks</TabsTriggerPill>
            </div>
            <TabsTriggerPill value="components">Components</TabsTriggerPill>
            <TabsTriggerPill value="colors">Color Palette</TabsTriggerPill>
          </TabsList>

          <ScrollArea className="rounded-lg border mt-2 flex flex-col flex-1">
            <div className="flex flex-col flex-1">
              <TabsContent value="cards" className="space-y-6 mt-0 py-4 px-4 h-full">
                <ExamplesPreviewContainer>
                  <DemoCards />
                </ExamplesPreviewContainer>
              </TabsContent>

              <TabsContent value="mail" className="space-y-6 mt-0 h-full @container">
                <ExamplesPreviewContainer className="min-w-[1300px]">
                  <DemoMail />
                </ExamplesPreviewContainer>
              </TabsContent>

              <TabsContent
                value="tasks"
                className="space-y-6 mt-0 h-full @container"
              >
                <ExamplesPreviewContainer className="min-w-[1300px]">
                  <DemoTasks />
                </ExamplesPreviewContainer>
              </TabsContent>

              <TabsContent value="components" className="p-4 space-y-6 mt-0">
                <ComponentsShowcase styles={styles} currentMode={currentMode} />
              </TabsContent>

              <TabsContent value="colors" className="p-4 space-y-6">
                <ColorPreview styles={styles} currentMode={currentMode} />
              </TabsContent>

              <ScrollBar orientation="horizontal" />
            </div>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
};

export default ThemePreviewPanel;
