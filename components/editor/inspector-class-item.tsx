"use client";

import React, { memo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { SquarePen } from "lucide-react";
import { FocusColorId, useColorControlFocus } from "@/store/color-control-focus-store";

interface InspectorClassItemProps {
  className: string;
}

const getColorFromClassname = (className: string) => {
  const prefix = className.split("-")[0];
  const color = className.split("/")[0].replace(`${prefix}-`, "");
  return color;
};

const InspectorClassItem = memo(({ className }: InspectorClassItemProps) => {
  const { focusColor } = useColorControlFocus();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const color = getColorFromClassname(className);
      if (color) {
        focusColor(color as FocusColorId);
      }
    },
    [className, focusColor]
  );

  return (
    <div
      className="group hover:bg-muted/50 flex cursor-pointer items-center justify-between gap-2 rounded-md p-1.5 transition-colors"
      onClick={handleClick}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <span
          className={cn(
            className,
            "border-background ring-border inline-block size-3.5 shrink-0 rounded-full border-2 ring-1"
          )}
        />
        <span className="truncate font-mono text-sm">{className}</span>
      </div>
      <SquarePen className="text-muted-foreground size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
});

InspectorClassItem.displayName = "InspectorClassItem";

export default InspectorClassItem;
