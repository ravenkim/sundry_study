"use client";

import { createPortal } from "react-dom";
import React from "react";
import { cn } from "@/lib/utils";

interface InspectorState {
  rect: DOMRect | null;
  className: string;
}

interface InspectorOverlayProps {
  inspector: InspectorState;
  enabled: boolean;
}

const InspectorOverlay = ({ inspector, enabled }: InspectorOverlayProps) => {
  if (!enabled || !inspector.rect || typeof window === "undefined") {
    return null;
  }

  const PADDING = 6; // extra space around the inspected element

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

  return createPortal(
    <>
      {/* Outline around the inspected element */}
      <div
        className={cn(
          "bg-border/50 pointer-events-none fixed z-[10000] cursor-crosshair rounded-lg"
        )}
        style={{
          top: inspector.rect.top - PADDING,
          left: inspector.rect.left - PADDING,
          width: inspector.rect.width + PADDING * 2,
          height: inspector.rect.height + PADDING * 2,
        }}
      />

      {/* Tooltip with the class name */}
      <div
        className={cn(
          "pointer-events-none fixed z-[10001] max-w-[200px] cursor-crosshair overflow-hidden rounded bg-black/75 px-1 py-0.5 text-[12px] text-ellipsis whitespace-nowrap text-white"
        )}
        style={{
          top: inspector.rect.top - PADDING - 24,
          left: inspector.rect.left - PADDING,
        }}
      >
        {inspector.className}
      </div>
    </>,
    document.body
  );
};

export default React.memo(InspectorOverlay);
