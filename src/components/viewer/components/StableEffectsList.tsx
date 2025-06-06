
import React from 'react';
import { Label } from '@/components/ui/label';
import { ColoredSlider } from './ColoredSlider';
import { ENHANCED_VISUAL_EFFECTS } from '../hooks/useEnhancedCardEffects';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { cn } from '@/lib/utils';

interface StableEffectsListProps {
  effectValues: EffectValues;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  selectedPresetId?: string;
}

export const StableEffectsList: React.FC<StableEffectsListProps> = ({
  effectValues,
  onEffectChange,
  selectedPresetId
}) => {
  // Get all available effects from the current preset
  const getEffectsFromPreset = () => {
    if (!selectedPresetId) return [];
    
    const currentEffects = effectValues || {};
    return Object.keys(currentEffects).filter(effectId => {
      const effect = currentEffects[effectId];
      return effect && typeof effect.intensity === 'number';
    });
  };

  const relevantEffects = getEffectsFromPreset();

  if (relevantEffects.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-crd-lightGray text-sm">Select a style to see effects</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {relevantEffects.map((effectId) => {
        const effectConfig = ENHANCED_VISUAL_EFFECTS[effectId];
        const effectData = effectValues[effectId] || { intensity: 0 };
        const intensity = typeof effectData.intensity === 'number' ? effectData.intensity : 0;
        const isActive = intensity > 0;

        if (!effectConfig) return null;

        return (
          <div 
            key={effectId} 
            className={cn(
              "border border-white/10 rounded-lg p-3 transition-all",
              isActive ? "bg-white/5 border-white/20" : "bg-transparent opacity-60"
            )}
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 flex-1">
                <span className={cn(
                  "text-sm font-medium min-w-[80px]",
                  effectConfig.color || "text-crd-lightGray"
                )}>
                  {effectConfig.name}
                </span>
                <div className="flex-1">
                  <ColoredSlider
                    value={[intensity]}
                    onValueChange={(value) => onEffectChange(effectId, 'intensity', value[0])}
                    min={0}
                    max={100}
                    step={1}
                    color="green"
                    variant="primary"
                  />
                </div>
                <span className="text-xs text-gray-400 w-8 text-right">{intensity}</span>
              </div>
            </div>

            {/* Show additional parameters if they exist and effect is active */}
            {isActive && effectConfig.parameters && Object.keys(effectConfig.parameters).length > 1 && (
              <div className="mt-2 space-y-2 pl-2 border-l border-white/10">
                {Object.entries(effectConfig.parameters).map(([paramId, paramConfig]) => {
                  if (paramId === 'intensity') return null;
                  
                  const value = typeof effectData[paramId] === 'number' ? effectData[paramId] : paramConfig.min;
                  
                  return (
                    <div key={paramId} className="flex items-center space-x-2">
                      <Label className="text-xs w-16 text-right text-crd-lightGray/70">
                        {paramConfig.label}
                      </Label>
                      <div className="flex-1">
                        <ColoredSlider
                          value={[value]}
                          onValueChange={(newValue) => onEffectChange(effectId, paramId, newValue[0])}
                          min={paramConfig.min}
                          max={paramConfig.max}
                          step={paramConfig.step}
                          color="green"
                          variant="secondary"
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-6 text-right">{value}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
