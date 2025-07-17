import React, { useState } from 'react';
import { Play, Pause, RotateCw, Palette, ChevronUp, X, Orbit, Lightbulb, Package, Zap, Sparkles, Waves } from 'lucide-react';
import { CRDVisualStyles } from '@/components/crd/styles/StyleRegistry';
import { type AnimationMode, type LightingPreset } from '@/components/crd/types/CRDTypes';

interface StudioBarProps {
  // Animation controls
  animationMode: AnimationMode;
  animationIntensity: number;
  onAnimationModeChange: (mode: AnimationMode) => void;
  onAnimationIntensityChange: (intensity: number) => void;
  
  // Visual style controls
  selectedStyleId: string;
  onStyleChange: (styleId: string) => void;
  
  // Rotation controls
  autoRotate: boolean;
  rotationSpeed: number;
  onAutoRotateChange: (enabled: boolean) => void;
  onRotationSpeedChange: (speed: number) => void;
  
  // Lighting controls
  lightingPreset: LightingPreset;
  lightingIntensity: number;
  onLightingPresetChange: (preset: LightingPreset) => void;
  onLightingIntensityChange: (intensity: number) => void;

  // Orbital controls
  orbitalAutoRotate?: boolean;
  orbitalRotationSpeed?: number;
  showOrbitalRing?: boolean;
  showLockIndicators?: boolean;
  onOrbitalAutoRotateChange?: (enabled: boolean) => void;
  onOrbitalRotationSpeedChange?: (speed: number) => void;
  onShowOrbitalRingChange?: (show: boolean) => void;
  onShowLockIndicatorsChange?: (show: boolean) => void;

  // Glass case controls
  enableGlassCase?: boolean;
  onEnableGlassCaseChange?: (enabled: boolean) => void;
  
  // Studio controls
  onClose: () => void;
}

type TabId = 'animation' | 'materials' | 'rotation' | 'lighting';

export const StudioBar: React.FC<StudioBarProps> = ({
  animationMode,
  animationIntensity,
  onAnimationModeChange,
  onAnimationIntensityChange,
  selectedStyleId,
  onStyleChange,
  autoRotate,
  rotationSpeed,
  onAutoRotateChange,
  onRotationSpeedChange,
  lightingPreset,
  lightingIntensity,
  onLightingPresetChange,
  onLightingIntensityChange,
  orbitalAutoRotate = true,
  orbitalRotationSpeed = 1,
  showOrbitalRing = true,
  showLockIndicators = false,
  onOrbitalAutoRotateChange,
  onOrbitalRotationSpeedChange,
  onShowOrbitalRingChange,
  onShowLockIndicatorsChange,
  enableGlassCase = false,
  onEnableGlassCaseChange,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<TabId>('materials');
  const [isExpanded, setIsExpanded] = useState(true);

  const tabs = [
    { id: 'animation' as TabId, name: 'Animation', icon: Play },
    { id: 'materials' as TabId, name: 'Materials', icon: Palette },
    { id: 'rotation' as TabId, name: 'Motion', icon: Orbit },
    { id: 'lighting' as TabId, name: 'Lighting', icon: Lightbulb }
  ];

  const activeStyle = CRDVisualStyles.find(s => s.id === selectedStyleId);

  // Quick action handlers for animation presets
  const handleAnimationPreset = (preset: AnimationMode) => {
    onAnimationModeChange(preset);
  };

  const handleLightingPreset = (preset: LightingPreset) => {
    onLightingPresetChange(preset);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-crd-dark/95 backdrop-blur-xl border-t border-crd-gray/20 shadow-2xl">
      {/* Top Bar - Always Visible */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-crd-gray/10">
        {/* Left: Studio Title */}
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-crd-orange animate-pulse" />
          <h3 className="text-white font-semibold">3D Studio</h3>
        </div>

        {/* Center: Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Animation Presets */}
          <button
            onClick={() => handleAnimationPreset('monolith')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              animationMode === 'monolith' 
                ? 'bg-crd-orange text-white' 
                : 'bg-crd-gray/20 text-crd-lightGray hover:bg-crd-gray/30'
            }`}
          >
            <Zap className="w-3 h-3 inline mr-1" />
            Monolith
          </button>
          
          <button
            onClick={() => handleAnimationPreset('showcase')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              animationMode === 'showcase' 
                ? 'bg-crd-orange text-white' 
                : 'bg-crd-gray/20 text-crd-lightGray hover:bg-crd-gray/30'
            }`}
          >
            <Sparkles className="w-3 h-3 inline mr-1" />
            Showcase
          </button>

          <button
            onClick={() => handleAnimationPreset('holo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              animationMode === 'holo' 
                ? 'bg-crd-orange text-white' 
                : 'bg-crd-gray/20 text-crd-lightGray hover:bg-crd-gray/30'
            }`}
          >
            <Waves className="w-3 h-3 inline mr-1" />
            Holo
          </button>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          {/* Expand/Collapse Toggle */}
          <button
            onClick={toggleExpanded}
            className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all ${
              isExpanded 
                ? 'border-primary bg-primary/20 text-primary' 
                : 'border-crd-gray/30 hover:border-crd-gray/50 text-crd-lightGray hover:text-white'
            }`}
            title={isExpanded ? "Collapse Studio" : "Expand Studio"}
          >
            <ChevronUp className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-red-500/30 hover:border-red-500 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
            title="Close Studio"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-4">
          {/* Tab Navigation */}
          <div className="flex gap-1 mb-4 bg-crd-gray/10 p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-crd-dark shadow-sm'
                      : 'text-crd-lightGray hover:text-white hover:bg-crd-gray/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="min-h-[150px]">
            {/* Animation Controls */}
            {activeTab === 'animation' && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white mb-4">Animation Controls</h3>
                
                <div>
                  <label className="block text-sm font-medium text-crd-lightGray mb-2">
                    Animation Mode
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['monolith', 'showcase', 'holo'] as AnimationMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => onAnimationModeChange(mode)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                          animationMode === mode
                            ? 'bg-crd-orange text-white'
                            : 'bg-crd-gray/20 text-crd-lightGray hover:bg-crd-gray/30'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-crd-lightGray mb-2">
                    Intensity: {animationIntensity}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={animationIntensity}
                    onChange={(e) => onAnimationIntensityChange(parseFloat(e.target.value))}
                    className="w-full accent-crd-orange"
                  />
                </div>
              </div>
            )}

            {/* Materials Controls */}
            {activeTab === 'materials' && (
              <div className="h-full flex flex-col">
                <h3 className="text-lg font-semibold mb-4">Visual Materials</h3>
                <div className="grid grid-cols-8 gap-2">
                  {CRDVisualStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => onStyleChange(style.id)}
                      className={`aspect-square rounded-lg border-2 transition-all relative overflow-hidden ${
                        selectedStyleId === style.id
                          ? 'border-crd-orange shadow-lg shadow-crd-orange/25'
                          : 'border-crd-gray/30 hover:border-crd-gray/50'
                      }`}
                      style={{
                        background: style.uiPreviewGradient
                      }}
                      title={style.displayName}
                    >
                      {style.locked && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Package className="w-4 h-4 text-white/70" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1">
                        <div className="text-white text-xs font-medium truncate">{style.displayName}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Active Style Info */}
                {activeStyle && (
                  <div className="mt-4 p-3 bg-crd-gray/10 rounded-lg">
                    <div className="text-white font-medium">{activeStyle.displayName}</div>
                    <div className="text-crd-lightGray text-sm">{activeStyle.visualVibe}</div>
                    <div className="text-crd-lightGray text-xs mt-1">
                      Category: {activeStyle.category} • Cost: {activeStyle.performance.renderCost}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Rotation Controls */}
            {activeTab === 'rotation' && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white mb-4">Motion Controls</h3>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-crd-lightGray">Auto Rotate</label>
                  <button
                    onClick={() => onAutoRotateChange(!autoRotate)}
                    className={`relative w-12 h-6 rounded-full transition-all ${
                      autoRotate ? 'bg-crd-orange' : 'bg-crd-gray/30'
                    }`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      autoRotate ? 'translate-x-6' : ''
                    }`} />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-crd-lightGray mb-2">
                    Rotation Speed: {rotationSpeed}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={rotationSpeed}
                    onChange={(e) => onRotationSpeedChange(parseFloat(e.target.value))}
                    className="w-full accent-crd-orange"
                    disabled={!autoRotate}
                  />
                </div>

                {/* Orbital Controls */}
                <div className="pt-4 border-t border-crd-gray/20">
                  <h4 className="text-md font-medium text-white mb-3">Orbital Ring</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-crd-lightGray">Show Ring</label>
                      <button
                        onClick={() => onShowOrbitalRingChange?.(!showOrbitalRing)}
                        className={`relative w-12 h-6 rounded-full transition-all ${
                          showOrbitalRing ? 'bg-crd-orange' : 'bg-crd-gray/30'
                        }`}
                      >
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          showOrbitalRing ? 'translate-x-6' : ''
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-crd-lightGray">Auto Rotate Ring</label>
                      <button
                        onClick={() => onOrbitalAutoRotateChange?.(!orbitalAutoRotate)}
                        className={`relative w-12 h-6 rounded-full transition-all ${
                          orbitalAutoRotate ? 'bg-crd-orange' : 'bg-crd-gray/30'
                        }`}
                      >
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          orbitalAutoRotate ? 'translate-x-6' : ''
                        }`} />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-crd-lightGray mb-2">
                        Ring Speed: {orbitalRotationSpeed}
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={orbitalRotationSpeed}
                        onChange={(e) => onOrbitalRotationSpeedChange?.(parseFloat(e.target.value))}
                        className="w-full accent-crd-orange"
                        disabled={!orbitalAutoRotate}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Lighting Controls */}
            {activeTab === 'lighting' && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white mb-4">Lighting Setup</h3>
                
                <div>
                  <label className="block text-sm font-medium text-crd-lightGray mb-2">
                    Lighting Preset
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['studio', 'dramatic', 'soft'] as LightingPreset[]).map((preset) => (
                      <button
                        key={preset}
                        onClick={() => onLightingPresetChange(preset)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                          lightingPreset === preset
                            ? 'bg-crd-orange text-white'
                            : 'bg-crd-gray/20 text-crd-lightGray hover:bg-crd-gray/30'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-crd-lightGray mb-2">
                    Intensity: {lightingIntensity}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={lightingIntensity}
                    onChange={(e) => onLightingIntensityChange(parseFloat(e.target.value))}
                    className="w-full accent-crd-orange"
                  />
                </div>

                {/* Glass Case Control */}
                <div className="pt-4 border-t border-crd-gray/20">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-crd-lightGray">Glass Case</label>
                    <button
                      onClick={() => onEnableGlassCaseChange?.(!enableGlassCase)}
                      className={`relative w-12 h-6 rounded-full transition-all ${
                        enableGlassCase ? 'bg-crd-orange' : 'bg-crd-gray/30'
                      }`}
                    >
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        enableGlassCase ? 'translate-x-6' : ''
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};