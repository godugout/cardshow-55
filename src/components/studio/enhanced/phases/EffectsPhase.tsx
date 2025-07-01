
import React, { useState } from 'react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Palette, 
  Sun, 
  Contrast, 
  Droplets, 
  Zap,
  Crown,
  Diamond,
  Flame,
  Star
} from 'lucide-react';
import { toast } from 'sonner';
import type { CardData } from '@/hooks/useCardEditor';

interface EffectsPhaseProps {
  cardEditor: {
    cardData: CardData;
    updateDesignMetadata: (key: string, value: any) => void;
  };
  onComplete: () => void;
}

interface EffectSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  holographic: boolean;
  holographicIntensity: number;
  refractor: boolean;
  refractorIntensity: number;
  foil: boolean;
  foilIntensity: number;
  prizm: boolean;
  prizmIntensity: number;
  rainbow: boolean;
  rainbowIntensity: number;
  chrome: boolean;
  chromeIntensity: number;
  gold: boolean;
  goldIntensity: number;
  black: boolean;
  blackIntensity: number;
}

export const EffectsPhase = ({ cardEditor, onComplete }: EffectsPhaseProps) => {
  const [effects, setEffects] = useState<EffectSettings>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    holographic: false,
    holographicIntensity: 50,
    refractor: false,
    refractorIntensity: 50,
    foil: false,
    foilIntensity: 50,
    prizm: false,
    prizmIntensity: 50,
    rainbow: false,
    rainbowIntensity: 50,
    chrome: false,
    chromeIntensity: 50,
    gold: false,
    goldIntensity: 50,
    black: false,
    blackIntensity: 50
  });

  const updateEffect = (key: keyof EffectSettings, value: number | boolean) => {
    const newEffects = { ...effects, [key]: value };
    setEffects(newEffects);
    cardEditor.updateDesignMetadata('effects', newEffects);
  };

  const handleContinue = () => {
    toast.success('Effects applied successfully!');
    onComplete();
  };

  const advancedEffects = [
    {
      id: 'holographic',
      name: 'Holographic',
      description: 'Shimmering rainbow effect',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      premium: false
    },
    {
      id: 'refractor',
      name: 'Refractor',
      description: 'Light-bending prismatic effect',
      icon: Diamond,
      color: 'from-blue-500 to-cyan-500',
      premium: true
    },
    {
      id: 'foil',
      name: 'Foil',
      description: 'Metallic foil finish',
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
      premium: false
    },
    {
      id: 'prizm',
      name: 'Prizm',
      description: 'Multi-colored prismatic shine',
      icon: Zap,
      color: 'from-green-500 to-blue-500',
      premium: true
    },
    {
      id: 'rainbow',
      name: 'Rainbow',
      description: 'Vibrant rainbow shimmer',
      icon: Palette,
      color: 'from-red-500 via-yellow-500 to-green-500',
      premium: false
    },
    {
      id: 'chrome',
      name: 'Chrome',
      description: 'Mirror-like chrome finish',
      icon: Crown,
      color: 'from-gray-400 to-gray-600',
      premium: true
    },
    {
      id: 'gold',
      name: 'Gold',
      description: 'Luxurious gold foil',
      icon: Crown,
      color: 'from-yellow-400 to-yellow-600',
      premium: true
    },
    {
      id: 'black',
      name: 'Black',
      description: 'Deep black premium finish',
      icon: Flame,
      color: 'from-gray-800 to-black',
      premium: true
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-crd-white mb-4">Apply Visual Effects</h2>
        <p className="text-crd-lightGray text-lg max-w-2xl mx-auto">
          Enhance your card with professional lighting adjustments and premium special effects
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Adjustments */}
        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardHeader>
            <CardTitle className="text-crd-white flex items-center gap-2">
              <Sun className="w-5 h-5" />
              Basic Adjustments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-crd-white font-medium">Brightness</label>
                <span className="text-crd-lightGray text-sm">{effects.brightness}%</span>
              </div>
              <Slider
                value={[effects.brightness]}
                onValueChange={([value]) => updateEffect('brightness', value)}
                min={0}
                max={200}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-crd-white font-medium">Contrast</label>
                <span className="text-crd-lightGray text-sm">{effects.contrast}%</span>
              </div>
              <Slider
                value={[effects.contrast]}
                onValueChange={([value]) => updateEffect('contrast', value)}
                min={0}
                max={200}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-crd-white font-medium">Saturation</label>
                <span className="text-crd-lightGray text-sm">{effects.saturation}%</span>
              </div>
              <Slider
                value={[effects.saturation]}
                onValueChange={([value]) => updateEffect('saturation', value)}
                min={0}
                max={200}
                step={1}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Live Preview */}
        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardHeader>
            <CardTitle className="text-crd-white flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Live Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-[5/7] bg-crd-darkest rounded-lg border border-crd-mediumGray/30 flex items-center justify-center relative overflow-hidden">
              {cardEditor.cardData.image_url ? (
                <img
                  src={cardEditor.cardData.image_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  style={{
                    filter: `brightness(${effects.brightness}%) contrast(${effects.contrast}%) saturate(${effects.saturation}%)`,
                  }}
                />
              ) : (
                <div className="text-center">
                  <Palette className="w-12 h-12 text-crd-mediumGray mx-auto mb-2" />
                  <p className="text-crd-mediumGray">Preview will appear here</p>
                </div>
              )}
              
              {/* Effect Overlays */}
              {Object.entries(effects).map(([key, value]) => {
                if (typeof value === 'boolean' && value && key.includes('Intensity')) {
                  const intensityKey = key.replace('Intensity', '') as keyof EffectSettings;
                  const intensity = effects[`${intensityKey}Intensity` as keyof EffectSettings] as number;
                  
                  return (
                    <div
                      key={key}
                      className="absolute inset-0 pointer-events-none"
                      style={{ opacity: intensity / 100 }}
                    >
                      {/* Effect-specific overlays would be rendered here */}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Effects */}
      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardHeader>
          <CardTitle className="text-crd-white flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Premium Effects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {advancedEffects.map((effect) => {
              const Icon = effect.icon;
              const isEnabled = effects[effect.id as keyof EffectSettings] as boolean;
              const intensity = effects[`${effect.id}Intensity` as keyof EffectSettings] as number;
              
              return (
                <div key={effect.id} className="space-y-3">
                  <div className={`p-4 rounded-lg border transition-all ${
                    isEnabled 
                      ? 'bg-gradient-to-r ' + effect.color + ' bg-opacity-20 border-current'
                      : 'bg-crd-darkest border-crd-mediumGray/30'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isEnabled ? 'text-white' : 'text-crd-mediumGray'}`} />
                        <span className={`font-medium text-sm ${isEnabled ? 'text-white' : 'text-crd-lightGray'}`}>
                          {effect.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {effect.premium && (
                          <Badge className="bg-purple-500/20 text-purple-400 text-xs">Premium</Badge>
                        )}
                        <Switch
                          checked={isEnabled}
                          onCheckedChange={(checked) => updateEffect(effect.id as keyof EffectSettings, checked)}
                        />
                      </div>
                    </div>
                    
                    <p className="text-xs text-crd-lightGray mb-3">{effect.description}</p>
                    
                    {isEnabled && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-crd-lightGray">Intensity</span>
                          <span className="text-xs text-crd-lightGray">{intensity}%</span>
                        </div>
                        <Slider
                          value={[intensity]}
                          onValueChange={([value]) => updateEffect(`${effect.id}Intensity` as keyof EffectSettings, value)}
                          min={0}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <div className="flex justify-center">
        <CRDButton
          onClick={handleContinue}
          className="bg-crd-green text-black hover:bg-crd-green/90 px-8 py-3"
        >
          Continue to Preview
          <Sparkles className="w-4 h-4 ml-2" />
        </CRDButton>
      </div>
    </div>
  );
};
