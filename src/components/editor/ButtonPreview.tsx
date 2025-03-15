import React from 'react';
import { ButtonPreviewProps } from '@/types';
import { cn } from '@/lib/utils';
import { useEditorStore } from '@/store/editorStore';

const ButtonPreview = ({
  styles,
  variant,
  size,
  label = 'Button',
  className,
  disabled = false
}: ButtonPreviewProps & { disabled?: boolean }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const themeState = useEditorStore(state => state.themeState?.styles);
  const mode = 'light'; // You might want to make this dynamic based on your app's theme mode

  // Base Tailwind classes (removing color classes as we'll apply them via style)
  const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50";

  const parseColor = (color: string, opacity: number) => {
    // Handle hex colors
    if (color.startsWith('#')) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
      if (result) {
        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
      }
    }

    // Handle rgb/rgba colors
    if (color.startsWith('rgb')) {
      const values = color.match(/\d+/g);
      if (values && values.length >= 3) {
        const [r, g, b] = values;
        return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
      }
    }

    // Handle oklch colors
    if (color.startsWith('oklch')) {
      // Extract the values from oklch
      const values = color.match(/[\d.]+/g);
      if (values && values.length >= 3) {
        // Keep the original oklch values but add opacity
        return color.replace(')', ` / ${opacity / 100})`);
      }
    }

    // Handle hsl/hsla colors
    if (color.startsWith('hsl')) {
      const values = color.match(/[\d.]+/g);
      if (values && values.length >= 3) {
        const [h, s, l] = values;
        return `hsla(${h}, ${s}%, ${l}%, ${opacity / 100})`;
      }
    }

    // If we can't parse the color, return it as is
    return color;
  };

  // Variant style objects using theme colors
  const variantStyles = {
    default: {
      color: themeState[mode]['primary-foreground'],
      backgroundColor: isHovered
        ? parseColor(themeState[mode].primary, (styles.hoverBackgroundOpacity))
        : themeState[mode].primary,
    },
    destructive: {
      color: themeState[mode]['destructive-foreground'],
      backgroundColor: isHovered
        ? parseColor(themeState[mode].destructive, (styles.hoverBackgroundOpacity))
        : themeState[mode].destructive,
    },
    outline: {
      backgroundColor: isHovered ? themeState[mode].accent : themeState[mode].background,
      color: themeState[mode].foreground,
      borderColor: themeState[mode].input,
      borderWidth: '1px',
    },
    secondary: {
      backgroundColor: isHovered ? parseColor(themeState[mode].secondary, (styles.hoverBackgroundOpacity)) : themeState[mode].secondary,
      color: themeState[mode]['secondary-foreground'],
    },
    ghost: {
      backgroundColor: isHovered ? themeState[mode].accent : 'transparent',
      color: themeState[mode].foreground,
    },
    link: {
      backgroundColor: 'transparent',
      color: themeState[mode].primary,
      textDecoration: 'underline',
      textUnderlineOffset: '4px',
    }
  };

  // Size classes without padding (we'll apply custom padding from styles)
  const sizeClasses = {
    default: "h-10",
    sm: "h-9 rounded-md text-sm",
    lg: "h-11 rounded-md text-lg",
    icon: "h-10 w-10"
  };

  // Combine custom styles with variant styles
  const customStyles = {
    borderRadius: `${styles.borderRadius}px`,
    fontSize: `${styles.fontSize}px`,
    fontWeight: styles.fontWeight,
    letterSpacing: `${styles.letterSpacing}em`,
    lineHeight: styles.lineHeight,
    textTransform: styles.textTransform as any,
    // Add custom padding
    paddingLeft: `${styles.paddingX}px`,
    paddingRight: `${styles.paddingX}px`,
    paddingTop: `${styles.paddingY}px`,
    paddingBottom: `${styles.paddingY}px`,
    // Add box shadow only if opacity > 0
    ...(styles.shadowOpacity > 0 && {
      boxShadow: `${styles.shadowOffsetX}px ${styles.shadowOffsetY}px ${styles.shadowBlur}px ${styles.shadowSpread}px ${styles.shadowColor}${Math.round(styles.shadowOpacity * 255).toString(16).padStart(2, '0')}`
    }),
    // Add border only if width > 0
    ...(styles.borderWidth > 0 && {
      borderWidth: `${styles.borderWidth}px`,
      borderColor: isHovered ? styles.hoverBorderColor : styles.borderColor
    }),
    transition: `all ${styles.transitionDuration}ms ${styles.transitionEasing}`,
    ...variantStyles[variant],
    // Move color after variantStyles to ensure it takes precedence
    color: isHovered ? styles.hoverTextColor : styles.textColor,
    // Add disabled styles
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  return (
    <button
      className={cn(
        baseClasses,
        sizeClasses[size],
        className
      )}
      type="button"
      style={customStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default ButtonPreview;
