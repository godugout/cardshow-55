
import React from 'react';
import { X, Palette, Type, Sparkles, Eye, RotateCcw } from 'lucide-react';
import { useGlobalSecretEffects } from '@/contexts/GlobalSecretEffectsContext';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Typography } from '@/components/ui/design-system/Typography';
import type { TextEffectStyle, TextAnimation } from '@/components/hero/TextEffects3D';

export const GlobalSecretMenu: React.FC = () => {
  const {
    isMenuOpen,
    closeMenu,
    isEnabled,
    toggleEnabled,
    
    // Text effects
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
    
    // Visual effects
    visualEffects,
    updateVisualEffect,
    resetVisualEffects,
    
    // Interactive mode
    interactiveMode,
    setInteractiveMode
  } = useGlobalSecretEffects();

  if (!isMenuOpen) return null;

  const textStyles: { value: TextEffectStyle; label: string }[] = [
    { value: 'gradient', label: 'Gradient' },
    { value: 'holographic', label: 'Holographic' },
    { value: 'neon', label: 'Neon' },
    { value: 'metallic', label: 'Metallic' },
    { value: 'crystalline', label: 'Crystalline' }
  ];

  const animations: { value: TextAnimation; label: string }[] = [
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
    { id: 'rainbow', label: 'Rainbow', description: 'Multi-color rainbow effect' },
    { id: 'shimmer', label: 'Shimmer', description: 'Subtle shimmer animation' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-crd-darkest border border-crd-border rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-crd-border">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-crd-green" />
            <Typography variant="h2" className="text-crd-white">
              Effects Customizer
            </Typography>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-crd-lightGray">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => toggleEnabled(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Enable Effects</span>
            </label>
            <CRDButton onClick={closeMenu} variant="ghost" size="sm">
              <X className="w-4 h-4" />
            </CRDButton>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Interactive Mode Toggle */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-crd-blue" />
              <Typography variant="h3" className="text-crd-white">
                Interactive Mode
              </Typography>
            </div>
            <div className="flex items-center gap-3 p-4 bg-crd-darker rounded-lg border border-crd-border">
              <label className="flex items-center gap-2 text-crd-lightGray">
                <input
                  type="checkbox"
                  checked={interactiveMode}
                  onChange={(e) => setInteractiveMode(e.target.checked)}
                  className="rounded"
                />
                <span>Enable hover effects on page elements</span>
              </label>
            </div>
          </div>

          {/* Text Effects Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className="w-5 h-5 text-crd-purple" />
                <Typography variant="h3" className="text-crd-white">
                  Text Effects
                </Typography>
              </div>
              <CRDButton onClick={resetTextEffects} variant="ghost" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </CRDButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Text Style */}
              <div className="space-y-3">
                <Typography variant="caption" className="text-crd-lightGray font-medium">
                  Style
                </Typography>
                <div className="grid grid-cols-2 gap-2">
                  {textStyles.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setTextStyle(style.value)}
                      className={`p-3 rounded-lg border transition-all ${
                        textStyle === style.value
                          ? 'border-crd-green bg-crd-green/10 text-crd-green'
                          : 'border-crd-border bg-crd-darker text-crd-lightGray hover:border-crd-green/50'
                      }`}
                    >
                      <span className="text-sm font-medium">{style.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Animation */}
              <div className="space-y-3">
                <Typography variant="caption" className="text-crd-lightGray font-medium">
                  Animation
                </Typography>
                <div className="grid grid-cols-2 gap-2">
                  {animations.map((anim) => (
                    <button
                      key={anim.value}
                      onClick={() => setAnimation(anim.value)}
                      className={`p-3 rounded-lg border transition-all ${
                        animation === anim.value
                          ? 'border-crd-green bg-crd-green/10 text-crd-green'
                          : 'border-crd-border bg-crd-darker text-crd-lightGray hover:border-crd-green/50'
                      }`}
                    >
                      <span className="text-sm font-medium">{anim.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Intensity */}
              <div className="space-y-3">
                <Typography variant="caption" className="text-crd-lightGray font-medium">
                  Intensity: {intensity.toFixed(1)}
                </Typography>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={intensity}
                  onChange={(e) => setIntensity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Speed */}
              <div className="space-y-3">
                <Typography variant="caption" className="text-crd-lightGray font-medium">
                  Speed: {speed.toFixed(1)}
                </Typography>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Glow Toggle */}
              <div className="space-y-3">
                <Typography variant="caption" className="text-crd-lightGray font-medium">
                  Glow Effect
                </Typography>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={glowEnabled}
                    onChange={(e) => setGlowEnabled(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-crd-lightGray">Enable text glow</span>
                </label>
              </div>
            </div>
          </div>

          {/* Visual Effects Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-crd-blue" />
                <Typography variant="h3" className="text-crd-white">
                  Visual Effects
                </Typography>
              </div>
              <CRDButton onClick={resetVisualEffects} variant="ghost" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </CRDButton>
            </div>

            <div className="space-y-4">
              {visualEffectsList.map((effect) => {
                const effectData = visualEffects[effect.id as keyof typeof visualEffects];
                if (!effectData) return null;

                return (
                  <div key={effect.id} className="p-4 bg-crd-darker rounded-lg border border-crd-border">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <Typography variant="body" className="text-crd-white font-medium">
                          {effect.label}
                        </Typography>
                        <Typography variant="caption" className="text-crd-lightGray">
                          {effect.description}
                        </Typography>
                      </div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={Boolean(effectData.enabled)}
                          onChange={(e) => updateVisualEffect(effect.id, 'enabled', e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-crd-lightGray text-sm">Enable</span>
                      </label>
                    </div>

                    {effectData.enabled && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Typography variant="caption" className="text-crd-lightGray">
                            Intensity: {typeof effectData.intensity === 'number' ? effectData.intensity.toFixed(1) : '0.5'}
                          </Typography>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={typeof effectData.intensity === 'number' ? effectData.intensity : 0.5}
                            onChange={(e) => updateVisualEffect(effect.id, 'intensity', parseFloat(e.target.value))}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Typography variant="caption" className="text-crd-lightGray">
                            Speed: {typeof effectData.speed === 'number' ? effectData.speed.toFixed(1) : '1.0'}
                          </Typography>
                          <input
                            type="range"
                            min="0.1"
                            max="3"
                            step="0.1"
                            value={typeof effectData.speed === 'number' ? effectData.speed : 1.0}
                            onChange={(e) => updateVisualEffect(effect.id, 'speed', parseFloat(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-crd-green/10 border border-crd-green/30 rounded-lg">
            <Typography variant="caption" className="text-crd-green">
              <strong>Keyboard Shortcut:</strong> Press Ctrl+Shift+3+D to quickly open this menu from any page.
              <br />
              <strong>Interactive Mode:</strong> When enabled, hover over elements on the page to see live customization options.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};
