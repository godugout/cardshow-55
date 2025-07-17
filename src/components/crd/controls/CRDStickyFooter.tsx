import React, { useState } from 'react';
import { Play, RotateCw, Palette, ChevronUp, X, Square } from 'lucide-react';
import { CRDVisualStyles } from '../styles/StyleRegistry';
import { type AnimationMode, type LightingPreset } from '../types/CRDTypes';

interface CRDStickyFooterProps {
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
}

type DrawerHeight = 'collapsed' | 'small' | 'medium' | 'large';

export const CRDStickyFooter: React.FC<CRDStickyFooterProps> = ({
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
  showLockIndicators = true,
  onOrbitalAutoRotateChange,
  onOrbitalRotationSpeedChange,
  onShowOrbitalRingChange,
  onShowLockIndicatorsChange
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [drawerHeight, setDrawerHeight] = useState<DrawerHeight>('collapsed');
  const [isHovered, setIsHovered] = useState(false);

  // Pre-orchestrated animations
  const animationModes: { id: AnimationMode; name: string; icon: any }[] = [
    { id: 'monolith', name: 'Monolith', icon: Square },
    { id: 'showcase', name: 'Showcase', icon: Play },
    { id: 'ice', name: 'Ice', icon: Square },
    { id: 'gold', name: 'Gold', icon: Square },
    { id: 'glass', name: 'Glass', icon: Square },
    { id: 'holo', name: 'Holo', icon: Square }
  ];

  const getDrawerHeightClass = (height: DrawerHeight) => {
    switch (height) {
      case 'collapsed': return 'h-0 opacity-0';
      case 'small': return 'h-40 opacity-100';
      case 'medium': return 'h-60 opacity-100';
      case 'large': return 'h-80 opacity-100';
    }
  };

  const toggleHeight = () => {
    if (drawerHeight === 'collapsed') {
      setDrawerHeight('medium');
    } else {
      setDrawerHeight('collapsed');
    }
  };

  const activeStyle = CRDVisualStyles.find(s => s.id === selectedStyleId);

  if (!isVisible) {
    return (
      <div 
        className="fixed bottom-4 right-4 z-50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={() => setIsVisible(true)}
          className="bg-background/20 backdrop-blur-sm text-foreground rounded-full p-3 shadow-lg transition-all duration-300 hover:bg-background/40"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Header Bar - Always visible */}
      <div 
        className="bg-background/20 backdrop-blur-md border-t border-white/10 px-4 py-2 cursor-pointer transition-all duration-300 hover:bg-background/30"
        onClick={toggleHeight}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Quick Status */}
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-sm text-foreground/80">
                {activeStyle?.displayName || 'Unknown'} • {animationMode.toUpperCase()}
              </span>
            </div>
            
            {/* Quick Animation Toggle */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                const modes: AnimationMode[] = ['monolith', 'showcase', 'ice', 'gold', 'glass', 'holo'];
                const currentIndex = modes.indexOf(animationMode);
                const nextMode = modes[(currentIndex + 1) % modes.length];
                onAnimationModeChange(nextMode);
              }}
              className="p-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Play className="w-4 h-4" />
            </button>

            {/* Quick Rotation Toggle */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAutoRotateChange(!autoRotate);
              }}
              className={`p-1 rounded transition-colors ${autoRotate ? 'bg-primary/20 text-primary' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Expand/Collapse */}
            <button 
              onClick={toggleHeight}
              className="p-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronUp className={`w-4 h-4 transition-transform ${drawerHeight === 'collapsed' ? '' : 'rotate-180'}`} />
            </button>
            
            {/* Hide */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsVisible(false);
              }}
              className="p-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      <div className={`bg-background/30 backdrop-blur-md transition-all duration-300 overflow-hidden ${getDrawerHeightClass(drawerHeight)}`}>
        <div className="p-4 h-full overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Animation Controls */}
            <div className="bg-card/50 backdrop-blur rounded-lg p-3">
              <h4 className="text-sm font-medium mb-2 text-foreground/80">Animation</h4>
              <div className="grid grid-cols-2 gap-1">
                {animationModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => onAnimationModeChange(mode.id)}
                    className={`p-2 rounded-md text-xs transition-colors ${
                      animationMode === mode.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-white/10 hover:bg-white/20 text-foreground/80'
                    }`}
                  >
                    {mode.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Rotation Controls */}
            <div className="bg-card/50 backdrop-blur rounded-lg p-3">
              <h4 className="text-sm font-medium mb-2 text-foreground/80">Rotation</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="auto-rotate" className="text-xs">Auto Rotate</label>
                  <input
                    id="auto-rotate"
                    type="checkbox"
                    checked={autoRotate}
                    onChange={(e) => onAutoRotateChange(e.target.checked)}
                    className="rounded"
                  />
                </div>
                {autoRotate && (
                  <div className="space-y-1">
                    <label htmlFor="rotation-speed" className="text-xs">Speed</label>
                    <input
                      id="rotation-speed"
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={rotationSpeed}
                      onChange={(e) => onRotationSpeedChange(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Orbital Controls */}
            <div className="bg-card/50 backdrop-blur rounded-lg p-3">
              <h4 className="text-sm font-medium mb-2 text-foreground/80">Orbital Ring</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="orbital-auto-rotate" className="text-xs">Auto Orbit</label>
                  <input
                    id="orbital-auto-rotate"
                    type="checkbox"
                    checked={orbitalAutoRotate}
                    onChange={(e) => onOrbitalAutoRotateChange?.(e.target.checked)}
                    className="rounded"
                  />
                </div>
                {orbitalAutoRotate && (
                  <div className="space-y-1">
                    <label htmlFor="orbital-speed" className="text-xs">Orbit Speed</label>
                    <input
                      id="orbital-speed"
                      type="range"
                      min="0.1"
                      max="5"
                      step="0.1"
                      value={orbitalRotationSpeed}
                      onChange={(e) => onOrbitalRotationSpeedChange?.(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <label htmlFor="show-ring" className="text-xs">Show Ring</label>
                  <input
                    id="show-ring"
                    type="checkbox"
                    checked={showOrbitalRing}
                    onChange={(e) => onShowOrbitalRingChange?.(e.target.checked)}
                    className="rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="show-locks" className="text-xs">Lock Indicators</label>
                  <input
                    id="show-locks"
                    type="checkbox"
                    checked={showLockIndicators}
                    onChange={(e) => onShowLockIndicatorsChange?.(e.target.checked)}
                    className="rounded"
                  />
                </div>
              </div>
            </div>

            {/* Material Selection */}
            <div className="bg-card/50 backdrop-blur rounded-lg p-3">
              <h4 className="text-sm font-medium mb-2 text-foreground/80">Material</h4>
              <div className="grid grid-cols-3 gap-1">
                {CRDVisualStyles.slice(0, 12).map((style) => (
                  <button
                    key={style.id}
                    onClick={() => onStyleChange(style.id)}
                    className={`aspect-square rounded-md text-xs transition-colors relative ${
                      selectedStyleId === style.id
                        ? 'ring-2 ring-primary'
                        : 'hover:ring-1 hover:ring-white/30'
                    }`}
                    style={{
                      background: style.uiPreviewGradient || '#333',
                    }}
                    title={style.displayName}
                  >
                    {style.locked && (
                      <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};