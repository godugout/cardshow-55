
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Animated3DBackground } from '@/components/hero/Animated3DBackground';
import { X, Settings, Palette, Layers, Sparkles, Shapes } from 'lucide-react';

interface StyleTesterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminStyleTester: React.FC<StyleTesterProps> = ({ isOpen, onClose }) => {
  const [activeVariant, setActiveVariant] = useState<'panels' | 'cards' | 'particles' | 'glass' | 'shapes'>('panels');
  const [opacity, setOpacity] = useState([25]);
  const [speed, setSpeed] = useState([1]);
  const [scale, setScale] = useState([100]);
  const [blur, setBlur] = useState([0]);
  const [mouseInteraction, setMouseInteraction] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);

  const variants = [
    { id: 'panels', name: 'Isometric Panels', icon: Layers, description: 'Floating rainbow grid panels' },
    { id: 'cards', name: 'Holographic Cards', icon: Sparkles, description: 'Floating card-like shapes' },
    { id: 'particles', name: 'Particle Constellation', icon: Settings, description: 'Small glowing particles' },
    { id: 'glass', name: 'Glass Planes', icon: Palette, description: 'Layered glass surfaces' },
    { id: 'shapes', name: 'Morphing Shapes', icon: Shapes, description: 'Geometric transformations' },
  ];

  const presets = {
    subtle: { opacity: [15], speed: [0.5], scale: [80], blur: [2] },
    normal: { opacity: [25], speed: [1], scale: [100], blur: [0] },
    dramatic: { opacity: [40], speed: [1.5], scale: [120], blur: [0] },
    ethereal: { opacity: [20], speed: [0.8], scale: [90], blur: [5] },
  };

  const applyPreset = (preset: keyof typeof presets) => {
    const settings = presets[preset];
    setOpacity(settings.opacity);
    setSpeed(settings.speed);
    setScale(settings.scale);
    setBlur(settings.blur);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden bg-crd-darkest border-crd-mediumGray/20">
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b border-crd-mediumGray/20">
          <DialogTitle className="text-2xl font-bold text-crd-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-crd-green" />
            3D Effects Style Tester
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-crd-lightGray hover:text-crd-white">
            <X className="w-5 h-5" />
          </Button>
        </DialogHeader>

        <div className="flex gap-6 h-[70vh]">
          {/* Controls Panel */}
          <div className="w-80 flex-shrink-0 overflow-y-auto">
            <Tabs defaultValue="variants" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-crd-mediumGray/20">
                <TabsTrigger value="variants" className="text-xs">Variants</TabsTrigger>
                <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="variants" className="space-y-4 mt-4">
                <div className="space-y-3">
                  {variants.map((variant) => {
                    const IconComponent = variant.icon;
                    return (
                      <div
                        key={variant.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                          activeVariant === variant.id
                            ? 'border-crd-green bg-crd-green/10'
                            : 'border-crd-mediumGray/30 hover:border-crd-mediumGray/50 bg-crd-darkest/50'
                        }`}
                        onClick={() => setActiveVariant(variant.id as any)}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className={`w-5 h-5 ${
                            activeVariant === variant.id ? 'text-crd-green' : 'text-crd-lightGray'
                          }`} />
                          <div>
                            <h4 className={`font-medium ${
                              activeVariant === variant.id ? 'text-crd-white' : 'text-crd-lightGray'
                            }`}>
                              {variant.name}
                            </h4>
                            <p className="text-xs text-crd-mediumGray">
                              {variant.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-crd-mediumGray/20 pt-4">
                  <h4 className="text-sm font-medium text-crd-white mb-3">Quick Presets</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(presets).map((preset) => (
                      <Button
                        key={preset}
                        variant="outline"
                        size="sm"
                        onClick={() => applyPreset(preset as keyof typeof presets)}
                        className="text-xs capitalize border-crd-mediumGray/30 hover:border-crd-green/50"
                      >
                        {preset}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6 mt-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-crd-lightGray mb-2 block">
                      Opacity: {opacity[0]}%
                    </Label>
                    <Slider
                      value={opacity}
                      onValueChange={setOpacity}
                      max={100}
                      min={5}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="text-sm text-crd-lightGray mb-2 block">
                      Animation Speed: {speed[0]}x
                    </Label>
                    <Slider
                      value={speed}
                      onValueChange={setSpeed}
                      max={3}
                      min={0.1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="text-sm text-crd-lightGray mb-2 block">
                      Scale: {scale[0]}%
                    </Label>
                    <Slider
                      value={scale}
                      onValueChange={setScale}
                      max={200}
                      min={50}
                      step={10}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="text-sm text-crd-lightGray mb-2 block">
                      Blur: {blur[0]}px
                    </Label>
                    <Slider
                      value={blur}
                      onValueChange={setBlur}
                      max={20}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-crd-lightGray">Mouse Interaction</Label>
                    <Switch
                      checked={mouseInteraction}
                      onCheckedChange={setMouseInteraction}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-crd-lightGray">Auto Rotate</Label>
                    <Switch
                      checked={autoRotate}
                      onCheckedChange={setAutoRotate}
                    />
                  </div>
                </div>

                <div className="border-t border-crd-mediumGray/20 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setOpacity([25]);
                      setSpeed([1]);
                      setScale([100]);
                      setBlur([0]);
                      setMouseInteraction(true);
                      setAutoRotate(false);
                    }}
                    className="w-full border-crd-mediumGray/30 hover:border-crd-green/50"
                  >
                    Reset to Defaults
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Area */}
          <div className="flex-1 relative bg-crd-darker rounded-lg overflow-hidden border border-crd-mediumGray/20">
            <div className="absolute inset-0 bg-gradient-to-br from-crd-darkest via-crd-darker to-crd-darkest">
              {/* Sample Content */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-crd-white mb-4">
                    Sample <span className="text-crd-green">3D Effects</span>
                  </h1>
                  <p className="text-xl text-crd-lightGray max-w-2xl">
                    This is how the background animation would look behind content.
                    Adjust the settings to see different effects.
                  </p>
                </div>
              </div>

              {/* 3D Background */}
              <div 
                className="absolute inset-0"
                style={{
                  opacity: opacity[0] / 100,
                  transform: `scale(${scale[0] / 100})`,
                  filter: blur[0] > 0 ? `blur(${blur[0]}px)` : 'none',
                  animationDuration: `${4 / speed[0]}s`,
                }}
              >
                <Animated3DBackground variant={activeVariant} />
              </div>

              {/* Info overlay */}
              <div className="absolute bottom-4 left-4 bg-crd-darkest/80 backdrop-blur-sm rounded-lg p-3 border border-crd-mediumGray/20">
                <div className="text-xs text-crd-lightGray space-y-1">
                  <div>Variant: <span className="text-crd-white">{variants.find(v => v.id === activeVariant)?.name}</span></div>
                  <div>Opacity: <span className="text-crd-white">{opacity[0]}%</span></div>
                  <div>Speed: <span className="text-crd-white">{speed[0]}x</span></div>
                  <div>Scale: <span className="text-crd-white">{scale[0]}%</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-crd-mediumGray/20 pt-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-crd-mediumGray">
              Admin Style Tester - Test different 3D background concepts
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
              <Button size="sm" className="bg-crd-green hover:bg-crd-green/90 text-black">
                Apply to Production
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
