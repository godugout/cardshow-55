
import React, { useState } from 'react';
import { X, RotateCcw, Sparkles, Palette, Type, Wand2 } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Typography } from '@/components/ui/design-system/Typography';
import { useGlobalSecretEffects } from '@/contexts/GlobalSecretEffectsContext';
import type { TextEffectStyle, TextAnimation } from '@/components/hero/TextEffects3D';

const textStyles: { key: TextEffectStyle; name: string; description: string }[] = [
  { key: 'gradient', name: 'Gradient', description: 'Multi-color gradient text' },
  { key: 'holographic', name: 'Holographic', description: 'Iridescent rainbow effect' },
  { key: 'neon', name: 'Neon', description: 'Glowing neon sign style' },
  { key: 'metallic', name: 'Metallic', description: 'Shiny metallic finish' },
  { key: 'crystalline', name: 'Crystalline', description: 'Crystal-like refraction' }
];

const animations: { key: TextAnimation; name: string; description: string }[] = [
  { key: 'none', name: 'Static', description: 'No animation' },
  { key: 'glow', name: 'Glow', description: 'Pulsing glow effect' },
  { key: 'pulse', name: 'Pulse', description: 'Breathing animation' },
  { key: 'shimmer', name: 'Shimmer', description: 'Shimmering light sweep' },
  { key: 'wave', name: 'Wave', description: '3D wave distortion' }
];

const visualEffects = [
  { key: 'chrome', name: 'Chrome', description: 'Metallic chrome finish', icon: '⚡' },
  { key: 'holographic', name: 'Holographic', description: 'Rainbow hologram effect', icon: '🌈' },
  { key: 'foil', name: 'Foil', description: 'Reflective foil surface', icon: '✨' },
  { key: 'rainbow', name: 'Rainbow', description: 'Prismatic color shift', icon: '🎨' },
  { key: 'shimmer', name: 'Shimmer', description: 'Light shimmer effect', icon: '💫' }
];

export const GlobalSecretMenu: React.FC = () => {
  const {
    isMenuOpen,
    closeMenu,
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
    visualEffects: currentVisualEffects,
    updateVisualEffect,
    resetTextEffects,
    resetVisualEffects,
    interactiveMode,
    setInteractiveMode
  } = useGlobalSecretEffects();

  const [activeTab, setActiveTab] = useState<'text' | 'visual' | 'interactive'>('text');

  if (!isMenuOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-crd-darkest/20 backdrop-blur-sm z-40"
        onClick={closeMenu}
      />
      
      {/* Enhanced Global Secret Menu */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-scale-in">
        <div className="bg-crd-dark/95 backdrop-blur-lg border border-crd-border rounded-2xl p-6 w-[500px] max-w-[90vw] shadow-2xl max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-crd-green" />
              <Typography variant="h4" className="text-crd-white">
                Global Effects Lab
              </Typography>
            </div>
            <CRDButton variant="ghost" size="sm" onClick={closeMenu} className="p-2">
              <X className="w-4 h-4" />
            </CRDButton>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 p-1 bg-crd-darker rounded-lg">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-all ${
                activeTab === 'text' 
                  ? 'bg-crd-green text-black' 
                  : 'text-crd-lightGray hover:text-crd-white hover:bg-crd-border'
              }`}
            >
              <Type className="w-4 h-4" />
              <span className="text-sm font-medium">Text</span>
            </button>
            <button
              onClick={() => setActiveTab('visual')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-all ${
                activeTab === 'visual' 
                  ? 'bg-crd-green text-black' 
                  : 'text-crd-lightGray hover:text-crd-white hover:bg-crd-border'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span className="text-sm font-medium">Visual</span>
            </button>
            <button
              onClick={() => setActiveTab('interactive')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-all ${
                activeTab === 'interactive' 
                  ? 'bg-crd-green text-black' 
                  : 'text-crd-lightGray hover:text-crd-white hover:bg-crd-border'
              }`}
            >
              <Wand2 className="w-4 h-4" />
              <span className="text-sm font-medium">Interactive</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === 'text' && (
              <>
                {/* Text Style Selection */}
                <div>
                  <Typography variant="label" className="text-crd-lightGray mb-3 block">
                    Text Style
                  </Typography>
                  <div className="grid grid-cols-2 gap-2">
                    {textStyles.map((style) => (
                      <button
                        key={style.key}
                        onClick={() => setTextStyle(style.key)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          textStyle === style.key
                            ? 'border-crd-green bg-crd-green/10 text-crd-green'
                            : 'border-crd-border bg-crd-darker text-crd-lightGray hover:border-crd-green/50'
                        }`}
                      >
                        <div className="font-medium text-sm">{style.name}</div>
                        <div className="text-xs opacity-70">{style.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animation Selection */}
                <div>
                  <Typography variant="label" className="text-crd-lightGray mb-3 block">
                    Animation
                  </Typography>
                  <div className="grid grid-cols-2 gap-2">
                    {animations.map((anim) => (
                      <button
                        key={anim.key}
                        onClick={() => setAnimation(anim.key)}
                        className={`p-2 rounded-lg border text-left transition-all ${
                          animation === anim.key
                            ? 'border-crd-green bg-crd-green/10 text-crd-green'
                            : 'border-crd-border bg-crd-darker text-crd-lightGray hover:border-crd-green/50'
                        }`}
                      >
                        <div className="font-medium text-xs">{anim.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                  <div>
                    <Typography variant="label" className="text-crd-lightGray mb-2 block">
                      Intensity: {Math.round(intensity * 100)}%
                    </Typography>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={intensity}
                      onChange={(e) => setIntensity(parseFloat(e.target.value))}
                      className="w-full h-2 bg-crd-darker rounded-lg appearance-none cursor-pointer slider-thumb"
                    />
                  </div>

                  <div>
                    <Typography variant="label" className="text-crd-lightGray mb-2 block">
                      Speed: {speed}x
                    </Typography>
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={speed}
                      onChange={(e) => setSpeed(parseFloat(e.target.value))}
                      className="w-full h-2 bg-crd-darker rounded-lg appearance-none cursor-pointer slider-thumb"
                    />
                  </div>

                  <div className="flex justify-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={glowEnabled}
                        onChange={(e) => setGlowEnabled(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        glowEnabled 
                          ? 'border-crd-green bg-crd-green' 
                          : 'border-crd-border bg-transparent'
                      }`}>
                        {glowEnabled && (
                          <div className="w-2 h-2 bg-crd-darkest rounded-sm" />
                        )}
                      </div>
                      <Typography variant="caption" className="text-crd-lightGray">
                        Glow Effect
                      </Typography>
                    </label>
                  </div>
                </div>

                <CRDButton variant="outline" size="sm" onClick={resetTextEffects} className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Text Effects
                </CRDButton>
              </>
            )}

            {activeTab === 'visual' && (
              <>
                <Typography variant="label" className="text-crd-lightGray mb-3 block">
                  Visual Effects
                </Typography>
                <div className="space-y-3">
                  {visualEffects.map((effect) => (
                    <div key={effect.key} className="p-3 rounded-lg bg-crd-darker border border-crd-border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{effect.icon}</span>
                          <div>
                            <div className="text-sm font-medium text-crd-white">{effect.name}</div>
                            <div className="text-xs text-crd-lightGray">{effect.description}</div>
                          </div>
                        </div>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={currentVisualEffects[effect.key as keyof typeof currentVisualEffects]?.enabled || false}
                            onChange={(e) => updateVisualEffect(effect.key, 'enabled', e.target.checked)}
                            className="w-4 h-4"
                          />
                        </label>
                      </div>
                      {currentVisualEffects[effect.key as keyof typeof currentVisualEffects]?.enabled && (
                        <div className="space-y-2">
                          <div>
                            <label className="text-xs text-crd-lightGray">Intensity</label>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={currentVisualEffects[effect.key as keyof typeof currentVisualEffects]?.intensity || 0.5}
                              onChange={(e) => updateVisualEffect(effect.key, 'intensity', parseFloat(e.target.value))}
                              className="w-full h-1 bg-crd-mediumGray rounded slider-thumb"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <CRDButton variant="outline" size="sm" onClick={resetVisualEffects} className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Visual Effects
                </CRDButton>
              </>
            )}

            {activeTab === 'interactive' && (
              <>
                <Typography variant="label" className="text-crd-lightGray mb-3 block">
                  Interactive Mode
                </Typography>
                <div className="p-4 rounded-lg bg-crd-darker border border-crd-border">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={interactiveMode}
                      onChange={(e) => setInteractiveMode(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <div>
                      <div className="text-sm font-medium text-crd-white">Enable Interactive Mode</div>
                      <div className="text-xs text-crd-lightGray">
                        Highlight and enable customization of elements as you hover over them
                      </div>
                    </div>
                  </label>
                </div>

                {interactiveMode && (
                  <div className="p-4 rounded-lg bg-crd-green/10 border border-crd-green/30">
                    <Typography variant="caption" className="text-crd-green">
                      🎨 Interactive mode is active! Hover over elements to customize them.
                    </Typography>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Easter Egg Info */}
          <div className="mt-6 p-3 bg-crd-darker/50 rounded-lg">
            <Typography variant="caption" className="text-crd-lightGray/70 text-center">
              🎮 Shortcut: Ctrl+Shift+3+D | ↑↑↓↓←→←→BA
            </Typography>
          </div>
        </div>
      </div>
    </>
  );
};
