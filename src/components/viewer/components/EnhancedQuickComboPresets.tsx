
import React from 'react';
import { PresetCard } from '@/components/ui/design-system';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface EnhancedQuickComboPresetsProps {
  onApplyCombo: (combo: any) => void;
  currentEffects: EffectValues;
  selectedPresetId?: string;
  onPresetSelect: (presetId: string) => void;
  isApplyingPreset?: boolean;
}

export const EnhancedQuickComboPresets: React.FC<EnhancedQuickComboPresetsProps> = ({
  onApplyCombo,
  currentEffects,
  selectedPresetId,
  onPresetSelect,
  isApplyingPreset = false
}) => {
  console.log('🎨 EnhancedQuickComboPresets: Current effects:', currentEffects);
  console.log('🎨 EnhancedQuickComboPresets: Selected preset:', selectedPresetId);

  const quickCombos = [
    {
      id: 'crystal-shine',
      name: 'Crystal',
      preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      effects: {
        crystal: { intensity: 75, clarity: 0.8, refraction: 0.6 },
        holographic: { intensity: 0 },
        chrome: { intensity: 0 },
        brushedmetal: { intensity: 0 },
        vintage: { intensity: 0 },
        interference: { intensity: 0 },
        prizm: { intensity: 0 },
        foilspray: { intensity: 0 },
        gold: { intensity: 0 },
        aurora: { intensity: 0 },
        waves: { intensity: 0 },
        ice: { intensity: 0 },
        lunar: { intensity: 0 }
      }
    },
    {
      id: 'chrome-metal',
      name: 'Chrome',
      preview: 'linear-gradient(135deg, #c0c0c0 0%, #ffffff 50%, #c0c0c0 100%)',
      effects: {
        chrome: { intensity: 85, metallic: 0.9, reflection: 0.8 },
        crystal: { intensity: 0 },
        holographic: { intensity: 0 },
        brushedmetal: { intensity: 0 },
        vintage: { intensity: 0 },
        interference: { intensity: 0 },
        prizm: { intensity: 0 },
        foilspray: { intensity: 0 },
        gold: { intensity: 0 },
        aurora: { intensity: 0 },
        waves: { intensity: 0 },
        ice: { intensity: 0 },
        lunar: { intensity: 0 }
      }
    },
    {
      id: 'golden-luxury',
      name: 'Golden',
      preview: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
      effects: {
        gold: { intensity: 80, goldTone: 'classic', warmth: 0.7 },
        crystal: { intensity: 0 },
        holographic: { intensity: 0 },
        chrome: { intensity: 0 },
        brushedmetal: { intensity: 0 },
        vintage: { intensity: 0 },
        interference: { intensity: 0 },
        prizm: { intensity: 0 },
        foilspray: { intensity: 0 },
        aurora: { intensity: 0 },
        waves: { intensity: 0 },
        ice: { intensity: 0 },
        lunar: { intensity: 0 }
      }
    },
    {
      id: 'holographic-rainbow',
      name: 'Holographic',
      preview: 'linear-gradient(45deg, #ff0000 0%, #ff8000 16%, #ffff00 33%, #80ff00 50%, #00ff80 66%, #0080ff 83%, #8000ff 100%)',
      effects: {
        holographic: { intensity: 90, spectrum: 0.8, shift: 0.6 },
        crystal: { intensity: 0 },
        chrome: { intensity: 0 },
        brushedmetal: { intensity: 0 },
        vintage: { intensity: 0 },
        interference: { intensity: 0 },
        prizm: { intensity: 0 },
        foilspray: { intensity: 0 },
        gold: { intensity: 0 },
        aurora: { intensity: 0 },
        waves: { intensity: 0 },
        ice: { intensity: 0 },
        lunar: { intensity: 0 }
      }
    },
    {
      id: 'aurora-mystical',
      name: 'Aurora',
      preview: 'linear-gradient(135deg, #00ffff 0%, #0080ff 25%, #8000ff 50%, #ff0080 75%, #ff8000 100%)',
      effects: {
        aurora: { intensity: 85, flow: 0.7, ethereal: 0.8 },
        crystal: { intensity: 0 },
        holographic: { intensity: 0 },
        chrome: { intensity: 0 },
        brushedmetal: { intensity: 0 },
        vintage: { intensity: 0 },
        interference: { intensity: 0 },
        prizm: { intensity: 0 },
        foilspray: { intensity: 0 },
        gold: { intensity: 0 },
        waves: { intensity: 0 },
        ice: { intensity: 0 },
        lunar: { intensity: 0 }
      }
    },
    {
      id: 'vintage-paper',
      name: 'Vintage',
      preview: 'linear-gradient(135deg, #8B4513 0%, #D2B48C 50%, #F5DEB3 100%)',
      effects: {
        vintage: { intensity: 70, aging: 0.6, texture: 0.8 },
        crystal: { intensity: 0 },
        holographic: { intensity: 0 },
        chrome: { intensity: 0 },
        brushedmetal: { intensity: 0 },
        interference: { intensity: 0 },
        prizm: { intensity: 0 },
        foilspray: { intensity: 0 },
        gold: { intensity: 0 },
        aurora: { intensity: 0 },
        waves: { intensity: 0 },
        ice: { intensity: 0 },
        lunar: { intensity: 0 }
      }
    }
  ];

  const handleComboClick = (combo: any) => {
    console.log('🚀 Combo clicked:', combo.id);
    console.log('🚀 Combo effects to apply:', combo.effects);
    
    onPresetSelect(combo.id);
    onApplyCombo(combo);
    
    console.log('🚀 Combo application triggered for:', combo.name);
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {quickCombos.map((combo) => (
        <PresetCard
          key={combo.id}
          name={combo.name}
          preview={combo.preview}
          isSelected={selectedPresetId === combo.id}
          isApplying={isApplyingPreset && selectedPresetId === combo.id}
          onClick={() => handleComboClick(combo)}
        />
      ))}
    </div>
  );
};
