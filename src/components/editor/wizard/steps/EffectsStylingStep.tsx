
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Sparkles, Palette, Zap, Star, Chrome, Rainbow, Gem } from 'lucide-react';
import { toast } from 'sonner';
import type { DesignTemplate } from '@/hooks/useCardEditor';

interface EffectsStylingStepProps {
  selectedTemplate: DesignTemplate | null;
  selectedPhoto: string;
  onEffectsUpdate: (effects: CardEffects) => void;
  initialEffects?: CardEffects;
}

interface CardEffects {
  holographic: boolean;
  chrome: boolean;
  foil: boolean;
  vintage: boolean;
  neon: boolean;
  intensity: number;
  saturation: number;
  contrast: number;
  brightness: number;
  selectedPreset?: string;
}

const EFFECT_PRESETS = [
  {
    id: 'none',
    name: 'None',
    description: 'Clean, no effects',
    icon: <Palette className="w-4 h-4" />,
    effects: { holographic: false, chrome: false, foil: false, vintage: false, neon: false, intensity: 0, saturation: 0, contrast: 0, brightness: 0 }
  },
  {
    id: 'holographic',
    name: 'Holographic',
    description: 'Rainbow shimmer effect',
    icon: <Rainbow className="w-4 h-4" />,
    effects: { holographic: true, chrome: false, foil: false, vintage: false, neon: false, intensity: 0.7, saturation: 20, contrast: 10, brightness: 5 }
  },
  {
    id: 'chrome',
    name: 'Chrome',
    description: 'Metallic chrome finish',
    icon: <Chrome className="w-4 h-4" />,
    effects: { holographic: false, chrome: true, foil: false, vintage: false, neon: false, intensity: 0.8, saturation: -10, contrast: 20, brightness: 10 }
  },
  {
    id: 'foil',
    name: 'Foil',
    description: 'Metallic foil overlay',
    icon: <Star className="w-4 h-4" />,
    effects: { holographic: false, chrome: false, foil: true, vintage: false, neon: false, intensity: 0.6, saturation: 15, contrast: 15, brightness: 0 }
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Retro weathered look',
    icon: <Gem className="w-4 h-4" />,
    effects: { holographic: false, chrome: false, foil: false, vintage: true, neon: false, intensity: 0.5, saturation: -20, contrast: -10, brightness: -5 }
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Bright neon glow',
    icon: <Zap className="w-4 h-4" />,
    effects: { holographic: false, chrome: false, foil: false, vintage: false, neon: true, intensity: 0.9, saturation: 30, contrast: 25, brightness: 15 }
  }
];

export const EffectsStylingStep = ({
  selectedTemplate,
  selectedPhoto,
  onEffectsUpdate,
  initialEffects
}: EffectsStylingStepProps) => {
  const [effects, setEffects] = useState<CardEffects>(
    initialEffects || {
      holographic: false,
      chrome: false,
      foil: false,
      vintage: false,
      neon: false,
      intensity: 0.5,
      saturation: 0,
      contrast: 0,
      brightness: 0,
      selectedPreset: 'none'
    }
  );

  const updateEffects = (newEffects: Partial<CardEffects>) => {
    const updatedEffects = { ...effects, ...newEffects };
    setEffects(updatedEffects);
    onEffectsUpdate(updatedEffects);
  };

  const applyPreset = (preset: typeof EFFECT_PRESETS[0]) => {
    const newEffects = { ...preset.effects, selectedPreset: preset.id };
    setEffects(newEffects);
    onEffectsUpdate(newEffects);
    toast.success(`${preset.name} effect applied!`);
  };

  const toggleEffect = (effectName: keyof CardEffects) => {
    if (typeof effects[effectName] === 'boolean') {
      updateEffects({ [effectName]: !effects[effectName], selectedPreset: 'custom' });
    }
  };

  const handleSliderChange = (property: keyof CardEffects, value: number[]) => {
    updateEffects({ [property]: value[0], selectedPreset: 'custom' });
  };

  const getPreviewStyle = () => {
    const style: React.CSSProperties = {
      filter: `
        saturate(${100 + effects.saturation}%) 
        contrast(${100 + effects.contrast}%) 
        brightness(${100 + effects.brightness}%)
      `.trim(),
      transition: 'all 0.3s ease'
    };

    return style;
  };

  const getEffectOverlayClass = () => {
    if (effects.holographic) return 'holographic-overlay';
    if (effects.chrome) return 'chrome-effect';
    if (effects.foil) return 'foil-effect';
    if (effects.neon) return 'neon-effect';
    if (effects.vintage) return 'vintage-effect';
    return '';
  };

  if (!selectedPhoto || !selectedTemplate) {
    return (
      <div className="text-center py-12">
        <p className="text-crd-lightGray">Please complete previous steps first</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Live Preview */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Effects Preview</h3>
          <p className="text-crd-lightGray">See how effects transform your card</p>
        </div>

        <div className="flex justify-center">
          <div className="relative">
            {/* Card Preview */}
            <div 
              className="w-80 h-112 rounded-lg shadow-xl border-2 border-gray-300 overflow-hidden relative"
              style={{ 
                backgroundColor: selectedTemplate.template_data.colors.background,
                ...getPreviewStyle()
              }}
            >
              {/* Template content */}
              <div 
                className="absolute top-4 left-4 right-4 h-8 rounded flex items-center justify-center"
                style={{ backgroundColor: selectedTemplate.template_data.colors.primary }}
              >
                <span className="text-white text-sm font-bold">CARD TITLE</span>
              </div>
              
              <div 
                className="absolute left-4 right-4 rounded overflow-hidden"
                style={{ 
                  top: '60px',
                  height: '200px'
                }}
              >
                <img 
                  src={selectedPhoto}
                  alt="Card preview"
                  className="w-full h-full object-cover"
                  style={getPreviewStyle()}
                />
              </div>
              
              <div 
                className="absolute bottom-4 left-4 right-4 h-6 rounded flex items-center justify-center"
                style={{ backgroundColor: selectedTemplate.template_data.colors.accent }}
              >
                <span className="text-black text-xs">CARD STATS</span>
              </div>

              {/* Effect Overlay */}
              {getEffectOverlayClass() && (
                <div 
                  className={`absolute inset-0 pointer-events-none ${getEffectOverlayClass()}`}
                  style={{ opacity: effects.intensity }}
                />
              )}
            </div>

            {/* Effect indicator */}
            {effects.selectedPreset && effects.selectedPreset !== 'none' && (
              <div className="absolute top-2 right-2 bg-crd-green text-black px-2 py-1 rounded-md text-xs font-medium">
                {EFFECT_PRESETS.find(p => p.id === effects.selectedPreset)?.name || 'Custom'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Effects Controls */}
      <div className="space-y-6">
        <Card className="bg-crd-darkGray border-crd-mediumGray/30">
          <CardContent className="p-6 space-y-6">
            <div>
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Effect Presets
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                {EFFECT_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset)}
                    className={`p-3 rounded-lg border transition-all text-left ${
                      effects.selectedPreset === preset.id
                        ? 'border-crd-green bg-crd-green/10 text-white'
                        : 'border-crd-mediumGray bg-crd-mediumGray/10 text-crd-lightGray hover:border-crd-green hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {preset.icon}
                      <span className="font-medium text-sm">{preset.name}</span>
                    </div>
                    <p className="text-xs opacity-75">{preset.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-3">Individual Effects</h4>
              
              <div className="space-y-3">
                {[
                  { key: 'holographic', label: 'Holographic', icon: <Rainbow className="w-4 h-4" /> },
                  { key: 'chrome', label: 'Chrome', icon: <Chrome className="w-4 h-4" /> },
                  { key: 'foil', label: 'Foil', icon: <Star className="w-4 h-4" /> },
                  { key: 'vintage', label: 'Vintage', icon: <Gem className="w-4 h-4" /> },
                  { key: 'neon', label: 'Neon', icon: <Zap className="w-4 h-4" /> }
                ].map((effect) => (
                  <label
                    key={effect.key}
                    className="flex items-center space-x-3 p-2 rounded hover:bg-crd-mediumGray/20 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={effects[effect.key as keyof CardEffects] as boolean}
                      onChange={() => toggleEffect(effect.key as keyof CardEffects)}
                      className="w-4 h-4 text-crd-green"
                    />
                    {effect.icon}
                    <span className="text-white">{effect.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-3">Fine Tuning</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-crd-lightGray mb-2 block">
                    Effect Intensity: {Math.round(effects.intensity * 100)}%
                  </label>
                  <Slider
                    value={[effects.intensity]}
                    onValueChange={(value) => handleSliderChange('intensity', value)}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm text-crd-lightGray mb-2 block">
                    Saturation: {effects.saturation > 0 ? '+' : ''}{effects.saturation}%
                  </label>
                  <Slider
                    value={[effects.saturation]}
                    onValueChange={(value) => handleSliderChange('saturation', value)}
                    min={-50}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm text-crd-lightGray mb-2 block">
                    Contrast: {effects.contrast > 0 ? '+' : ''}{effects.contrast}%
                  </label>
                  <Slider
                    value={[effects.contrast]}
                    onValueChange={(value) => handleSliderChange('contrast', value)}
                    min={-30}
                    max={30}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm text-crd-lightGray mb-2 block">
                    Brightness: {effects.brightness > 0 ? '+' : ''}{effects.brightness}%
                  </label>
                  <Slider
                    value={[effects.brightness]}
                    onValueChange={(value) => handleSliderChange('brightness', value)}
                    min={-20}
                    max={20}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-crd-green/10 border border-crd-green/30 rounded-lg p-4">
          <h4 className="text-crd-green font-medium mb-2">Effect Tips</h4>
          <ul className="text-sm text-crd-lightGray space-y-1">
            <li>• Holographic works best with portrait photos</li>
            <li>• Chrome enhances action shots</li>
            <li>• Vintage gives character to older photos</li>
            <li>• Use intensity to control effect strength</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
