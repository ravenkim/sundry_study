"use client";

import React, { useLayoutEffect, useRef, ReactNode } from 'react';

interface ResizableTextBoxProps {
  children: ReactNode;
  className?: string;
}

const ResizableTextBox = ({ children, className = '' }: ResizableTextBoxProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;

    if (!container || !text) return;

    const adjustFontSize = () => {
      const containerWidth = container.clientWidth;
      
      text.style.fontSize = 'inherit';
      const inheritedFontSize = parseFloat(window.getComputedStyle(text).fontSize);
      text.style.fontSize = `${inheritedFontSize}px`;

      const textWidth = text.scrollWidth;

      if (textWidth > containerWidth) {
        const newSize = (inheritedFontSize * containerWidth) / textWidth;
        text.style.fontSize = `${newSize}px`;
      }
    };

    adjustFontSize();

    const observer = new ResizeObserver(adjustFontSize);
    observer.observe(container);

    return () => observer.disconnect();
  }, [children]);

  return (
    <div 
      ref={containerRef} 
      className={className} 
      style={{ overflow: 'hidden' }}
    >
      <span ref={textRef} style={{ whiteSpace: 'nowrap', display: 'inline-block' }}>
        {children}
      </span>
    </div>
  );
};

export default ResizableTextBox;
