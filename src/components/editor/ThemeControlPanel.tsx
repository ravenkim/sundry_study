import React, { useEffect } from 'react';
import { ThemeEditorControlsProps } from '@/types/theme';
import ControlSection from './ControlSection';
import ColorPicker from './ColorPicker';
import ResetButton from './ResetButton';
import { useLocation } from 'react-router-dom';
import { ScrollArea } from '../ui/scroll-area';

const ThemeControlPanel = ({ styles, currentMode, onChange, onReset, hasChanges = false }: ThemeEditorControlsProps) => {
  const location = useLocation();

  useEffect(() => {
    // Handle hash navigation
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        // Add a small delay to ensure the sections are expanded
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location.hash]);

  // Ensure we have valid styles for the current mode
  const currentStyles = styles?.[currentMode];
  if (!currentStyles) {
    return null; // Or some fallback UI
  }

  const updateStyle = React.useCallback(<K extends keyof typeof currentStyles>(key: K, value: typeof currentStyles[K]) => {
    onChange({
      ...styles,
      [currentMode]: {
        ...currentStyles,
        [key]: value
      }
    });
  }, [onChange, styles, currentMode, currentStyles]);

  return (
    <div className="space-y-4 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Theme Editor</h2>
        </div>
        <div className='flex items-center gap-2'>
          {hasChanges && <ResetButton onReset={onReset} label="Reset theme" />}
        </div>
      </div>

      <ScrollArea className='h-full'>
        <ControlSection title="Base Colors" expanded>
          <ColorPicker
            color={currentStyles.background}
            onChange={(color) => updateStyle('background', color)}
            label="Background"
          />
          <ColorPicker
            color={currentStyles.foreground}
            onChange={(color) => updateStyle('foreground', color)}
            label="Foreground"
          />
        </ControlSection>

        <ControlSection title="Card Colors" expanded>
          <ColorPicker
            color={currentStyles.card}
            onChange={(color) => updateStyle('card', color)}
            label="Card Background"
          />
          <ColorPicker
            color={currentStyles['card-foreground']}
            onChange={(color) => updateStyle('card-foreground', color)}
            label="Card Foreground"
          />
        </ControlSection>

        <ControlSection title="Popover Colors" expanded>
          <ColorPicker
            color={currentStyles.popover}
            onChange={(color) => updateStyle('popover', color)}
            label="Popover Background"
          />
          <ColorPicker
            color={currentStyles['popover-foreground']}
            onChange={(color) => updateStyle('popover-foreground', color)}
            label="Popover Foreground"
          />
        </ControlSection>

        <ControlSection title="Primary Colors" expanded id="primary-colors">
          <ColorPicker
            color={currentStyles.primary}
            onChange={(color) => updateStyle('primary', color)}
            label="Primary"
          />
          <ColorPicker
            color={currentStyles['primary-foreground']}
            onChange={(color) => updateStyle('primary-foreground', color)}
            label="Primary Foreground"
          />
        </ControlSection>

        <ControlSection title="Secondary Colors" expanded>
          <ColorPicker
            color={currentStyles.secondary}
            onChange={(color) => updateStyle('secondary', color)}
            label="Secondary"
          />
          <ColorPicker
            color={currentStyles['secondary-foreground']}
            onChange={(color) => updateStyle('secondary-foreground', color)}
            label="Secondary Foreground"
          />
        </ControlSection>

        <ControlSection title="Muted Colors" expanded>
          <ColorPicker
            color={currentStyles.muted}
            onChange={(color) => updateStyle('muted', color)}
            label="Muted"
          />
          <ColorPicker
            color={currentStyles['muted-foreground']}
            onChange={(color) => updateStyle('muted-foreground', color)}
            label="Muted Foreground"
          />
        </ControlSection>

        <ControlSection title="Accent Colors" expanded>
          <ColorPicker
            color={currentStyles.accent}
            onChange={(color) => updateStyle('accent', color)}
            label="Accent"
          />
          <ColorPicker
            color={currentStyles['accent-foreground']}
            onChange={(color) => updateStyle('accent-foreground', color)}
            label="Accent Foreground"
          />
        </ControlSection>

        <ControlSection title="Destructive Colors" expanded>
          <ColorPicker
            color={currentStyles.destructive}
            onChange={(color) => updateStyle('destructive', color)}
            label="Destructive"
          />
          <ColorPicker
            color={currentStyles['destructive-foreground']}
            onChange={(color) => updateStyle('destructive-foreground', color)}
            label="Destructive Foreground"
          />
        </ControlSection>

        <ControlSection title="Border & Input Colors" expanded>
          <ColorPicker
            color={currentStyles.border}
            onChange={(color) => updateStyle('border', color)}
            label="Border"
          />
          <ColorPicker
            color={currentStyles.input}
            onChange={(color) => updateStyle('input', color)}
            label="Input"
          />
          <ColorPicker
            color={currentStyles.ring}
            onChange={(color) => updateStyle('ring', color)}
            label="Ring"
          />
        </ControlSection>

        <ControlSection title="Chart Colors" expanded>
          <ColorPicker
            color={currentStyles['chart-1']}
            onChange={(color) => updateStyle('chart-1', color)}
            label="Chart 1"
          />
          <ColorPicker
            color={currentStyles['chart-2']}
            onChange={(color) => updateStyle('chart-2', color)}
            label="Chart 2"
          />
          <ColorPicker
            color={currentStyles['chart-3']}
            onChange={(color) => updateStyle('chart-3', color)}
            label="Chart 3"
          />
          <ColorPicker
            color={currentStyles['chart-4']}
            onChange={(color) => updateStyle('chart-4', color)}
            label="Chart 4"
          />
          <ColorPicker
            color={currentStyles['chart-5']}
            onChange={(color) => updateStyle('chart-5', color)}
            label="Chart 5"
          />
        </ControlSection>

        <ControlSection title="Sidebar Colors" expanded>
          <ColorPicker
            color={currentStyles.sidebar}
            onChange={(color) => updateStyle('sidebar', color)}
            label="Sidebar Background"
          />
          <ColorPicker
            color={currentStyles['sidebar-foreground']}
            onChange={(color) => updateStyle('sidebar-foreground', color)}
            label="Sidebar Foreground"
          />
          <ColorPicker
            color={currentStyles['sidebar-primary']}
            onChange={(color) => updateStyle('sidebar-primary', color)}
            label="Sidebar Primary"
          />
          <ColorPicker
            color={currentStyles['sidebar-primary-foreground']}
            onChange={(color) => updateStyle('sidebar-primary-foreground', color)}
            label="Sidebar Primary Foreground"
          />
          <ColorPicker
            color={currentStyles['sidebar-accent']}
            onChange={(color) => updateStyle('sidebar-accent', color)}
            label="Sidebar Accent"
          />
          <ColorPicker
            color={currentStyles['sidebar-accent-foreground']}
            onChange={(color) => updateStyle('sidebar-accent-foreground', color)}
            label="Sidebar Accent Foreground"
          />
          <ColorPicker
            color={currentStyles['sidebar-border']}
            onChange={(color) => updateStyle('sidebar-border', color)}
            label="Sidebar Border"
          />
          <ColorPicker
            color={currentStyles['sidebar-ring']}
            onChange={(color) => updateStyle('sidebar-ring', color)}
            label="Sidebar Ring"
          />
        </ControlSection>
      </ScrollArea >
    </div>
  );
};

export default ThemeControlPanel; 
