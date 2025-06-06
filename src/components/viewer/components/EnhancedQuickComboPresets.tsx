
import React from 'react';
import { PresetCard } from '@/components/ui/design-system';
import { ENHANCED_COMBO_PRESETS } from './presets/enhancedComboPresets';
import type { QuickComboPresetsProps } from './presets/types';

interface EnhancedQuickComboPresetsProps extends QuickComboPresetsProps {
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export const EnhancedQuickComboPresets: React.FC<EnhancedQuickComboPresetsProps> = ({ 
  onApplyCombo, 
  currentEffects, 
  selectedPresetId, 
  onPresetSelect,
  isApplyingPreset = false
}) => {
  const handlePresetClick = (preset: any) => {
    if (isApplyingPreset) return;
    onPresetSelect(preset.id);
    onApplyCombo(preset);
  };

  return (
    <div className="space-y-4">
      {/* Clean Preset Grid */}
      <div className="grid grid-cols-2 gap-3">
        {ENHANCED_COMBO_PRESETS.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          const isLoading = isApplyingPreset && isSelected;
          
          return (
            <PresetCard
              key={preset.id}
              title={preset.name}
              description={preset.description}
              category={preset.category}
              emoji={preset.emoji}
              icon={preset.icon}
              isSelected={isSelected}
              isLoading={isLoading}
              isDisabled={isApplyingPreset && !isSelected}
              badge={preset.tags?.[0]}
              onSelect={() => handlePresetClick(preset)}
              size="sm"
              className="h-auto"
              tooltipContent={
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{preset.emoji}</span>
                    <span className="font-medium">{preset.name}</span>
                  </div>
                  <p className="text-sm text-gray-300">{preset.description}</p>
                  {preset.materialHint && (
                    <p className="text-xs text-crd-green italic">
                      Surface: {preset.materialHint}
                    </p>
                  )}
                  {preset.tags && (
                    <div className="flex flex-wrap gap-1">
                      {preset.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 bg-crd-mediumGray rounded text-crd-lightGray">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              }
            />
          );
        })}
      </div>
    </div>
  );
};
