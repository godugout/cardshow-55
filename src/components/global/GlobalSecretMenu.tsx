
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useGlobalSecretEffects } from '@/contexts/GlobalSecretEffectsContext';
import { Wand2, Palette, Type, Eye, RotateCcw, Sparkles } from 'lucide-react';
import type { TextEffectStyle, TextAnimation } from '@/components/hero/TextEffects3D';

export const GlobalSecretMenu: React.FC = () => {
  const {
    isMenuOpen,
    closeMenu,
    isEnabled,
    toggleEnabled,
    textStyle,
    setTextStyle,
    animation,
    setAnimation,
    intensity,
    setIntensity,
    speed,
    setSpeed,
    glowEnabled,
    setGlowEnabled,
    resetTextEffects,
    visualEffects,
    updateVisualEffect,
    resetVisualEffects,
    interactiveMode,
    setInteractiveMode
  } = useGlobalSecretEffects();

  const textStyles: { value: TextEffectStyle; label: string }[] = [
    { value: 'gradient', label: 'Gradient' },
    { value: 'neon', label: 'Neon' },
    { value: 'holographic', label: 'Holographic' },
    { value: 'chrome', label: 'Chrome' },
    { value: 'fire', label: 'Fire' },
    { value: 'ice', label: 'Ice' },
    { value: 'rainbow', label: 'Rainbow' }
  ];

  const animations: { value: TextAnimation; label: string }[] = [
    { value: 'none', label: 'None' },
    { value: 'glow', label: 'Glow' },
    { value: 'pulse', label: 'Pulse' },
    { value: 'shimmer', label: 'Shimmer' },
    { value: 'wave', label: 'Wave' },
    { value: 'bounce', label: 'Bounce' }
  ];

  const visualEffectsList = [
    {
      id: 'chrome',
      name: 'Chrome Effect',
      description: 'Metallic chrome finish',
      enabled: visualEffects.chrome?.enabled || false,
      intensity: visualEffects.chrome?.intensity || 0.5,
      speed: visualEffects.chrome?.speed || 1.0
    },
    {
      id: 'holographic',
      name: 'Holographic',
      description: 'Rainbow holographic overlay',
      enabled: visualEffects.holographic?.enabled || false,
      intensity: visualEffects.holographic?.intensity || 0.6,
      speed: visualEffects.holographic?.speed || 1.2
    },
    {
      id: 'foil',
      name: 'Foil Effect',
      description: 'Premium foil finish',
      enabled: visualEffects.foil?.enabled || false,
      intensity: visualEffects.foil?.intensity || 0.4,
      speed: visualEffects.foil?.speed || 0.8
    },
    {
      id: 'rainbow',
      name: 'Rainbow',
      description: 'Dynamic rainbow colors',
      enabled: visualEffects.rainbow?.enabled || false,
      intensity: visualEffects.rainbow?.intensity || 0.7,
      speed: visualEffects.rainbow?.speed || 1.0
    },
    {
      id: 'shimmer',
      name: 'Shimmer',
      description: 'Subtle shimmer effect',
      enabled: visualEffects.shimmer?.enabled || false,
      intensity: visualEffects.shimmer?.intensity || 0.5,
      speed: visualEffects.shimmer?.speed || 1.5
    }
  ];

  if (!isMenuOpen) return null;

  return (
    <Dialog open={isMenuOpen} onOpenChange={closeMenu}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-crd-darker border-crd-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-crd-white">
            <Wand2 className="w-5 h-5 text-crd-green" />
            Effects Lab - Global Customization
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Master Enable Toggle */}
          <div className="flex items-center justify-between p-4 bg-crd-darkest rounded-lg border border-crd-border">
            <div>
              <h3 className="text-crd-white font-medium">Enable Effects System</h3>
              <p className="text-sm text-crd-lightGray">Activate global effects across the application</p>
            </div>
            <Switch
              checked={isEnabled}
              onCheckedChange={toggleEnabled}
            />
          </div>

          {/* Interactive Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-crd-darkest rounded-lg border border-crd-border">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-crd-green" />
              <div>
                <h3 className="text-crd-white font-medium">Interactive Mode</h3>
                <p className="text-sm text-crd-lightGray">Highlight customizable elements on hover</p>
              </div>
            </div>
            <Switch
              checked={interactiveMode}
              onCheckedChange={setInteractiveMode}
              disabled={!isEnabled}
            />
          </div>

          {isEnabled && (
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-crd-darkest">
                <TabsTrigger value="text" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
                  <Type className="w-4 h-4 mr-2" />
                  Text Effects
                </TabsTrigger>
                <TabsTrigger value="visual" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
                  <Palette className="w-4 h-4 mr-2" />
                  Visual Effects
                </TabsTrigger>
              </TabsList>

              {/* Text Effects Tab */}
              <TabsContent value="text" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Text Style Selection */}
                  <div className="space-y-2">
                    <Label className="text-crd-white">Text Style</Label>
                    <Select value={textStyle} onValueChange={setTextStyle}>
                      <SelectTrigger className="bg-crd-darkest border-crd-border text-crd-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-crd-darkest border-crd-border">
                        {textStyles.map((style) => (
                          <SelectItem key={style.value} value={style.value} className="text-crd-white">
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Animation Selection */}
                  <div className="space-y-2">
                    <Label className="text-crd-white">Animation</Label>
                    <Select value={animation} onValueChange={setAnimation}>
                      <SelectTrigger className="bg-crd-darkest border-crd-border text-crd-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-crd-darkest border-crd-border">
                        {animations.map((anim) => (
                          <SelectItem key={anim.value} value={anim.value} className="text-crd-white">
                            {anim.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Intensity Slider */}
                <div className="space-y-2">
                  <Label className="text-crd-white">Intensity: {intensity}</Label>
                  <Slider
                    value={[intensity]}
                    onValueChange={(value) => setIntensity(value[0])}
                    min={0}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Speed Slider */}
                <div className="space-y-2">
                  <Label className="text-crd-white">Speed: {speed}</Label>
                  <Slider
                    value={[speed]}
                    onValueChange={(value) => setSpeed(value[0])}
                    min={0.1}
                    max={3}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Glow Toggle */}
                <div className="flex items-center justify-between p-3 bg-crd-darkest rounded-lg border border-crd-border">
                  <Label className="text-crd-white">Enable Glow</Label>
                  <Switch
                    checked={glowEnabled}
                    onCheckedChange={setGlowEnabled}
                  />
                </div>

                {/* Reset Button */}
                <Button onClick={resetTextEffects} variant="outline" className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Text Effects
                </Button>
              </TabsContent>

              {/* Visual Effects Tab */}
              <TabsContent value="visual" className="space-y-6 mt-6">
                <div className="space-y-4">
                  {visualEffectsList.map((effect) => (
                    <div key={effect.id} className="p-4 bg-crd-darkest rounded-lg border border-crd-border">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-crd-white font-medium">{effect.name}</h4>
                          <p className="text-sm text-crd-lightGray">{effect.description}</p>
                        </div>
                        <Switch
                          checked={effect.enabled}
                          onCheckedChange={(checked) => updateVisualEffect(effect.id, 'enabled', checked)}
                        />
                      </div>

                      {effect.enabled && (
                        <div className="space-y-3">
                          {/* Intensity Slider */}
                          <div className="space-y-2">
                            <Label className="text-crd-white text-sm">
                              Intensity: {effect.intensity.toFixed(1)}
                            </Label>
                            <Slider
                              value={[effect.intensity]}
                              onValueChange={(value) => updateVisualEffect(effect.id, 'intensity', value[0])}
                              min={0}
                              max={1}
                              step={0.1}
                              className="w-full"
                            />
                          </div>

                          {/* Speed Slider */}
                          <div className="space-y-2">
                            <Label className="text-crd-white text-sm">
                              Speed: {effect.speed.toFixed(1)}
                            </Label>
                            <Slider
                              value={[effect.speed]}
                              onValueChange={(value) => updateVisualEffect(effect.id, 'speed', value[0])}
                              min={0.1}
                              max={3}
                              step={0.1}
                              className="w-full"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Reset Visual Effects */}
                <Button onClick={resetVisualEffects} variant="outline" className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Visual Effects
                </Button>
              </TabsContent>
            </Tabs>
          )}

          {/* Instructions */}
          <div className="p-4 bg-crd-darkest rounded-lg border border-crd-border">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-crd-green mt-0.5" />
              <div className="text-sm text-crd-lightGray">
                <p className="mb-2">
                  <strong className="text-crd-white">Effects Lab Instructions:</strong>
                </p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Use <kbd className="px-1 py-0.5 bg-crd-darker rounded text-xs">Ctrl+Shift+3+D</kbd> to open this menu</li>
                  <li>Enable Interactive Mode to highlight customizable elements</li>
                  <li>Text effects apply to InteractiveElement components</li>
                  <li>Visual effects enhance buttons, cards, and interactive areas</li>
                  <li>Settings are saved automatically and persist across sessions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
