
import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PresetCard, FilterButton } from '@/components/ui/design-system';
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
  isApplyingPreset = false,
  selectedCategory = 'All',
  onCategoryChange
}) => {
  const categories = [
    { key: 'All', label: 'All' },
    { key: 'Premium', label: '✨ Pro' },
    { key: 'Metallic', label: '🥉 Metal' },
    { key: 'Atmospheric', label: '🌫️ Atmo' },
    { key: 'Specialty', label: '🎯 Special' },
    { key: 'Classic', label: '📼 Classic' }
  ];
  
  const filteredPresets = selectedCategory === 'All' 
    ? ENHANCED_COMBO_PRESETS 
    : ENHANCED_COMBO_PRESETS.filter(preset => preset.category === selectedCategory);

  const getCategoryCount = (category: string) => {
    if (category === 'All') return ENHANCED_COMBO_PRESETS.length;
    return ENHANCED_COMBO_PRESETS.filter(preset => preset.category === category).length;
  };

  const handlePresetClick = (preset: any) => {
    if (isApplyingPreset) return;
    onPresetSelect(preset.id);
    onApplyCombo(preset);
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Category Filters - More Compact */}
        {onCategoryChange && (
          <div className="space-y-2">
            <h5 className="text-crd-lightGray text-xs font-medium uppercase tracking-wide">
              Categories
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((category) => (
                <FilterButton
                  key={category.key}
                  onClick={() => onCategoryChange(category.key)}
                  isActive={selectedCategory === category.key}
                  count={getCategoryCount(category.key)}
                  className="text-xs h-7 px-2"
                >
                  {category.label}
                </FilterButton>
              ))}
            </div>
          </div>
        )}

        {/* Preset Grid - Responsive Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h5 className="text-crd-lightGray text-xs font-medium uppercase tracking-wide">
              Styles ({filteredPresets.length})
            </h5>
            {isApplyingPreset && (
              <div className="text-xs text-crd-green">Applying...</div>
            )}
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-2">
            {filteredPresets.map((preset) => {
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
      </div>
    </TooltipProvider>
  );
};
