import React from 'react';
import { useTeamTheme } from '@/hooks/useTeamTheme';
import { PalettePreview, CRDButton, CRDBadge, CRDCard } from '@/components/ui/design-system';

export const TeamThemeShowcase = () => {
  const { currentPalette, availablePalettes, setTheme } = useTeamTheme();

  if (!currentPalette) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Current Theme Display */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-themed-primary">
          Current Theme: {currentPalette.name}
        </h3>
        <p className="text-themed-secondary">{currentPalette.description}</p>
        
        {/* 4-Color Palette Display */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-themed-secondary">Colors:</span>
          <PalettePreview palette={currentPalette} size="lg" showLabels />
        </div>
      </div>

      {/* Theme Component Showcase */}
      <CRDCard className="p-6 space-y-4">
        <h4 className="text-lg font-semibold text-themed-primary">Component Preview</h4>
        
        {/* Buttons */}
        <div className="flex gap-3 flex-wrap">
          <CRDButton variant="primary">Primary Button</CRDButton>
          <CRDButton variant="secondary">Secondary Button</CRDButton>
          <CRDButton variant="ghost">Ghost Button</CRDButton>
        </div>

        {/* Badges */}
        <div className="flex gap-2 flex-wrap">
          <CRDBadge variant="primary">Primary Badge</CRDBadge>
          <CRDBadge variant="secondary">Secondary Badge</CRDBadge>
          <CRDBadge variant="success">Success Badge</CRDBadge>
        </div>

        {/* Text Samples */}
        <div className="space-y-2">
          <div className="text-themed-primary font-semibold">Primary Text</div>
          <div className="text-themed-secondary">Secondary Text</div>
          <div className="accent-themed font-medium">Accent Text</div>
        </div>
      </CRDCard>

      {/* Quick Theme Switcher */}
      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-themed-primary">Quick Switch</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {availablePalettes.slice(0, 8).map(palette => (
            <button
              key={palette.id}
              onClick={() => setTheme(palette.id)}
              className={`p-3 rounded-lg border transition-all hover:scale-105 ${
                currentPalette.id === palette.id 
                  ? 'border-themed-strong bg-themed-light' 
                  : 'border-themed-light hover:border-themed bg-themed-subtle'
              }`}
            >
              <div className="text-xs font-medium text-themed-primary truncate mb-2">
                {palette.name}
              </div>
              <PalettePreview palette={palette} size="sm" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};