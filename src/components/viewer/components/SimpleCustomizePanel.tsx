
import React from 'react';
import { X, Sparkles, Sun, Sliders } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { SimpleEffectValues } from '../hooks/useSimpleCardEffects';
import type { LightingPreset } from '../types';
import { LIGHTING_PRESETS } from '../constants/lightingPresets';

interface SimpleCustomizePanelProps {
  isVisible: boolean;
  onClose: () => void;
  effectValues: SimpleEffectValues;
  onEffectChange: (effectId: keyof SimpleEffectValues, value: number) => void;
  selectedLighting: LightingPreset;
  onLightingChange: (lighting: LightingPreset) => void;
  overallBrightness: number[];
  onBrightnessChange: (value: number[]) => void;
  interactiveLighting: boolean;
  onInteractiveLightingToggle: () => void;
  onResetEffects: () => void;
}

const EFFECTS_CONFIG = [
  { id: 'holographic', name: 'Holographic', description: 'Rainbow shimmer effect' },
  { id: 'chrome', name: 'Chrome', description: 'Mirror-like finish' },
  { id: 'gold', name: 'Gold', description: 'Metallic gold shine' },
  { id: 'aurora', name: 'Starlight', description: 'Twinkling starlight effect' },
  { id: 'crystal', name: 'Crystal', description: 'Diamond-like sparkle' },
  { id: 'vintage', name: 'Vintage', description: 'Aged paper texture' },
  { id: 'foilspray', name: 'Foil Spray', description: 'Metallic spray pattern' },
  { id: 'prizm', name: 'Prizm', description: 'Prismatic light effect' },
  { id: 'interference', name: 'Interference', description: 'Oil slick pattern' },
  { id: 'brushedmetal', name: 'Brushed Metal', description: 'Brushed aluminum finish' },
  { id: 'ice', name: 'Ice', description: 'Frozen ice texture' },
  { id: 'lunar', name: 'Lunar', description: 'Moon dust effect' },
  { id: 'waves', name: 'Waves', description: 'Rippling wave motion' }
] as const;

export const SimpleCustomizePanel: React.FC<SimpleCustomizePanelProps> = ({
  isVisible,
  onClose,
  effectValues,
  onEffectChange,
  selectedLighting,
  onLightingChange,
  overallBrightness,
  onBrightnessChange,
  interactiveLighting,
  onInteractiveLightingToggle,
  onResetEffects
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-0 right-0 w-80 h-full bg-black bg-opacity-95 backdrop-blur-lg border-l border-white/10 z-50 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-green-400" />
          <span>Customize</span>
        </h2>
        <button 
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center text-white hover:text-gray-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="effects" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900 border-b border-white/10 mx-4 mt-4">
            <TabsTrigger value="effects" className="text-white data-[state=active]:bg-green-600">
              <Sliders className="w-4 h-4 mr-2" />
              Effects
            </TabsTrigger>
            <TabsTrigger value="lighting" className="text-white data-[state=active]:bg-green-600">
              <Sun className="w-4 h-4 mr-2" />
              Lighting
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="effects" className="flex-1 p-4 overflow-y-auto space-y-4">
            {/* Reset Button */}
            <Button 
              onClick={onResetEffects}
              variant="outline"
              className="w-full border-gray-600 text-white hover:bg-gray-700"
            >
              Reset All Effects
            </Button>

            {/* Effects List */}
            <div className="space-y-4">
              {EFFECTS_CONFIG.map((effect) => (
                <div key={effect.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <label className="text-white text-sm font-medium">{effect.name}</label>
                      <p className="text-gray-400 text-xs">{effect.description}</p>
                    </div>
                    <span className="text-green-400 text-sm font-medium">
                      {effectValues[effect.id as keyof SimpleEffectValues]}%
                    </span>
                  </div>
                  <Slider
                    value={[effectValues[effect.id as keyof SimpleEffectValues]]}
                    onValueChange={([value]) => onEffectChange(effect.id as keyof SimpleEffectValues, value)}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="lighting" className="flex-1 p-4 overflow-y-auto space-y-4">
            {/* Brightness Control */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-white text-sm font-medium">Overall Brightness</label>
                <span className="text-green-400 text-sm font-medium">{overallBrightness[0]}%</span>
              </div>
              <Slider
                value={overallBrightness}
                onValueChange={onBrightnessChange}
                min={50}
                max={200}
                step={5}
                className="w-full"
              />
            </div>

            {/* Interactive Lighting Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-medium">Interactive Lighting</span>
              <button
                onClick={onInteractiveLightingToggle}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  interactiveLighting ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                }`}
              >
                {interactiveLighting ? 'On' : 'Off'}
              </button>
            </div>

            {/* Lighting Presets */}
            <div className="space-y-2">
              <h4 className="text-white font-medium text-sm">Lighting Presets</h4>
              <div className="space-y-2">
                {LIGHTING_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onLightingChange(preset)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedLighting.id === preset.id 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-medium text-sm">{preset.name}</div>
                    <div className="text-xs opacity-75">{preset.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
