import React from 'react';
import { ThemeEditorPreviewProps } from '@/types/theme';
import { Sun, Moon } from 'lucide-react';

const ThemePreviewPanel = ({ styles, currentMode, onModeChange }: ThemeEditorPreviewProps) => {
  if (!styles || !styles[currentMode]) {
    return null;
  }

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
            onClick={() => onModeChange('light')}
            className={`p-1.5 ${
              currentMode === 'light' 
                ? 'bg-muted text-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
            aria-label="Light mode"
          >
            <Sun className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onModeChange('dark')}
            className={`p-1.5 ${
              currentMode === 'dark' 
                ? 'bg-muted text-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
            aria-label="Dark mode"
          >
            <Moon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className={`flex-1 rounded-lg border p-4 overflow-y-auto ${currentMode === 'dark' ? 'dark' : ''}`}>
        <div className="space-y-4">
          {renderColorPreview('Background', styles[currentMode].background)}
          {renderColorPreview('Foreground', styles[currentMode].foreground)}
          {renderColorPreview('Card Background', styles[currentMode].card)}
          {renderColorPreview('Card Foreground', styles[currentMode]['card-foreground'])}
          {renderColorPreview('Popover Background', styles[currentMode].popover)}
          {renderColorPreview('Popover Foreground', styles[currentMode]['popover-foreground'])}
          {renderColorPreview('Primary', styles[currentMode].primary)}
          {renderColorPreview('Primary Foreground', styles[currentMode]['primary-foreground'])}
          {renderColorPreview('Secondary', styles[currentMode].secondary)}
          {renderColorPreview('Secondary Foreground', styles[currentMode]['secondary-foreground'])}
          {renderColorPreview('Muted', styles[currentMode].muted)}
          {renderColorPreview('Muted Foreground', styles[currentMode]['muted-foreground'])}
          {renderColorPreview('Accent', styles[currentMode].accent)}
          {renderColorPreview('Accent Foreground', styles[currentMode]['accent-foreground'])}
          {renderColorPreview('Destructive', styles[currentMode].destructive)}
          {renderColorPreview('Destructive Foreground', styles[currentMode]['destructive-foreground'])}
          {renderColorPreview('Border', styles[currentMode].border)}
          {renderColorPreview('Input', styles[currentMode].input)}
          {renderColorPreview('Ring', styles[currentMode].ring)}
          {renderColorPreview('Chart 1', styles[currentMode]['chart-1'])}
          {renderColorPreview('Chart 2', styles[currentMode]['chart-2'])}
          {renderColorPreview('Chart 3', styles[currentMode]['chart-3'])}
          {renderColorPreview('Chart 4', styles[currentMode]['chart-4'])}
          {renderColorPreview('Chart 5', styles[currentMode]['chart-5'])}
          {renderColorPreview('Sidebar Background', styles[currentMode].sidebar)}
          {renderColorPreview('Sidebar Foreground', styles[currentMode]['sidebar-foreground'])}
          {renderColorPreview('Sidebar Primary', styles[currentMode]['sidebar-primary'])}
          {renderColorPreview('Sidebar Primary Foreground', styles[currentMode]['sidebar-primary-foreground'])}
          {renderColorPreview('Sidebar Accent', styles[currentMode]['sidebar-accent'])}
          {renderColorPreview('Sidebar Accent Foreground', styles[currentMode]['sidebar-accent-foreground'])}
          {renderColorPreview('Sidebar Border', styles[currentMode]['sidebar-border'])}
          {renderColorPreview('Sidebar Ring', styles[currentMode]['sidebar-ring'])}
        </div>
      </div>
    </div>
  );
};

export default ThemePreviewPanel; 