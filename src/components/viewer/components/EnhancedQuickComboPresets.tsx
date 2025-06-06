
import React, { useState } from 'react';
import { PresetCard } from '@/components/ui/design-system';
import { ENHANCED_COMBO_PRESETS } from './presets/enhancedComboPresets';
import { CustomStyleEditor } from './CustomStyleEditor';
import { Palette } from 'lucide-react';
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
  const [showCustomEditor, setShowCustomEditor] = useState(false);

  const handlePresetClick = (preset: any) => {
    if (isApplyingPreset) return;
    
    if (preset.id === 'custom-style') {
      setShowCustomEditor(true);
      onPresetSelect(preset.id);
      return;
    }
    
    onPresetSelect(preset.id);
    onApplyCombo(preset);
  };

  const handleCustomApply = (effects: any) => {
    const customPreset = {
      id: 'custom-style',
      name: 'Custom',
      icon: Palette,
      emoji: '🎨',
      category: 'Personal',
      description: 'Your custom style creation',
      materialHint: 'Personalized surface with your creative touch',
      tags: ['Personal', 'Custom'],
      effects
    };
    onApplyCombo(customPreset);
  };

  if (showCustomEditor) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-white font-medium">Custom Style Editor</h4>
          <button
            onClick={() => setShowCustomEditor(false)}
            className="text-gray-400 hover:text-white text-sm"
          >
            ← Back to Styles
          </button>
        </div>
        <CustomStyleEditor
          onApplyCustom={handleCustomApply}
          isApplying={isApplyingPreset}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Clean Preset Grid with Improved Layout */}
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
                preset.id === 'custom-style' ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">{preset.emoji}</span>
                      <span className="font-medium">{preset.name}</span>
                    </div>
                    <p className="text-sm text-gray-300">{preset.description}</p>
                    <p className="text-xs text-crd-green italic">
                      Create your own unique visual style with simplified controls
                    </p>
                    <div className="text-xs text-gray-400">
                      • Shimmer & Depth controls
                      • Color & Texture adjustments  
                      • Save your custom creations
                    </div>
                  </div>
                ) : (
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
                )
              }
            />
          );
        })}
      </div>
    </div>
  );
};
