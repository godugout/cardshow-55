
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Sun, Moon, Lightbulb, Zap } from 'lucide-react';

interface LightingTabProps {
  lighting: {
    environment: string;
    preset: string;
    ambient: number;
    directional: number;
    colorTemp: number;
    interactive: boolean;
  };
  onUpdate: (lighting: LightingTabProps['lighting']) => void;
}

const LIGHTING_PRESETS = [
  { id: 'natural', name: 'Natural', icon: Sun, description: 'Daylight balanced' },
  { id: 'dramatic', name: 'Dramatic', icon: Moon, description: 'High contrast lighting' },
  { id: 'soft', name: 'Soft Studio', icon: Lightbulb, description: 'Even, diffused light' },
  { id: 'vibrant', name: 'Vibrant', icon: Zap, description: 'Enhanced colors' }
];

export const LightingTab = ({ lighting, onUpdate }: LightingTabProps) => {
  const updateProperty = (property: keyof typeof lighting, value: number | string | boolean) => {
    onUpdate({ ...lighting, [property]: value });
  };

  const applyPreset = (presetId: string) => {
    const presetValues = {
      natural: { ambient: 50, directional: 70, colorTemp: 5500 },
      dramatic: { ambient: 20, directional: 90, colorTemp: 4000 },
      soft: { ambient: 70, directional: 40, colorTemp: 6000 },
      vibrant: { ambient: 60, directional: 80, colorTemp: 6500 }
    };
    
    const values = presetValues[presetId as keyof typeof presetValues];
    if (values) {
      onUpdate({ ...lighting, preset: presetId, ...values });
    }
  };

  return (
    <div className="space-y-6">
      {/* Lighting Presets */}
      <div>
        <h4 className="text-white font-medium mb-3">Lighting Presets</h4>
        <div className="space-y-2">
          {LIGHTING_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isActive = lighting.preset === preset.id;
            
            return (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                className={`w-full p-2 rounded border text-left transition-all ${
                  isActive
                    ? 'border-crd-green bg-crd-green/10 text-white'
                    : 'border-crd-mediumGray bg-crd-mediumGray/10 text-crd-lightGray hover:border-crd-green hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{preset.name}</span>
                </div>
                <p className="text-xs opacity-75">{preset.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual Controls */}
      <div className="space-y-4">
        <h4 className="text-white font-medium">Manual Controls</h4>
        
        <div className="space-y-3">
          <div>
            <Label className="text-sm text-crd-lightGray mb-2 block">
              Ambient Light: {lighting.ambient}%
            </Label>
            <Slider
              value={[lighting.ambient]}
              onValueChange={([value]) => updateProperty('ambient', value)}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm text-crd-lightGray mb-2 block">
              Directional Light: {lighting.directional}%
            </Label>
            <Slider
              value={[lighting.directional]}
              onValueChange={([value]) => updateProperty('directional', value)}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm text-crd-lightGray mb-2 block">
              Color Temperature: {lighting.colorTemp}K
            </Label>
            <Slider
              value={[lighting.colorTemp]}
              onValueChange={([value]) => updateProperty('colorTemp', value)}
              min={3000}
              max={8000}
              step={100}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Interactive Lighting */}
      <div className="flex items-center justify-between p-3 bg-crd-mediumGray/20 rounded-lg">
        <div>
          <Label className="text-white font-medium">Interactive Lighting</Label>
          <p className="text-xs text-crd-lightGray">Follow mouse movement</p>
        </div>
        <Button
          onClick={() => updateProperty('interactive', !lighting.interactive)}
          variant="outline"
          size="sm"
          className={`${
            lighting.interactive
              ? 'bg-crd-green text-black border-crd-green'
              : 'bg-transparent text-white border-crd-mediumGray'
          }`}
        >
          {lighting.interactive ? 'On' : 'Off'}
        </Button>
      </div>
    </div>
  );
};
