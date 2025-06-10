
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Sparkles, Crown, Palette, Zap, Check } from 'lucide-react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface PresetCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  presets: EffectPreset[];
}

interface EffectPreset {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail?: string;
  effects: EffectValues;
  tags: string[];
}

interface PresetSelectionStepProps {
  selectedPreset?: EffectPreset;
  onPresetSelect: (preset: EffectPreset) => void;
  onPresetPreview: (preset: EffectPreset | null) => void;
  isPreviewMode: boolean;
  onTogglePreviewMode: () => void;
  onNext: () => void;
}

const PRESET_CATEGORIES: PresetCategory[] = [
  {
    id: 'premium',
    name: 'Premium',
    icon: Crown,
    color: 'text-amber-500',
    presets: [
      {
        id: 'holographic-premium',
        name: 'Holographic Premium',
        description: 'Intense holographic effects with perfect rainbow shifts',
        category: 'premium',
        effects: {
          holographic: 85,
          foilspray: 30,
          prizm: 20,
          chrome: 0,
          interference: 0,
          brushedmetal: 0,
          crystal: 0,
          vintage: 0,
          foil: 0,
          prismatic: 0,
          aurora: 0,
          lunar: 0,
          waves: 0,
          gold: 0,
          ice: 0
        },
        tags: ['Premium', 'Holographic', 'Rainbow']
      },
      {
        id: 'gold-luxury',
        name: 'Gold Luxury',
        description: 'Elegant gold foiling with subtle metallic shine',
        category: 'premium',
        effects: {
          holographic: 0,
          foilspray: 70,
          prizm: 0,
          chrome: 40,
          interference: 0,
          brushedmetal: 50,
          crystal: 0,
          vintage: 0,
          foil: 0,
          prismatic: 0,
          aurora: 0,
          lunar: 0,
          waves: 0,
          gold: 80,
          ice: 0
        },
        tags: ['Luxury', 'Gold', 'Metallic']
      }
    ]
  },
  {
    id: 'metallic',
    name: 'Metallic',
    icon: Zap,
    color: 'text-blue-500',
    presets: [
      {
        id: 'chrome-mirror',
        name: 'Chrome Mirror',
        description: 'Reflective chrome finish with mirror-like quality',
        category: 'metallic',
        effects: {
          holographic: 0,
          foilspray: 0,
          prizm: 0,
          chrome: 90,
          interference: 0,
          brushedmetal: 30,
          crystal: 0,
          vintage: 0,
          foil: 0,
          prismatic: 0,
          aurora: 0,
          lunar: 0,
          waves: 0,
          gold: 0,
          ice: 0
        },
        tags: ['Chrome', 'Mirror', 'Reflective']
      },
      {
        id: 'brushed-steel',
        name: 'Brushed Steel',
        description: 'Industrial brushed metal texture with subtle shine',
        category: 'metallic',
        effects: {
          holographic: 0,
          foilspray: 0,
          prizm: 0,
          chrome: 20,
          interference: 0,
          brushedmetal: 80,
          crystal: 0,
          vintage: 0,
          foil: 0,
          prismatic: 0,
          aurora: 0,
          lunar: 0,
          waves: 0,
          gold: 0,
          ice: 0
        },
        tags: ['Steel', 'Industrial', 'Brushed']
      }
    ]
  },
  {
    id: 'specialty',
    name: 'Specialty',
    icon: Palette,
    color: 'text-purple-500',
    presets: [
      {
        id: 'crystal-prism',
        name: 'Crystal Prism',
        description: 'Crystalline effects with light refraction',
        category: 'specialty',
        effects: {
          holographic: 20,
          foilspray: 0,
          prizm: 70,
          chrome: 0,
          interference: 40,
          brushedmetal: 0,
          crystal: 85,
          vintage: 0,
          foil: 0,
          prismatic: 60,
          aurora: 0,
          lunar: 0,
          waves: 0,
          gold: 0,
          ice: 30
        },
        tags: ['Crystal', 'Prism', 'Refraction']
      },
      {
        id: 'vintage-classic',
        name: 'Vintage Classic',
        description: 'Aged look with subtle weathering effects',
        category: 'specialty',
        effects: {
          holographic: 0,
          foilspray: 0,
          prizm: 0,
          chrome: 0,
          interference: 0,
          brushedmetal: 0,
          crystal: 0,
          vintage: 75,
          foil: 0,
          prismatic: 0,
          aurora: 0,
          lunar: 0,
          waves: 0,
          gold: 0,
          ice: 0
        },
        tags: ['Vintage', 'Classic', 'Aged']
      }
    ]
  }
];

export const PresetSelectionStep: React.FC<PresetSelectionStepProps> = ({
  selectedPreset,
  onPresetSelect,
  onPresetPreview,
  isPreviewMode,
  onTogglePreviewMode,
  onNext
}) => {
  const [hoveredPreset, setHoveredPreset] = useState<EffectPreset | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('premium');

  const handlePresetHover = useCallback((preset: EffectPreset | null) => {
    if (isPreviewMode) {
      setHoveredPreset(preset);
      onPresetPreview(preset);
    }
  }, [isPreviewMode, onPresetPreview]);

  const handlePresetClick = useCallback((preset: EffectPreset) => {
    onPresetSelect(preset);
    if (!isPreviewMode) {
      onPresetPreview(preset);
    }
  }, [onPresetSelect, onPresetPreview, isPreviewMode]);

  const currentCategory = PRESET_CATEGORIES.find(cat => cat.id === selectedCategory);
  const canProceed = selectedPreset !== undefined;

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-white text-xl font-semibold flex items-center justify-center">
          <Sparkles className="w-5 h-5 mr-2 text-crd-green" />
          Choose Your Style
        </h3>
        <p className="text-crd-lightGray text-sm">
          Select a visual effect preset to enhance your card
        </p>
      </div>

      <div className="flex items-center justify-center">
        <Button
          onClick={onTogglePreviewMode}
          variant="outline"
          size="sm"
          className={`${
            isPreviewMode 
              ? 'bg-crd-green text-black border-crd-green' 
              : 'bg-transparent text-white border-editor-border'
          }`}
        >
          {isPreviewMode ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
          {isPreviewMode ? 'Preview Mode On' : 'Preview Mode Off'}
        </Button>
      </div>

      <div className="flex space-x-2">
        {PRESET_CATEGORIES.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-white bg-opacity-20 text-white'
                  : 'bg-transparent text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <Icon className={`w-4 h-4 mr-2 ${category.color}`} />
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Preset Grid */}
      {currentCategory && (
        <div className="grid grid-cols-1 gap-4">
          {currentCategory.presets.map((preset) => {
            const isSelected = selectedPreset?.id === preset.id;
            const isHovered = hoveredPreset?.id === preset.id;
            
            return (
              <div
                key={preset.id}
                onClick={() => handlePresetClick(preset)}
                onMouseEnter={() => handlePresetHover(preset)}
                onMouseLeave={() => handlePresetHover(null)}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-crd-green bg-crd-green bg-opacity-10'
                    : isHovered && isPreviewMode
                    ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                    : 'border-editor-border hover:border-gray-500 bg-editor-dark'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-lg mb-1">{preset.name}</h4>
                    <p className="text-crd-lightGray text-sm mb-3">{preset.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {preset.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-700 bg-opacity-50 text-gray-300 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="w-6 h-6 bg-crd-green rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                  )}
                </div>
                
                {isHovered && isPreviewMode && !isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="pt-4 border-t border-editor-border">
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="w-full bg-crd-green text-black hover:bg-crd-green/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Environment
        </Button>
        
        {selectedPreset && (
          <p className="text-center text-crd-lightGray text-xs mt-2">
            Selected: {selectedPreset.name}
          </p>
        )}
      </div>
    </div>
  );
};
