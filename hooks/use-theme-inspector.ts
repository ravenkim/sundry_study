"use client";

import { useState, useRef, useCallback, MouseEvent, useEffect } from "react";
import { THEME_CLASS_REGEX } from "./use-theme-inspector-regex";
import { debounce } from "../utils/debounce";

interface InspectorState {
  rect: DOMRect | null;
  className: string;
}

/**
 * Optimized theme inspector hook with the following performance improvements:
 *
 * 1. Scroll Performance:
 *    - Uses a ref to track overlay visibility state to avoid unnecessary re-renders
 *    - Caches the scrollable viewport element to avoid repeated DOM queries
 *    - Implements efficient scroll event handling that only triggers when needed
 *
 * 2. Memory Optimization:
 *    - Prevents redundant state updates when overlay is already hidden/shown
 *    - Uses refs for state that doesn't need to trigger re-renders
 *    - Properly cancels debounced functions to prevent memory leaks
 *
 * 3. DOM Optimization:
 *    - Finds and caches the Radix UI ScrollArea viewport element once
 *    - Uses passive scroll listeners for better scroll performance
 *    - Separates viewport discovery from scroll event management
 */

export const useThemeInspector = () => {
  const [inspector, setInspector] = useState<InspectorState>({
    rect: null,
    className: "",
  });
  const [inspectorEnabled, setInspectorEnabled] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const lastElementRef = useRef<HTMLElement | null>(null);
  // Performance: Track overlay state without triggering re-renders
  const isOverlayHiddenRef = useRef<boolean>(false);
  // Performance: Cache the scrollable element to avoid repeated DOM queries
  const scrollableElementRef = useRef<Element | null>(null);

  const getClassString = useCallback((el: Element): string => {
    const cnProp: any = (el as any).className;
    if (typeof cnProp === "string") return cnProp;
    if (cnProp && typeof cnProp === "object" && "baseVal" in cnProp) {
      return cnProp.baseVal as string;
    }
    return "";
  }, []);

  const updateInspectorState = useCallback((rect: DOMRect, matches: string[]) => {
    setInspector((prev) => {
      const sameRect =
        prev.rect &&
        prev.rect.top === rect.top &&
        prev.rect.left === rect.left &&
        prev.rect.width === rect.width &&
        prev.rect.height === rect.height;

      const newClassName = matches.join(" ");

      if (sameRect && prev.className === newClassName) {
        return prev;
      }

      // Mark overlay as visible when updating with new data
      isOverlayHiddenRef.current = false;
      return { rect, className: newClassName };
    });
  }, []);

  const clearInspectorState = useCallback(() => {
    if (lastElementRef.current || !isOverlayHiddenRef.current) {
      lastElementRef.current = null;
      isOverlayHiddenRef.current = true;
      setInspector({ rect: null, className: "" });
    }
  }, []);

  // Create debounced version of the inspector logic
  const debouncedInspectorUpdate = useCallback(
    debounce((target: HTMLElement) => {
      if (!rootRef.current) return;

      if (!rootRef.current.contains(target) || target === rootRef.current) return;

      let current: HTMLElement | null = target;
      while (current && current !== rootRef.current) {
        const cls = getClassString(current);
        const classNames = cls.split(/\s+/).filter(Boolean);
        const matches = Array.from(
          new Set(classNames.filter((className) => THEME_CLASS_REGEX.test(className)))
        );

        if (matches.length > 0) {
          if (lastElementRef.current === current) {
            return;
          }

          lastElementRef.current = current;
          const rect = current.getBoundingClientRect();
          updateInspectorState(rect, matches);
          return;
        }

        current = current.parentElement as HTMLElement | null;
      }

      clearInspectorState();
    }, 20),
    [getClassString, updateInspectorState, clearInspectorState]
  );

  // Performance: Optimized scroll handler with early exit conditions
  const hideOverlayOnScroll = useCallback(() => {
    if (!inspectorEnabled || isOverlayHiddenRef.current) return;

    clearInspectorState();
    debouncedInspectorUpdate.cancel();
  }, [inspectorEnabled, clearInspectorState, debouncedInspectorUpdate]);

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement | null;
      if (!target || !inspectorEnabled) return;

      debouncedInspectorUpdate(target);
    },
    [inspectorEnabled, debouncedInspectorUpdate]
  );

  const handleMouseLeave = useCallback(() => {
    lastElementRef.current = null;
    debouncedInspectorUpdate.cancel();
  }, [debouncedInspectorUpdate]);

  const toggleInspector = useCallback(() => {
    setInspectorEnabled((prev) => {
      if (prev) {
        lastElementRef.current = null;
        isOverlayHiddenRef.current = true;
        setInspector({ rect: null, className: "" });
        debouncedInspectorUpdate.cancel();
      } else {
        isOverlayHiddenRef.current = false;
      }
      return !prev;
    });
  }, [debouncedInspectorUpdate]);

  // Optimize viewport finding and cache the result
  useEffect(() => {
    const rootElement = rootRef.current;
    if (!rootElement) return;

    // Find and cache the scrollable viewport element
    const viewport = rootElement.querySelector("[data-radix-scroll-area-viewport]");
    scrollableElementRef.current = viewport || rootElement;
  }, []);

  // Add scroll event listener to hide overlay while scrolling
  useEffect(() => {
    const scrollableElement = scrollableElementRef.current;
    if (!scrollableElement || !inspectorEnabled) return;

    scrollableElement.addEventListener("scroll", hideOverlayOnScroll, { passive: true });

    return () => {
      scrollableElement.removeEventListener("scroll", hideOverlayOnScroll);
    };
  }, [inspectorEnabled, hideOverlayOnScroll]);

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedInspectorUpdate.cancel();
    };
  }, [debouncedInspectorUpdate]);

  return {
    rootRef,
    inspector,
    inspectorEnabled,
    toggleInspector,
    handleMouseMove,
    handleMouseLeave,
  } as const;
};
