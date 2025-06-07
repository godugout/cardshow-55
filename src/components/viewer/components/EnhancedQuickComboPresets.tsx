
import React, { useState } from 'react';
import { PresetCard } from '@/components/ui/design-system';
import { ENHANCED_COMBO_PRESETS } from './presets/enhancedComboPresets';
import { CustomStyleEditor } from './CustomStyleEditor';
import { Palette } from 'lucide-react';
import { getStyleColor } from './presets/styleColors';
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
      {/* Preset Grid */}
      <div className="grid grid-cols-2 gap-3">
        {ENHANCED_COMBO_PRESETS.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          const isLoading = isApplyingPreset && isSelected;
          const styleColor = getStyleColor(preset.id);
          
          return (
            <div
              key={preset.id}
              className={`relative rounded-lg transition-all duration-200 ${
                isSelected 
                  ? 'ring-2 ring-offset-2 ring-offset-black' 
                  : ''
              }`}
              style={isSelected ? {
                '--tw-ring-color': styleColor.border,
                boxShadow: `0 0 0 2px black, 0 0 0 4px ${styleColor.border}`
              } : {}}
            >
              <PresetCard
                title={preset.name}
                emoji={preset.emoji}
                isSelected={isSelected}
                isLoading={isLoading}
                isDisabled={isApplyingPreset && !isSelected}
                onSelect={() => handlePresetClick(preset)}
                size="sm"
                styleColor={styleColor}
                className="h-auto border-2"
                style={isSelected ? {
                  borderColor: styleColor.border,
                  backgroundColor: styleColor.bg
                } : {}}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
