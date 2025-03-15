import { ButtonStyleProps, ButtonVariant, ButtonSize } from '@/types';

export const generateButtonClassName = (
  styles: ButtonStyleProps,
  variant: ButtonVariant,
  size: ButtonSize
): string => {
  // Base styles - we're using inline styles for most properties, so we'll keep this minimal
  let className = `
    inline-flex 
    items-center 
    justify-center 
    whitespace-nowrap 
    font-medium
    transition-colors
    focus-visible:outline-none 
    disabled:pointer-events-none 
    disabled:opacity-50
  `;

  // Add size-specific styles - using inline styles for flexibility
  switch (size) {
    case 'sm':
      className += ` h-8`;
      break;
    case 'default':
      className += ` h-9`;
      break;
    case 'lg':
      className += ` h-10`;
      break;
    case 'icon':
      className += ` h-9 w-9`;
      break;
  }

  return className.replace(/\s+/g, ' ').trim();
};

export const getDefaultButtonStyles = (variant: ButtonVariant = 'default'): ButtonStyleProps => {
  const baseStyles: ButtonStyleProps = {
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 4,
    fontSize: 14,
    fontWeight: '500',
    paddingX: 16,
    paddingY: 8,
    
    hoverBackgroundColor: '#2a2a2a',
    hoverTextColor: '#ffffff',
    hoverBorderColor: 'transparent',
    
    focusBorderColor: '#2563eb',
    focusRingColor: '#2563eb',
    focusRingWidth: 2,
    
    activeBackgroundColor: '#0f0f0f',
    activeTextColor: '#ffffff',
    activeBorderColor: 'transparent',
    
    transitionDuration: 200,
    transitionEasing: 'ease',
    
    shadowColor: '#000000',
    shadowOpacity: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0,
    shadowSpread: 0,
    
    textTransform: 'none',
    letterSpacing: 0,
    lineHeight: 1.5,
  };

  // Apply variant-specific styles
  switch (variant) {
    case 'secondary':
      return {
        ...baseStyles,
        backgroundColor: '#f3f4f6',
        textColor: '#1f2937',
        hoverBackgroundColor: '#e5e7eb',
        hoverTextColor: '#1f2937',
        activeBackgroundColor: '#d1d5db',
        activeTextColor: '#1f2937',
      };
    case 'destructive':
      return {
        ...baseStyles,
        backgroundColor: '#ef4444',
        hoverBackgroundColor: '#dc2626',
        activeBackgroundColor: '#b91c1c',
      };
    case 'outline':
      return {
        ...baseStyles,
        backgroundColor: 'transparent',
        textColor: '#1f2937',
        borderColor: '#e5e7eb',
        hoverBackgroundColor: '#f9fafb',
        hoverTextColor: '#1f2937',
        activeBackgroundColor: '#f3f4f6',
        activeTextColor: '#1f2937',
      };
    case 'ghost':
      return {
        ...baseStyles,
        backgroundColor: 'transparent',
        textColor: '#1f2937',
        borderColor: 'transparent',
        hoverBackgroundColor: '#f3f4f6',
        hoverTextColor: '#1f2937',
        activeBackgroundColor: '#e5e7eb',
        activeTextColor: '#1f2937',
      };
    case 'link':
      return {
        ...baseStyles,
        backgroundColor: 'transparent',
        textColor: '#2563eb',
        borderColor: 'transparent',
        hoverBackgroundColor: 'transparent',
        hoverTextColor: '#1d4ed8',
        textTransform: 'none',
        fontWeight: '400',
        activeBackgroundColor: 'transparent',
        activeTextColor: '#1e40af',
        shadowOpacity: 0,
        paddingX: 2,
        paddingY: 0,
      };
    default:
      return baseStyles;
  }
};

export const generateCssOutput = (
  styles: ButtonStyleProps,
  variant: ButtonVariant,
  size: ButtonSize
): string => {
  // Generate CSS variables for the button
  return `/* ShadCN Button Override */
.button-override {
  /* Base styles */
  background-color: ${styles.backgroundColor};
  color: ${styles.textColor};
  border: ${styles.borderWidth}px solid ${styles.borderColor};
  border-radius: ${styles.borderRadius}px;
  font-size: ${styles.fontSize}px;
  font-weight: ${styles.fontWeight};
  padding: ${styles.paddingY}px ${styles.paddingX}px;
  box-shadow: ${styles.shadowOffsetX}px ${styles.shadowOffsetY}px ${styles.shadowBlur}px ${styles.shadowSpread}px ${styles.shadowColor}${Math.round(styles.shadowOpacity * 255).toString(16).padStart(2, '0')};
  letter-spacing: ${styles.letterSpacing}em;
  line-height: ${styles.lineHeight};
  text-transform: ${styles.textTransform};
  transition: all ${styles.transitionDuration}ms ${styles.transitionEasing};
  
  /* Hover state */
  &:hover {
    background-color: ${styles.hoverBackgroundColor};
    color: ${styles.hoverTextColor};
    border-color: ${styles.hoverBorderColor};
  }
  
  /* Focus state */
  &:focus {
    border-color: ${styles.focusBorderColor};
    outline: none;
    box-shadow: 0 0 0 ${styles.focusRingWidth}px ${styles.focusRingColor};
  }
  
  /* Active state */
  &:active {
    background-color: ${styles.activeBackgroundColor};
    color: ${styles.activeTextColor};
    border-color: ${styles.activeBorderColor};
  }
}

/* ShadCN Button Component Override */
.button-${variant} {
  /* Add your variant specific styles here */
}

.button-${size} {
  /* Add your size specific styles here */
}`;
};

export const generateTailwindConfig = (
  styles: ButtonStyleProps,
  variant: ButtonVariant
): string => {
  return `// tailwind.config.js extension
// Add this to your existing tailwind.config.js file
// under the theme.extend section

theme: {
  extend: {
    // ...your existing extensions
    
    // Custom button styles for ${variant} variant
    components: {
      '.btn-${variant}': {
        backgroundColor: '${styles.backgroundColor}',
        color: '${styles.textColor}',
        borderWidth: '${styles.borderWidth}px',
        borderColor: '${styles.borderColor}',
        borderRadius: '${styles.borderRadius}px',
        fontSize: '${styles.fontSize}px',
        fontWeight: '${styles.fontWeight}',
        padding: '${styles.paddingY}px ${styles.paddingX}px',
        boxShadow: '${styles.shadowOffsetX}px ${styles.shadowOffsetY}px ${styles.shadowBlur}px ${styles.shadowSpread}px ${styles.shadowColor}${Math.round(styles.shadowOpacity * 255).toString(16).padStart(2, '0')}',
        letterSpacing: '${styles.letterSpacing}em',
        lineHeight: '${styles.lineHeight}',
        textTransform: '${styles.textTransform}',
        transition: 'all ${styles.transitionDuration}ms ${styles.transitionEasing}',
        '&:hover': {
          backgroundColor: '${styles.hoverBackgroundColor}',
          color: '${styles.hoverTextColor}',
          borderColor: '${styles.hoverBorderColor}',
        },
        '&:focus': {
          borderColor: '${styles.focusBorderColor}',
          outline: 'none',
          boxShadow: '0 0 0 ${styles.focusRingWidth}px ${styles.focusRingColor}',
        },
        '&:active': {
          backgroundColor: '${styles.activeBackgroundColor}',
          color: '${styles.activeTextColor}',
          borderColor: '${styles.activeBorderColor}',
        },
      },
    },
  },
}`;
};

export const generateButtonComponentCode = (
  styles: ButtonStyleProps,
  variant: ButtonVariant,
  size: ButtonSize
): string => {
  // Helper function to get text transform class
  const getTextTransformClass = (transform: string) => {
    switch (transform) {
      case 'uppercase':
        return 'uppercase';
      case 'lowercase':
        return 'lowercase';
      case 'capitalize':
        return 'capitalize';
      default:
        return '';
    }
  };

  return `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: \`bg-[${styles.backgroundColor}] text-[${styles.textColor}] border-[${styles.borderWidth}px] border-[${styles.borderColor}] rounded-[${styles.borderRadius}px] text-[${styles.fontSize}px] font-[${styles.fontWeight}] px-[${styles.paddingX}px] py-[${styles.paddingY}px] shadow-[${styles.shadowOffsetX}px_${styles.shadowOffsetY}px_${styles.shadowBlur}px_${styles.shadowSpread}px_${styles.shadowColor}${Math.round(styles.shadowOpacity * 255).toString(16).padStart(2, '0')}] tracking-[${styles.letterSpacing}em] leading-[${styles.lineHeight}] ${getTextTransformClass(styles.textTransform)} transition-all duration-[${styles.transitionDuration}ms] ease-[${styles.transitionEasing}] hover:bg-[${styles.hoverBackgroundColor}] hover:text-[${styles.hoverTextColor}] hover:border-[${styles.hoverBorderColor}] focus:border-[${styles.focusBorderColor}] focus:shadow-[0_0_0_${styles.focusRingWidth}px_${styles.focusRingColor}] active:bg-[${styles.activeBackgroundColor}] active:text-[${styles.activeTextColor}] active:border-[${styles.activeBorderColor}]\`,
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9",
        sm: "h-8 text-xs",
        lg: "h-10",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }`;
};

export const generateShadcnConfig = (
  styles: ButtonStyleProps,
  variant: ButtonVariant
): string => {
  return `// components.json configuration
{
  "style": "default",
  "rsc": false,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  },
  "components": {
    "button": {
      "variants": {
        "${variant}": {
          "backgroundColor": "${styles.backgroundColor}",
          "textColor": "${styles.textColor}",
          "hoverBackgroundColor": "${styles.hoverBackgroundColor}"
        }
      }
    }
  }
}`;
};
