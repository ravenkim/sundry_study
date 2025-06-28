"use client";

import { useState, useRef, useCallback, MouseEvent } from "react";
import { THEME_CLASS_REGEX } from "./use-theme-inspector-regex";

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
  const lastElementRef = useRef<HTMLElement | null>(null);

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

      return { rect, className: newClassName };
    });
  }, []);

  const clearInspectorState = useCallback(() => {
    if (lastElementRef.current) {
      lastElementRef.current = null;
      setInspector({ rect: null, className: "" });
    }
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement | null;
      if (!target || !rootRef.current) return;

      if (!rootRef.current.contains(target) || target === rootRef.current) return;

      if (!inspectorEnabled) return;

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
    },
    [inspectorEnabled, getClassString, updateInspectorState, clearInspectorState]
  );

  const handleMouseLeave = useCallback(() => {
    lastElementRef.current = null;
  }, []);

  const toggleInspector = useCallback(() => {
    setInspectorEnabled((prev) => {
      if (prev) {
        lastElementRef.current = null;
        setInspector({ rect: null, className: "" });
      }
      return !prev;
    });
  }, []);

  return {
    rootRef,
    inspector,
    inspectorEnabled,
    toggleInspector,
    handleMouseMove,
    handleMouseLeave,
  } as const;
};
