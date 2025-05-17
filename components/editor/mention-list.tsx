"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { cn } from "@/lib/utils";

// Define the structure of the theme item object
interface ThemeItem {
  id: string;
  label: string;
}

interface MentionListProps {
  items: ThemeItem[]; // Update items type to ThemeItem[]
  command: (item: { id: string; label: string }) => void; // Update command type if needed, here passing the whole object
}

// Use a type for the ref handle if needed, e.g., { onKeyDown: ... }
// Using `any` for now as in the original code
export interface MentionListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

export const MentionList = forwardRef<MentionListRef, MentionListProps>(
  (props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Function to select item (adapted from reference)
    const selectItem = (index: number) => {
      console.log("selectItem", index);
      const item = props.items[index];
      if (item) {
        // Pass the whole item object to the command function
        props.command(item);
      }
    };

    // Arrow key handlers using modulo (adapted from reference)
    const upHandler = () => {
      setSelectedIndex(
        (prevIndex) => (prevIndex + props.items.length - 1) % props.items.length
      );
    };

    const downHandler = () => {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === "ArrowUp") {
          // Use modulo handlers
          upHandler();
          return true;
        }

        if (event.key === "ArrowDown") {
          // Use modulo handlers
          downHandler();
          return true;
        }

        if (event.key === "Enter") {
          // Use enter handler
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    return (
      <div
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
        )}
        style={{ position: "absolute", pointerEvents: "auto" }}
      >
        {props.items.length ? (
          props.items.map((item, index) => (
            <button
              // Use Tailwind classes mimicking shadcn/ui DropdownMenuItem with cn utility
              className={cn(
                "relative flex w-full items-center rounded-sm p-1.5 text-xs outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                index === selectedIndex && "bg-accent text-accent-foreground"
              )}
              key={item.id} // Use item.id as the key
              onClick={(e) => {
                e.stopPropagation();
                selectItem(index);
              }}
            >
              {item.label}
            </button>
          ))
        ) : (
          <div
            className={cn(
              "relative flex cursor-default select-none items-center rounded-sm p-1.5 text-xs text-muted-foreground"
            )}
          >
            No result
          </div>
        )}
      </div>
    );
  }
);

MentionList.displayName = "MentionList";
