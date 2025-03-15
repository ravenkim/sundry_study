
import React from 'react';
import { ButtonPreviewProps } from '@/types';
import { cn } from '@/lib/utils';
import { generateButtonClassName } from '@/utils/buttonStyleGenerator';

const ButtonPreview = ({ 
  styles, 
  variant, 
  size, 
  label = 'Button',
  className 
}: ButtonPreviewProps) => {
  // Generate the className for the button based on the current styles
  const buttonClassName = generateButtonClassName(styles, variant, size);
  
  // Apply inline styles for properties that can't be reliably set through className
  const inlineStyle = {
    // Ensure colors are applied correctly
    backgroundColor: styles.backgroundColor,
    color: styles.textColor,
    borderColor: styles.borderColor,
    borderWidth: `${styles.borderWidth}px`,
    borderRadius: `${styles.borderRadius}px`,
    fontSize: `${styles.fontSize}px`,
    fontWeight: styles.fontWeight,
    padding: `${styles.paddingY}px ${styles.paddingX}px`,
    boxShadow: `${styles.shadowOffsetX}px ${styles.shadowOffsetY}px ${styles.shadowBlur}px ${styles.shadowSpread}px ${styles.shadowColor}${Math.round(styles.shadowOpacity * 255).toString(16).padStart(2, '0')}`,
    letterSpacing: `${styles.letterSpacing}em`,
    lineHeight: styles.lineHeight,
    textTransform: styles.textTransform as any,
    transition: `all ${styles.transitionDuration}ms ${styles.transitionEasing}`,
  };
  
  return (
    <button 
      className={cn(buttonClassName, className)}
      type="button"
      style={inlineStyle}
      onMouseOver={(e) => {
        // Apply hover styles on mouseover
        const target = e.currentTarget;
        target.style.backgroundColor = styles.hoverBackgroundColor;
        target.style.color = styles.hoverTextColor;
        target.style.borderColor = styles.hoverBorderColor;
      }}
      onMouseOut={(e) => {
        // Revert to normal styles on mouseout
        const target = e.currentTarget;
        target.style.backgroundColor = styles.backgroundColor;
        target.style.color = styles.textColor;
        target.style.borderColor = styles.borderColor;
      }}
      onFocus={(e) => {
        // Apply focus styles on focus
        const target = e.currentTarget;
        target.style.borderColor = styles.focusBorderColor;
        target.style.boxShadow = `0 0 0 ${styles.focusRingWidth}px ${styles.focusRingColor}`;
      }}
      onBlur={(e) => {
        // Revert to normal styles on blur
        const target = e.currentTarget;
        target.style.borderColor = styles.borderColor;
        target.style.boxShadow = `${styles.shadowOffsetX}px ${styles.shadowOffsetY}px ${styles.shadowBlur}px ${styles.shadowSpread}px ${styles.shadowColor}${Math.round(styles.shadowOpacity * 255).toString(16).padStart(2, '0')}`;
      }}
      onMouseDown={(e) => {
        // Apply active styles on mousedown
        const target = e.currentTarget;
        target.style.backgroundColor = styles.activeBackgroundColor;
        target.style.color = styles.activeTextColor;
        target.style.borderColor = styles.activeBorderColor;
      }}
      onMouseUp={(e) => {
        // Revert to hover styles on mouseup (assuming we're still hovering)
        const target = e.currentTarget;
        target.style.backgroundColor = styles.hoverBackgroundColor;
        target.style.color = styles.hoverTextColor;
        target.style.borderColor = styles.hoverBorderColor;
      }}
    >
      {label}
    </button>
  );
};

export default ButtonPreview;
