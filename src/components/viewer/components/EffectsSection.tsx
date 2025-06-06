
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sparkles, ChevronDown, ChevronRight } from 'lucide-react';
import { ColoredSlider } from './ColoredSlider';
import { ENHANCED_VISUAL_EFFECTS } from '../hooks/useEnhancedCardEffects';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface EffectsSectionProps {
  effectValues: EffectValues;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onResetAllEffects: () => void;
}

// Dynamic effect configurations from the main config
const getEffectConfig = (effectId: string) => {
  const effect = ENHANCED_VISUAL_EFFECTS.find(e => e.id === effectId);
  if (!effect) return null;
  
  // Map categories to colors
  const categoryColors = {
    prismatic: { color: 'text-purple-400', sliderColor: 'purple' },
    metallic: { color: 'text-yellow-400', sliderColor: 'yellow' },
    surface: { color: 'text-blue-400', sliderColor: 'blue' },
    vintage: { color: 'text-amber-400', sliderColor: 'amber' }
  };
  
  const categoryConfig = categoryColors[effect.category] || { color: 'text-gray-400', sliderColor: 'gray' };
  
  return {
    name: effect.name,
    ...categoryConfig,
    parameters: effect.parameters.reduce((acc, param) => {
      acc[param.id] = {
        label: param.name,
        min: param.min || 0,
        max: param.max || 100,
        step: param.step || 1
      };
      return acc;
    }, {} as Record<string, any>)
  };
};

export const EffectsSection: React.FC<EffectsSectionProps> = ({
  effectValues,
  onEffectChange,
  onResetAllEffects
}) => {
  const [expandedEffects, setExpandedEffects] = useState<Set<string>>(new Set());

  const toggleEffectExpanded = useCallback((effectId: string) => {
    setExpandedEffects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(effectId)) {
        newSet.delete(effectId);
      } else {
        newSet.add(effectId);
      }
      return newSet;
    });
  }, []);

  const getActiveEffectsCount = () => {
    return Object.values(effectValues).filter(effect => {
      const intensity = effect.intensity;
      return typeof intensity === 'number' && intensity > 0;
    }).length;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-medium flex items-center">
          <Sparkles className="w-4 h-4 text-crd-green mr-2" />
          Enhanced Effects ({getActiveEffectsCount()})
        </h3>
        <Button variant="ghost" size="sm" onClick={onResetAllEffects} className="text-red-400 hover:text-red-300">
          Reset All
        </Button>
      </div>
      
      <div className="space-y-2">
        {ENHANCED_VISUAL_EFFECTS.map((effect) => {
          const config = getEffectConfig(effect.id);
          if (!config) return null;
          
          const effectData = effectValues[effect.id] || { intensity: 0 };
          const intensity = typeof effectData.intensity === 'number' ? effectData.intensity : 0;
          const isExpanded = expandedEffects.has(effect.id);
          const isActive = intensity > 0;
          const hasSecondaryParams = Object.keys(config.parameters).length > 1;
          
          return (
            <div key={effect.id} className={`border border-white/10 rounded-lg p-3 ${isActive ? 'bg-white/5' : 'bg-transparent'}`}>
              {/* Title and Intensity Slider on one line */}
              <div className="flex items-center space-x-3 mb-2">
                <div className="flex items-center space-x-2 flex-1">
                  <span className={`text-sm font-medium ${config.color} min-w-[90px]`}>
                    {config.name}
                  </span>
                  <div className="flex-1">
                    <ColoredSlider
                      value={[intensity]}
                      onValueChange={(value) => onEffectChange(effect.id, 'intensity', value[0])}
                      min={0}
                      max={100}
                      step={1}
                      color={config.sliderColor}
                      variant="primary"
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right">{intensity}</span>
                </div>
                
                {/* Expand/Collapse button - only show if effect has parameters beyond intensity */}
                {hasSecondaryParams && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleEffectExpanded(effect.id)}
                    className="p-1 h-6 w-6 text-gray-400 hover:text-white"
                  >
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </Button>
                )}
              </div>

              {/* Collapsible additional parameters */}
              {isExpanded && hasSecondaryParams && (
                <div className="space-y-2 pl-2 border-l border-white/10">
                  {Object.entries(config.parameters).map(([paramId, paramConfig]) => {
                    if (paramId === 'intensity') return null; // Skip intensity as it's already shown above
                    
                    const value = typeof effectData[paramId] === 'number' ? effectData[paramId] : paramConfig.min;
                    
                    return (
                      <div key={paramId} className="flex items-center space-x-2">
                        <Label className={`text-xs w-20 text-right text-${config.sliderColor}-400/70`}>
                          {paramConfig.label}
                        </Label>
                        <div className="flex-1">
                          <ColoredSlider
                            value={[value]}
                            onValueChange={(newValue) => onEffectChange(effect.id, paramId, newValue[0])}
                            min={paramConfig.min}
                            max={paramConfig.max}
                            step={paramConfig.step}
                            color={config.sliderColor}
                            variant="secondary"
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-8 text-right">{value}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
