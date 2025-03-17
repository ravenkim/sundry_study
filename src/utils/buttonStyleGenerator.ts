import defaultButtonStyles from "@/config/button";
import { ButtonStyleProps, ButtonVariant, ButtonSize } from "@/types";

export const generateButtonClassName = (
  styles: ButtonStyleProps,
  variant: ButtonVariant,
  size: ButtonSize,
): string => {
  // Base styles
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
    case "sm":
      className += ` h-8`;
      break;
    case "default":
      className += ` h-9`;
      break;
    case "lg":
      className += ` h-10`;
      break;
    case "icon":
      className += ` h-9 w-9`;
      break;
  }

  return className.replace(/\s+/g, " ").trim();
};

export const getDefaultButtonStyles = (
  variant: ButtonVariant = "default",
): ButtonStyleProps => {
  const baseStyles: ButtonStyleProps = defaultButtonStyles;

  // Apply variant-specific styles
  switch (variant) {
    case "secondary":
      return {
        ...baseStyles,
        backgroundColor: "#f3f4f6",
        textColor: "#1f2937",
        hoverBackgroundColor: "#e5e7eb",
        hoverTextColor: "#1f2937",
      };
    case "destructive":
      return {
        ...baseStyles,
        backgroundColor: "#ef4444",
        hoverBackgroundColor: "#dc2626",
      };
    case "outline":
      return {
        ...baseStyles,
        backgroundColor: "transparent",
        textColor: "#1f2937",
        borderColor: "#e5e7eb",
        hoverBackgroundColor: "#f9fafb",
        hoverTextColor: "#1f2937",
      };
    case "ghost":
      return {
        ...baseStyles,
        backgroundColor: "transparent",
        textColor: "#1f2937",
        borderColor: "transparent",
        hoverBackgroundColor: "#f3f4f6",
        hoverTextColor: "#1f2937",
      };
    case "link":
      return {
        ...baseStyles,
        backgroundColor: "transparent",
        textColor: "#2563eb",
        borderColor: "transparent",
        hoverBackgroundColor: "transparent",
        hoverTextColor: "#1d4ed8",
        textTransform: "none",
        fontWeight: "400",
        shadowOpacity: 0,
        paddingX: 2,
        paddingY: 0,
      };
    default:
      return baseStyles;
  }
};

export const generateButtonComponentCode = (
  styles: ButtonStyleProps,
  variant: ButtonVariant,
  size: ButtonSize,
): string => {
  // Generate Tailwind utility classes for each style property
  const generateTailwindClasses = (
    styles: ButtonStyleProps,
    variant: ButtonVariant,
  ) => {
    // Convert hex color to Tailwind format for inline classes
    const formatColor = (color: string) => color;

    // Transform styling properties to Tailwind utility classes
    const baseClasses = `
      bg-primary 
      text-primary-foreground 
      border-[${styles.borderWidth}px] 
      border-[${formatColor(styles.borderColor)}] 
      rounded-[${styles.borderRadius}px] 
      text-[${styles.fontSize}px] 
      font-[${styles.fontWeight}] 
      px-[${styles.paddingX}px] 
      py-[${styles.paddingY}px] 
      ${
        styles.shadowOpacity > 0
          ? `shadow-[${styles.shadowOffsetX}px_${styles.shadowOffsetY}px_${styles.shadowBlur}px_${styles.shadowSpread}px_${formatColor(styles.shadowColor)}${Math.round(
              styles.shadowOpacity * 255,
            )
              .toString(16)
              .padStart(2, "0")}]`
          : ""
      }
      tracking-[${styles.letterSpacing}em] 
      leading-[${styles.lineHeight}] 
      ${styles.textTransform !== "none" ? `${styles.textTransform}` : ""} 
      transition-all duration-[${styles.transitionDuration}ms] ease-[${styles.transitionEasing}]
      hover:bg-primary/${styles.hoverBackgroundOpacity} 
      hover:text-[${formatColor(styles.hoverTextColor)}] 
      hover:border-[${formatColor(styles.hoverBorderColor)}]
    `;

    return baseClasses.replace(/\s+/g, " ").trim();
  };

  // Size classes object to be used in the cva function
  const getSizeClasses = () => {
    return {
      default: "h-9",
      sm: "h-8 text-xs",
      lg: "h-10",
      icon: "h-9 w-9",
    };
  };

  // Generate tailwind classes for each variant
  const variantClasses = {
    default: generateTailwindClasses(styles, "default"),
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline:
      "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };

  // Update the variant we're currently generating
  variantClasses[variant] = generateTailwindClasses(styles, variant);

  return `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "${variantClasses.default}",
        destructive:
          "${variantClasses.destructive}",
        outline:
          "${variantClasses.outline}",
        secondary:
          "${variantClasses.secondary}",
        ghost: "${variantClasses.ghost}",
        link: "${variantClasses.link}",
      },
      size: {
        default: "${getSizeClasses().default}",
        sm: "${getSizeClasses().sm}",
        lg: "${getSizeClasses().lg}",
        icon: "${getSizeClasses().icon}",
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
