import React, { useState } from 'react';
import { ThemeEditorPreviewProps } from '@/types/theme';
import { Sun, Moon } from 'lucide-react';

const ThemePreviewPanel = ({ styles }: ThemeEditorPreviewProps) => {
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light');

  const renderColorPreview = (label: string, color: string) => (
    <div className="flex items-center gap-4">
      <div 
        className="w-12 h-12 rounded-md" 
        style={{ backgroundColor: color }}
      />
      <div className="flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{color}</p>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Theme Preview</h2>
        <div className="flex border rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => setPreviewMode('light')}
            className={`p-1.5 ${
              previewMode === 'light' 
                ? 'bg-muted text-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
            aria-label="Light mode"
          >
            <Sun className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode('dark')}
            className={`p-1.5 ${
              previewMode === 'dark' 
                ? 'bg-muted text-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
            aria-label="Dark mode"
          >
            <Moon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className={`flex-1 rounded-lg border p-4 overflow-y-auto ${previewMode === 'dark' ? 'dark' : ''}`}>
        <div className="space-y-4">
          {renderColorPreview('Background', styles.background)}
          {renderColorPreview('Foreground', styles.foreground)}
          {renderColorPreview('Card Background', styles.card)}
          {renderColorPreview('Card Foreground', styles['card-foreground'])}
          {renderColorPreview('Popover Background', styles.popover)}
          {renderColorPreview('Popover Foreground', styles['popover-foreground'])}
          {renderColorPreview('Primary', styles.primary)}
          {renderColorPreview('Primary Foreground', styles['primary-foreground'])}
          {renderColorPreview('Secondary', styles.secondary)}
          {renderColorPreview('Secondary Foreground', styles['secondary-foreground'])}
          {renderColorPreview('Muted', styles.muted)}
          {renderColorPreview('Muted Foreground', styles['muted-foreground'])}
          {renderColorPreview('Accent', styles.accent)}
          {renderColorPreview('Accent Foreground', styles['accent-foreground'])}
          {renderColorPreview('Destructive', styles.destructive)}
          {renderColorPreview('Destructive Foreground', styles['destructive-foreground'])}
          {renderColorPreview('Border', styles.border)}
          {renderColorPreview('Input', styles.input)}
          {renderColorPreview('Ring', styles.ring)}
          {renderColorPreview('Chart 1', styles['chart-1'])}
          {renderColorPreview('Chart 2', styles['chart-2'])}
          {renderColorPreview('Chart 3', styles['chart-3'])}
          {renderColorPreview('Chart 4', styles['chart-4'])}
          {renderColorPreview('Chart 5', styles['chart-5'])}
          {renderColorPreview('Sidebar Background', styles.sidebar)}
          {renderColorPreview('Sidebar Foreground', styles['sidebar-foreground'])}
          {renderColorPreview('Sidebar Primary', styles['sidebar-primary'])}
          {renderColorPreview('Sidebar Primary Foreground', styles['sidebar-primary-foreground'])}
          {renderColorPreview('Sidebar Accent', styles['sidebar-accent'])}
          {renderColorPreview('Sidebar Accent Foreground', styles['sidebar-accent-foreground'])}
          {renderColorPreview('Sidebar Border', styles['sidebar-border'])}
          {renderColorPreview('Sidebar Ring', styles['sidebar-ring'])}
        </div>
      </div>
    </div>
  );
};

export default ThemePreviewPanel; 