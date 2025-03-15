
import React from 'react';
import { ButtonPreviewProps } from '@/types';
import { cn } from '@/lib/utils';

const ButtonPreview = ({ 
  styles, 
  variant, 
  size, 
  label = 'Button',
  className 
}: ButtonPreviewProps) => {
  // Base Tailwind classes
  const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50";
  
  // Variant classes
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/70",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/70",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/60",
    ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
    link: "text-primary underline-offset-4 hover:underline"
  };
  
  // Size classes
  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3 text-sm",
    lg: "h-11 rounded-md px-8 text-lg",
    icon: "h-10 w-10"
  };
  
  // Apply custom styles that cannot be handled by Tailwind classes
  const customStyles = {
    borderRadius: `${styles.borderRadius}px`,
    fontSize: `${styles.fontSize}px`,
    fontWeight: styles.fontWeight,
    letterSpacing: `${styles.letterSpacing}em`,
    lineHeight: styles.lineHeight,
    textTransform: styles.textTransform as any,
    // Add box shadow only if opacity > 0
    ...(styles.shadowOpacity > 0 && {
      boxShadow: `${styles.shadowOffsetX}px ${styles.shadowOffsetY}px ${styles.shadowBlur}px ${styles.shadowSpread}px ${styles.shadowColor}${Math.round(styles.shadowOpacity * 255).toString(16).padStart(2, '0')}`
    }),
    // Add border only if width > 0
    ...(styles.borderWidth > 0 && {
      borderWidth: `${styles.borderWidth}px`,
      borderColor: styles.borderColor
    })
  };
  
  return (
    <button 
      className={cn(
        baseClasses, 
        variantClasses[variant], 
        sizeClasses[size], 
        className
      )}
      type="button"
      style={customStyles}
    >
      {label}
    </button>
  );
};

export default ButtonPreview;
