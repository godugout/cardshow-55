
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ENHANCED_COMBO_PRESETS } from './presets/enhancedComboPresets';
import { Check, Sparkles } from 'lucide-react';
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
  const categories = ['All', 'Premium', 'Metallic', 'Atmospheric', 'Specialty', 'Classic'];
  
  const filteredPresets = selectedCategory === 'All' 
    ? ENHANCED_COMBO_PRESETS 
    : ENHANCED_COMBO_PRESETS.filter(preset => preset.category === selectedCategory);

  const handlePresetClick = (preset: any) => {
    if (isApplyingPreset) return;
    
    onPresetSelect(preset.id);
    onApplyCombo(preset);
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-crd-green" />
            <h4 className="text-white font-medium text-sm">Quick Styles</h4>
          </div>
        </div>

        {/* Category Filter */}
        {onCategoryChange && (
          <div className="flex flex-wrap gap-1">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => onCategoryChange(category)}
                variant="ghost"
                size="sm"
                className={`h-6 px-2 text-xs ${
                  selectedCategory === category
                    ? 'bg-crd-green text-black'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {/* Preset Grid */}
        <div className="grid grid-cols-2 gap-2">
          {filteredPresets.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            const IconComponent = preset.icon;
            
            return (
              <Tooltip key={preset.id}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => handlePresetClick(preset)}
                    disabled={isApplyingPreset && !isSelected}
                    variant="ghost"
                    className={`h-auto p-3 flex flex-col items-center space-y-2 border-2 transition-all relative ${
                      isSelected 
                        ? 'border-crd-green bg-crd-green/20 shadow-lg' 
                        : 'border-editor-border hover:border-crd-green/50 hover:bg-white/5'
                    } ${isApplyingPreset && !isSelected ? 'opacity-30' : ''}`}
                  >
                    {/* Emoji & Icon */}
                    <div className="flex items-center space-x-1">
                      <span className="text-lg">{preset.emoji}</span>
                      <IconComponent className={`w-3 h-3 ${
                        isSelected ? 'text-crd-green' : 'text-gray-400'
                      }`} />
                    </div>
                    
                    {/* Name */}
                    <span className={`text-xs font-medium text-center leading-tight ${
                      isSelected ? 'text-white' : 'text-gray-300'
                    }`}>
                      {preset.name}
                    </span>
                    
                    {/* Category Badge */}
                    <Badge 
                      variant="outline" 
                      className="text-xs px-1 py-0 h-4 border-gray-600 text-gray-400"
                    >
                      {preset.category}
                    </Badge>
                    
                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-crd-green rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-black" />
                      </div>
                    )}
                    
                    {/* Applying Indicator */}
                    {isApplyingPreset && isSelected && (
                      <div className="absolute top-1 left-1 w-2 h-2 bg-crd-green rounded-full animate-pulse" />
                    )}
                  </Button>
                </TooltipTrigger>
                
                <TooltipContent side="right" className="bg-black border-gray-700 text-white max-w-64">
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
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};
