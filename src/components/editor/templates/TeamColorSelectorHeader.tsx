
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { Palette } from 'lucide-react';
import type { TeamColorScheme } from './TeamColors';

interface TeamColorSelectorHeaderProps {
  selectedColorScheme?: TeamColorScheme;
}

export const TeamColorSelectorHeader = ({ selectedColorScheme }: TeamColorSelectorHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Palette className="w-4 h-4 text-crd-white" />
        <CardTitle className="text-crd-white text-sm">Team Colors</CardTitle>
      </div>
      {selectedColorScheme && (
        <div className="flex gap-1">
          <div 
            className="w-4 h-4 rounded-full border border-white/20" 
            style={{ backgroundColor: selectedColorScheme.primary }}
          />
          <div 
            className="w-4 h-4 rounded-full border border-white/20" 
            style={{ backgroundColor: selectedColorScheme.secondary }}
          />
        </div>
      )}
    </div>
  );
};
