
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
  
  return (
    <button 
      className={cn(buttonClassName, className)}
      type="button"
    >
      {label}
    </button>
  );
};

export default ButtonPreview;
