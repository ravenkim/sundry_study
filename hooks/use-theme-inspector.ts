"use client";

import { useState, useRef, useMemo, MouseEvent } from "react";
import { defaultLightThemeStyles } from "@/config/theme";

interface InspectorState {
  rect: DOMRect | null;
  className: string;
}

export const useThemeInspector = () => {
  const [inspector, setInspector] = useState<InspectorState>({
    rect: null,
    className: "",
  });
  const [inspectorEnabled, setInspectorEnabled] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  // Keep track of the last element that matched the theme class tokens.
  const lastElementRef = useRef<HTMLElement | null>(null);

  const classRegex = useMemo(() => {
    const excludePrefixes = ["font-", "shadow-", "letter-spacing", "spacing", "radius"];

    const tokens = Object.keys(defaultLightThemeStyles).filter((token) => {
      return !excludePrefixes.some((prefix) => token.startsWith(prefix));
    });

    // Sort tokens by length in descending order to ensure longer tokens like "muted-foreground"
    // are matched before shorter ones like "muted"
    const sortedTokens = tokens.sort((a, b) => b.length - a.length);
    const escapedTokens = sortedTokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

    // Updated pattern to properly match compound tokens like "muted-foreground"
    // The (?:\\/\\d{1,3})? part handles opacity modifiers like /50
    const pattern = `\\b(?:bg|text|border|ring|fill|stroke)-(?:${escapedTokens.join(
      "|"
    )})(?:\\/\\d{1,3})?\\b`;

    return new RegExp(pattern, "g");
  }, []);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    if (!target || !rootRef.current) return;

    // Ensure the hovered element is within the preview root but not the root itself
    if (!rootRef.current.contains(target) || target === rootRef.current) return;

    if (!inspectorEnabled) return;

    // Helper to extract the class list (handles SVG <=> HTML elements)
    const getClassString = (el: Element): string => {
      const cnProp: any = (el as any).className;
      if (typeof cnProp === "string") return cnProp;
      if (cnProp && typeof cnProp === "object" && "baseVal" in cnProp) {
        return cnProp.baseVal as string;
      }
      return "";
    };

    // Walk up from the target element until we find an ancestor with theme classes or reach the preview root
    let current: HTMLElement | null = target;
    while (current && current !== rootRef.current) {
      const cls = getClassString(current);
      // Extract theme-related classes and ensure we don't accumulate duplicates across
      // subsequent re-renders by de-duplicating them right away.
      const matches = Array.from(new Set(Array.from(cls.matchAll(classRegex)).map((m) => m[0])));

      if (matches.length > 0) {
        // Avoid state updates if we're still over the same element.
        if (lastElementRef.current === current) {
          return;
        }

        lastElementRef.current = current;

        const rect = current.getBoundingClientRect();

        setInspector((prev) => {
          const sameRect =
            prev.rect &&
            prev.rect.top === rect.top &&
            prev.rect.left === rect.left &&
            prev.rect.width === rect.width &&
            prev.rect.height === rect.height;

          const newClassName = matches.join(" ");

          if (sameRect && prev.className === newClassName) {
            return prev; // No changes -> skip re-render
          }

          return { rect, className: newClassName };
        });

        return;
      }

      current = current.parentElement as HTMLElement | null;
    }

    // No eligible ancestor found → clear overlay (only if something is shown)
    if (lastElementRef.current) {
      lastElementRef.current = null;
      setInspector({ rect: null, className: "" });
    }
  };

  // When the pointer leaves the preview root we **don't** immediately clear the
  // overlay. Doing so would hide the tooltip as soon as the user moves their
  // cursor from the inspected element to the tooltip content (which is
  // rendered outside of the preview root via a portal). Instead, we keep the
  // last inspected element highlighted. The overlay will be updated as soon as
  // the user moves back over another element inside the preview area or when
  // the inspector gets disabled.
  const handleMouseLeave = () => {
    // Intentionally left blank to keep the current overlay visible.
    // We still reset the lastElementRef so that the next valid hover inside
    // the preview root updates correctly.
    lastElementRef.current = null;
  };

  const toggleInspector = () => {
    setInspectorEnabled((prev) => !prev);
    // Clear overlay when disabling
    if (inspectorEnabled) {
      lastElementRef.current = null;
      setInspector({ rect: null, className: "" });
    }
  };

  return {
    rootRef,
    inspector,
    inspectorEnabled,
    toggleInspector,
    handleMouseMove,
    handleMouseLeave,
  } as const;
};
