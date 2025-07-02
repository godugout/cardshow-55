import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChevronLeft, Sparkles, Palette, Zap } from 'lucide-react';

interface EffectsPhaseProps {
  appliedEffects: Record<string, any>;
  cardData: any;
  onEffectsApplied: (effects: Record<string, any>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

interface EffectControl {
  id: string;
  name: string;
  type: 'slider' | 'toggle' | 'color';
  icon: React.ReactNode;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: any;
  description: string;
}

const effectControls: EffectControl[] = [
  {
    id: 'holographic',
    name: 'Holographic',
    type: 'toggle',
    icon: <Sparkles className="w-4 h-4" />,
    defaultValue: false,
    description: 'Add shimmering holographic effect',
  },
  {
    id: 'holographicIntensity',
    name: 'Holographic Intensity',
    type: 'slider',
    icon: <Zap className="w-4 h-4" />,
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
    description: 'Control the intensity of holographic effect',
  },
  {
    id: 'foilIntensity',
    name: 'Foil Effect',
    type: 'slider',
    icon: <Palette className="w-4 h-4" />,
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 0,
    description: 'Add metallic foil shimmer',
  },
  {
    id: 'prizmIntensity',
    name: 'Prizm Effect',
    type: 'slider',
    icon: <Sparkles className="w-4 h-4" />,
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 0,
    description: 'Create rainbow prismatic effects',
  },
  {
    id: 'brightness',
    name: 'Brightness',
    type: 'slider',
    icon: <Zap className="w-4 h-4" />,
    min: 50,
    max: 150,
    step: 1,
    defaultValue: 100,
    description: 'Adjust overall brightness',
  },
  {
    id: 'contrast',
    name: 'Contrast',
    type: 'slider',
    icon: <Palette className="w-4 h-4" />,
    min: 50,
    max: 150,
    step: 1,
    defaultValue: 100,
    description: 'Enhance contrast levels',
  },
  {
    id: 'saturation',
    name: 'Saturation',
    type: 'slider',
    icon: <Palette className="w-4 h-4" />,
    min: 0,
    max: 200,
    step: 1,
    defaultValue: 100,
    description: 'Control color intensity',
  },
];

export const EffectsPhase: React.FC<EffectsPhaseProps> = ({
  appliedEffects,
  cardData,
  onEffectsApplied,
  onNext,
  onPrevious,
}) => {
  const [effects, setEffects] = useState<Record<string, any>>(() => {
    const initialEffects: Record<string, any> = {};
    effectControls.forEach(control => {
      initialEffects[control.id] = appliedEffects[control.id] ?? control.defaultValue;
    });
    return initialEffects;
  });

  const handleEffectChange = (effectId: string, value: any) => {
    const newEffects = { ...effects, [effectId]: value };
    setEffects(newEffects);
    onEffectsApplied(newEffects);
  };

  const resetEffects = () => {
    const resetEffects: Record<string, any> = {};
    effectControls.forEach(control => {
      resetEffects[control.id] = control.defaultValue;
    });
    setEffects(resetEffects);
    onEffectsApplied(resetEffects);
  };

  const renderEffectControl = (control: EffectControl) => {
    const value = effects[control.id];

    switch (control.type) {
      case 'toggle':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={control.id}
              checked={value}
              onCheckedChange={(checked) => handleEffectChange(control.id, checked)}
            />
            <Label htmlFor={control.id} className="text-white cursor-pointer">
              {control.name}
            </Label>
          </div>
        );

      case 'slider':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-white">{control.name}</Label>
              <span className="text-sm text-gray-400">{value}%</span>
            </div>
            <Slider
              value={[value]}
              onValueChange={([newValue]) => handleEffectChange(control.id, newValue)}
              min={control.min}
              max={control.max}
              step={control.step}
              className="w-full"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Apply Effects</h2>
        <p className="text-gray-400">
          Enhance your card with special effects and adjustments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Effects Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Effect Controls</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={resetEffects}
              className="text-gray-400"
            >
              Reset All
            </Button>
          </div>

          {effectControls.map(control => (
            <Card key={control.id} className="p-4 bg-crd-dark border-crd-border">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1 text-crd-green">
                  {control.icon}
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <div className="text-sm text-gray-400 mb-2">
                      {control.description}
                    </div>
                    {renderEffectControl(control)}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Live Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Live Preview</h3>
          <Card className="aspect-[3/4] bg-gradient-to-br from-crd-dark to-crd-darker border-crd-border overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <div 
                className="w-32 h-32 bg-crd-border rounded-lg flex items-center justify-center transition-all duration-300"
                style={{
                  filter: `brightness(${effects.brightness}%) contrast(${effects.contrast}%) saturate(${effects.saturation}%)`,
                  opacity: effects.holographic ? 0.9 : 1,
                  background: effects.holographic 
                    ? 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7)'
                    : undefined,
                  backgroundSize: effects.holographic ? '200% 200%' : undefined,
                  animation: effects.holographic ? 'gradient 3s ease infinite' : undefined,
                }}
              >
                <span className="text-gray-400 text-xs text-center">
                  Effect<br/>Preview
                </span>
              </div>
            </div>
          </Card>

          {/* Effects Summary */}
          <Card className="p-4 bg-crd-dark border-crd-border">
            <h4 className="text-sm font-medium text-white mb-2">Active Effects</h4>
            <div className="space-y-1">
              {Object.entries(effects).map(([key, value]) => {
                const control = effectControls.find(c => c.id === key);
                if (!control || (control.type === 'toggle' && !value) || (control.type === 'slider' && value === control.defaultValue)) {
                  return null;
                }
                return (
                  <div key={key} className="text-xs text-gray-400 flex justify-between">
                    <span>{control.name}</span>
                    <span>{control.type === 'toggle' ? 'ON' : `${value}%`}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-4">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Frames</span>
        </Button>
        
        <Button
          onClick={onNext}
          className="bg-crd-green text-black hover:bg-crd-green/90"
        >
          Continue to Preview
        </Button>
      </div>

    </div>
  );
};