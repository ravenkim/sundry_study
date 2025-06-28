"use client";

import { createPortal } from "react-dom";
import React from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useClassNames } from "@/hooks/use-theme-inspector-classnames";
import InspectorClassItem from "./inspector-class-item";

interface InspectorState {
  rect: DOMRect | null;
  className: string;
}

interface InspectorOverlayProps {
  inspector: InspectorState;
  enabled: boolean;
}

const InspectorOverlay = ({ inspector, enabled }: InspectorOverlayProps) => {
  const PADDING = 0;
  const classNames = useClassNames(inspector.className);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    if (enabled) {
      const previousCursor = document.body.style.cursor;
      document.body.style.cursor = "crosshair";

      return () => {
        document.body.style.cursor = previousCursor;
      };
    }
  }, [enabled]);

  if (!enabled || !inspector.rect || typeof window === "undefined") {
    return null;
  }

  return createPortal(
    <TooltipProvider delayDuration={400}>
      <Tooltip open={enabled && !!inspector.rect} defaultOpen={false}>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "ring-primary pointer-events-none fixed z-[10000] cursor-crosshair rounded-sm ring-2"
            )}
            style={{
              top: inspector.rect.top - PADDING,
              left: inspector.rect.left - PADDING,
              width: inspector.rect.width + PADDING * 2,
              height: inspector.rect.height + PADDING * 2,
            }}
          />
        </TooltipTrigger>

        <TooltipContent
          side="top"
          align="start"
          className={cn(
            "bg-popover/80 text-popover-foreground pointer-events-auto w-auto max-w-[320px] space-y-2 rounded-lg border p-2 shadow-xl backdrop-blur-md"
          )}
          sideOffset={8}
        >
          <p className="text-muted-foreground px-1 font-mono text-xs font-semibold tracking-wider uppercase">
            Inspector
          </p>
          <div className="flex flex-col gap-1">
            {classNames.map((cls) => (
              <InspectorClassItem key={cls} className={cls} />
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>,
    document.body
  );
};

const arePropsEqual = (
  prevProps: InspectorOverlayProps,
  nextProps: InspectorOverlayProps
): boolean => {
  if (prevProps.enabled !== nextProps.enabled) return false;

  const prevRect = prevProps.inspector.rect;
  const nextRect = nextProps.inspector.rect;

  if (!prevRect && !nextRect)
    return prevProps.inspector.className === nextProps.inspector.className;
  if (!prevRect || !nextRect) return false;

  return (
    prevRect.top === nextRect.top &&
    prevRect.left === nextRect.left &&
    prevRect.width === nextRect.width &&
    prevRect.height === nextRect.height &&
    prevProps.inspector.className === nextProps.inspector.className
  );
};

export default React.memo(InspectorOverlay, arePropsEqual);
