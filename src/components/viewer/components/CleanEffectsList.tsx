
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ChevronDown, Settings } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ColoredSlider } from './ColoredSlider';
import { ENHANCED_VISUAL_EFFECTS } from '../hooks/useEnhancedCardEffects';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { cn } from '@/lib/utils';

interface CleanEffectsListProps {
  effectValues: EffectValues;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  selectedPresetId?: string;
}

export const CleanEffectsList: React.FC<CleanEffectsListProps> = ({
  effectValues,
  onEffectChange,
  selectedPresetId
}) => {
  const [openPopovers, setOpenPopovers] = useState<Set<string>>(new Set());

  const togglePopover = (effectId: string) => {
    const newOpen = new Set(openPopovers);
    if (newOpen.has(effectId)) {
      newOpen.delete(effectId);
    } else {
      newOpen.add(effectId);
    }
    setOpenPopovers(newOpen);
  };

  // Get all available effects from the current preset
  const getRelevantEffects = () => {
    if (!selectedPresetId) return [];
    
    const currentEffects = effectValues || {};
    return Object.keys(currentEffects).filter(effectId => {
      const effect = currentEffects[effectId];
      return effect && typeof effect.intensity === 'number';
    });
  };

  const relevantEffects = getRelevantEffects();

  if (relevantEffects.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-crd-lightGray text-sm">Select a style to see effects</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {relevantEffects.map((effectId) => {
        const effectConfig = ENHANCED_VISUAL_EFFECTS.find(e => e.id === effectId);
        const effectData = effectValues[effectId] || { intensity: 0 };
        const intensity = typeof effectData.intensity === 'number' ? effectData.intensity : 0;
        const isActive = intensity > 0;
        const hasSecondaryParams = effectConfig?.parameters && effectConfig.parameters.length > 1;

        if (!effectConfig) return null;

        return (
          <div 
            key={effectId} 
            className={cn(
              "border border-white/10 rounded-lg p-3 transition-all bg-white/5",
              isActive ? "border-white/20" : "opacity-70"
            )}
          >
            {/* Main effect row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <span className="text-sm font-medium min-w-[90px] text-left text-white">
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

              {/* Settings button for secondary controls */}
              {hasSecondaryParams && isActive && (
                <Popover 
                  open={openPopovers.has(effectId)}
                  onOpenChange={() => togglePopover(effectId)}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 ml-2 text-gray-400 hover:text-white"
                    >
                      <Settings className="w-3 h-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-80 bg-gray-900 border-gray-700" 
                    side="left"
                    align="start"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 border-b border-gray-700 pb-2">
                        <span className="font-medium text-white">{effectConfig.name}</span>
                        <span className="text-xs text-gray-400">Advanced Settings</span>
                      </div>
                      
                      {effectConfig.parameters.map((param) => {
                        if (param.id === 'intensity') return null;
                        
                        const value = typeof effectData[param.id] === 'number' ? effectData[param.id] : param.defaultValue;
                        
                        if (param.type !== 'slider') return null;
                        
                        return (
                          <div key={param.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label className="text-sm text-white">{param.name}</Label>
                              <span className="text-xs text-gray-400">{value}</span>
                            </div>
                            <ColoredSlider
                              value={[Number(value)]}
                              onValueChange={(newValue) => onEffectChange(effectId, param.id, newValue[0])}
                              min={param.min || 0}
                              max={param.max || 100}
                              step={param.step || 1}
                              color="green"
                              variant="secondary"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
