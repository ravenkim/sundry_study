import React from 'react';
import { ThemeEditorControlsProps } from '@/types/theme';
import ControlSection from './ControlSection';
import ColorPicker from './ColorPicker';

const ThemeControlPanel = ({ styles, onChange }: ThemeEditorControlsProps) => {
  const updateStyle = React.useCallback(<K extends keyof typeof styles>(key: K, value: typeof styles[K]) => {
    onChange({ ...styles, [key]: value });
  }, [onChange, styles]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Theme Editor</h2>
      <ControlSection title="Base Colors" expanded>
        <ColorPicker 
          color={styles.background} 
          onChange={(color) => updateStyle('background', color)} 
          label="Background" 
        />
        <ColorPicker 
          color={styles.foreground} 
          onChange={(color) => updateStyle('foreground', color)} 
          label="Foreground" 
        />
      </ControlSection>

      <ControlSection title="Card Colors" expanded>
        <ColorPicker 
          color={styles.card} 
          onChange={(color) => updateStyle('card', color)} 
          label="Card Background" 
        />
        <ColorPicker 
          color={styles['card-foreground']} 
          onChange={(color) => updateStyle('card-foreground', color)} 
          label="Card Foreground" 
        />
      </ControlSection>

      <ControlSection title="Popover Colors" expanded>
        <ColorPicker 
          color={styles.popover} 
          onChange={(color) => updateStyle('popover', color)} 
          label="Popover Background" 
        />
        <ColorPicker 
          color={styles['popover-foreground']} 
          onChange={(color) => updateStyle('popover-foreground', color)} 
          label="Popover Foreground" 
        />
      </ControlSection>

      <ControlSection title="Primary Colors" expanded>
        <ColorPicker 
          color={styles.primary} 
          onChange={(color) => updateStyle('primary', color)} 
          label="Primary" 
        />
        <ColorPicker 
          color={styles['primary-foreground']} 
          onChange={(color) => updateStyle('primary-foreground', color)} 
          label="Primary Foreground" 
        />
      </ControlSection>

      <ControlSection title="Secondary Colors" expanded>
        <ColorPicker 
          color={styles.secondary} 
          onChange={(color) => updateStyle('secondary', color)} 
          label="Secondary" 
        />
        <ColorPicker 
          color={styles['secondary-foreground']} 
          onChange={(color) => updateStyle('secondary-foreground', color)} 
          label="Secondary Foreground" 
        />
      </ControlSection>

      <ControlSection title="Muted Colors" expanded>
        <ColorPicker 
          color={styles.muted} 
          onChange={(color) => updateStyle('muted', color)} 
          label="Muted" 
        />
        <ColorPicker 
          color={styles['muted-foreground']} 
          onChange={(color) => updateStyle('muted-foreground', color)} 
          label="Muted Foreground" 
        />
      </ControlSection>

      <ControlSection title="Accent Colors" expanded>
        <ColorPicker 
          color={styles.accent} 
          onChange={(color) => updateStyle('accent', color)} 
          label="Accent" 
        />
        <ColorPicker 
          color={styles['accent-foreground']} 
          onChange={(color) => updateStyle('accent-foreground', color)} 
          label="Accent Foreground" 
        />
      </ControlSection>

      <ControlSection title="Destructive Colors" expanded>
        <ColorPicker 
          color={styles.destructive} 
          onChange={(color) => updateStyle('destructive', color)} 
          label="Destructive" 
        />
        <ColorPicker 
          color={styles['destructive-foreground']} 
          onChange={(color) => updateStyle('destructive-foreground', color)} 
          label="Destructive Foreground" 
        />
      </ControlSection>

      <ControlSection title="Border & Input Colors" expanded>
        <ColorPicker 
          color={styles.border} 
          onChange={(color) => updateStyle('border', color)} 
          label="Border" 
        />
        <ColorPicker 
          color={styles.input} 
          onChange={(color) => updateStyle('input', color)} 
          label="Input" 
        />
        <ColorPicker 
          color={styles.ring} 
          onChange={(color) => updateStyle('ring', color)} 
          label="Ring" 
        />
      </ControlSection>

      <ControlSection title="Chart Colors" expanded>
        <ColorPicker 
          color={styles['chart-1']} 
          onChange={(color) => updateStyle('chart-1', color)} 
          label="Chart 1" 
        />
        <ColorPicker 
          color={styles['chart-2']} 
          onChange={(color) => updateStyle('chart-2', color)} 
          label="Chart 2" 
        />
        <ColorPicker 
          color={styles['chart-3']} 
          onChange={(color) => updateStyle('chart-3', color)} 
          label="Chart 3" 
        />
        <ColorPicker 
          color={styles['chart-4']} 
          onChange={(color) => updateStyle('chart-4', color)} 
          label="Chart 4" 
        />
        <ColorPicker 
          color={styles['chart-5']} 
          onChange={(color) => updateStyle('chart-5', color)} 
          label="Chart 5" 
        />
      </ControlSection>

      <ControlSection title="Sidebar Colors" expanded>
        <ColorPicker 
          color={styles.sidebar} 
          onChange={(color) => updateStyle('sidebar', color)} 
          label="Sidebar Background" 
        />
        <ColorPicker 
          color={styles['sidebar-foreground']} 
          onChange={(color) => updateStyle('sidebar-foreground', color)} 
          label="Sidebar Foreground" 
        />
        <ColorPicker 
          color={styles['sidebar-primary']} 
          onChange={(color) => updateStyle('sidebar-primary', color)} 
          label="Sidebar Primary" 
        />
        <ColorPicker 
          color={styles['sidebar-primary-foreground']} 
          onChange={(color) => updateStyle('sidebar-primary-foreground', color)} 
          label="Sidebar Primary Foreground" 
        />
        <ColorPicker 
          color={styles['sidebar-accent']} 
          onChange={(color) => updateStyle('sidebar-accent', color)} 
          label="Sidebar Accent" 
        />
        <ColorPicker 
          color={styles['sidebar-accent-foreground']} 
          onChange={(color) => updateStyle('sidebar-accent-foreground', color)} 
          label="Sidebar Accent Foreground" 
        />
        <ColorPicker 
          color={styles['sidebar-border']} 
          onChange={(color) => updateStyle('sidebar-border', color)} 
          label="Sidebar Border" 
        />
        <ColorPicker 
          color={styles['sidebar-ring']} 
          onChange={(color) => updateStyle('sidebar-ring', color)} 
          label="Sidebar Ring" 
        />
      </ControlSection>
    </div>
  );
};

export default ThemeControlPanel; 