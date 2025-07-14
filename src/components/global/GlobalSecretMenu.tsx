
import React, { useState } from 'react';
import { X, Settings, Palette, Sparkles, Eye, RotateCcw } from 'lucide-react';
import { useGlobalSecretEffects } from '@/contexts/GlobalSecretEffectsContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { TextEffectStyle, TextAnimation } from '@/components/hero/TextEffects3D';

export const GlobalSecretMenu: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    isEnabled,
    textStyle,
    animation,
    intensity,
    speed,
    glowEnabled,
    visualEffects,
    interactiveMode,
    toggleEnabled,
    setTextStyle,
    setAnimation,
    setIntensity,
    setSpeed,
    setGlowEnabled,
    updateVisualEffect,
    resetTextEffects,
    resetVisualEffects,
    setInteractiveMode
  } = useGlobalSecretEffects();

  const textStyleOptions: { value: TextEffectStyle; label: string }[] = [
    { value: 'gradient', label: 'Gradient' },
    { value: 'holographic', label: 'Holographic' },
    { value: 'neon', label: 'Neon' },
    { value: 'metallic', label: 'Metallic' },
    { value: 'crystalline', label: 'Crystalline' }
  ];

  const animationOptions: { value: TextAnimation; label: string }[] = [
    { value: 'none', label: 'None' },
    { value: 'glow', label: 'Glow' },
    { value: 'pulse', label: 'Pulse' },
    { value: 'shimmer', label: 'Shimmer' },
    { value: 'wave', label: 'Wave' },
    { value: 'typing', label: 'Typing' }
  ];

  const visualEffectsList = [
    { id: 'chrome', label: 'Chrome', description: 'Metallic chrome finish' },
    { id: 'holographic', label: 'Holographic', description: 'Rainbow holographic effect' },
    { id: 'foil', label: 'Foil', description: 'Shimmering foil texture' },
    { id: 'rainbow', label: 'Rainbow', description: 'Colorful rainbow gradient' },
    { id: 'shimmer', label: 'Shimmer', description: 'Subtle shimmer animation' }
  ];

  if (!isExpanded) {
    return (
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          size="sm"
          variant="outline"
          className="bg-crd-darker/90 border-crd-mediumGray/30 hover:bg-crd-darker backdrop-blur-sm"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 w-80">
      <Card className="bg-crd-darker/95 border-crd-mediumGray/30 backdrop-blur-sm max-h-[80vh] overflow-y-auto">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-crd-green" />
              <h3 className="text-lg font-semibold text-crd-white">Secret Effects</h3>
            </div>
            <Button
              onClick={() => setIsExpanded(false)}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-crd-mediumGray/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Global Toggle */}
          <div className="flex items-center justify-between mb-6 p-3 bg-crd-mediumGray/10 rounded-lg">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-crd-blue" />
              <span className="text-sm font-medium text-crd-white">Enable Effects</span>
            </div>
            <Switch
              checked={isEnabled}
              onCheckedChange={toggleEnabled}
            />
          </div>

          {isEnabled && (
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-crd-mediumGray/20">
                <TabsTrigger value="text" className="text-xs">Text</TabsTrigger>
                <TabsTrigger value="visual" className="text-xs">Visual</TabsTrigger>
                <TabsTrigger value="interactive" className="text-xs">Interactive</TabsTrigger>
              </TabsList>

              {/* Text Effects Tab */}
              <TabsContent value="text" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-crd-white flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Text Effects
                    </h4>
                    <Button
                      onClick={resetTextEffects}
                      size="sm"
                      variant="ghost"
                      className="h-6 text-xs hover:bg-crd-mediumGray/20"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Reset
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-crd-lightGray mb-1 block">Style</label>
                      <Select value={textStyle} onValueChange={setTextStyle}>
                        <SelectTrigger className="h-8 bg-crd-mediumGray/20 border-crd-mediumGray/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {textStyleOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs text-crd-lightGray mb-1 block">Animation</label>
                      <Select value={animation} onValueChange={setAnimation}>
                        <SelectTrigger className="h-8 bg-crd-mediumGray/20 border-crd-mediumGray/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {animationOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs text-crd-lightGray mb-2 block">
                        Intensity: {(intensity * 100).toFixed(0)}%
                      </label>
                      <Slider
                        value={[intensity]}
                        onValueChange={([value]) => setIntensity(value)}
                        max={1}
                        min={0}
                        step={0.1}
                        className="slider-thumb"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-crd-lightGray mb-2 block">
                        Speed: {speed.toFixed(1)}x
                      </label>
                      <Slider
                        value={[speed]}
                        onValueChange={([value]) => setSpeed(value)}
                        max={3}
                        min={0.1}
                        step={0.1}
                        className="slider-thumb"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-crd-lightGray">Glow Effect</span>
                      <Switch
                        checked={glowEnabled}
                        onCheckedChange={setGlowEnabled}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Visual Effects Tab */}
              <TabsContent value="visual" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-crd-white">Visual Effects</h4>
                    <Button
                      onClick={resetVisualEffects}
                      size="sm"
                      variant="ghost"
                      className="h-6 text-xs hover:bg-crd-mediumGray/20"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Reset
                    </Button>
                  </div>

                  {visualEffectsList.map((effect) => {
                    const effectData = visualEffects[effect.id as keyof typeof visualEffects];
                    const enabled = typeof effectData?.enabled === 'boolean' ? effectData.enabled : false;
                    const intensityValue = typeof effectData?.intensity === 'number' ? effectData.intensity : 0.5;
                    const speedValue = typeof effectData?.speed === 'number' ? effectData.speed : 1.0;

                    return (
                      <div key={effect.id} className="p-3 bg-crd-mediumGray/10 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-medium text-crd-white">{effect.label}</span>
                            <p className="text-xs text-crd-lightGray">{effect.description}</p>
                          </div>
                          <Switch
                            checked={enabled}
                            onCheckedChange={(checked) => updateVisualEffect(effect.id, 'enabled', checked)}
                            size="sm"
                          />
                        </div>

                        {enabled && (
                          <div className="space-y-2">
                            <div>
                              <label className="text-xs text-crd-lightGray mb-1 block">
                                Intensity: {(intensityValue * 100).toFixed(0)}%
                              </label>
                              <Slider
                                value={[intensityValue]}
                                onValueChange={([value]) => updateVisualEffect(effect.id, 'intensity', value)}
                                max={1}
                                min={0}
                                step={0.1}
                                className="slider-thumb"
                              />
                            </div>

                            <div>
                              <label className="text-xs text-crd-lightGray mb-1 block">
                                Speed: {speedValue.toFixed(1)}x
                              </label>
                              <Slider
                                value={[speedValue]}
                                onValueChange={([value]) => updateVisualEffect(effect.id, 'speed', value)}
                                max={3}
                                min={0.1}
                                step={0.1}
                                className="slider-thumb"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Interactive Mode Tab */}
              <TabsContent value="interactive" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-crd-white">Interactive Mode</h4>
                  <p className="text-xs text-crd-lightGray">
                    Highlight elements as you interact with them
                  </p>
                  
                  <div className="flex items-center justify-between p-3 bg-crd-mediumGray/10 rounded-lg">
                    <span className="text-sm text-crd-white">Enable Interactive Highlights</span>
                    <Switch
                      checked={interactiveMode}
                      onCheckedChange={setInteractiveMode}
                      size="sm"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </Card>
    </div>
  );
};
