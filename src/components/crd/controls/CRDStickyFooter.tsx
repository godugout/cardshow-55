import React, { useState } from 'react';
import { Play, RotateCw, Palette, ChevronUp, X, Square } from 'lucide-react';
import { CRDVisualStyles } from '../styles/StyleRegistry';
import { type AnimationMode } from '../types/CRDTypes';

interface CRDStickyFooterProps {
  // Animation Settings
  animationMode: AnimationMode;
  animationIntensity: number;
  onAnimationModeChange: (mode: AnimationMode) => void;
  onAnimationIntensityChange: (intensity: number) => void;
  
  // Visual Style Settings
  selectedStyleId: string;
  onStyleChange: (styleId: string) => void;
  
  // Rotation Settings
  autoRotate: boolean;
  rotationSpeed: number;
  onAutoRotateChange: (enabled: boolean) => void;
  onRotationSpeedChange: (speed: number) => void;
}

type DrawerHeight = 'collapsed' | 'small' | 'medium' | 'large';

export const CRDStickyFooter: React.FC<CRDStickyFooterProps> = ({
  animationMode,
  selectedStyleId,
  autoRotate,
  rotationSpeed,
  onAnimationModeChange,
  onStyleChange,
  onAutoRotateChange,
  onRotationSpeedChange
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [drawerHeight, setDrawerHeight] = useState<DrawerHeight>('collapsed');
  const [isHovered, setIsHovered] = useState(false);

  // Pre-orchestrated animations
  const animations: { mode: AnimationMode; name: string; icon: any }[] = [
    { mode: 'monolith', name: 'Static', icon: Square },
    { mode: 'showcase', name: 'Showcase', icon: Play },
    { mode: 'holo', name: 'Holographic', icon: Play },
    { mode: 'ice', name: 'Ice Float', icon: Play },
    { mode: 'gold', name: 'Gold Shimmer', icon: Play },
    { mode: 'glass', name: 'Crystal', icon: Play }
  ];

  const heightMap = {
    collapsed: 'h-16',
    small: 'h-32', 
    medium: 'h-48',
    large: 'h-64'
  };

  const shouldShow = isVisible && (isHovered || drawerHeight !== 'collapsed');

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      >
        <Palette className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div 
      className={`
        fixed bottom-0 left-0 right-0 z-50 
        bg-card/95 backdrop-blur-md border-t border-border shadow-2xl
        transform transition-all duration-300 ease-out
        ${shouldShow ? 'translate-y-0' : 'translate-y-12'}
        ${heightMap[drawerHeight]}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Bar - Always Visible */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
        {/* Quick Status */}
        <div className="flex items-center gap-4 text-sm">
          <span className="font-medium text-foreground">
            {animationMode.charAt(0).toUpperCase() + animationMode.slice(1)}
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">
            {CRDVisualStyles.find(s => s.id === selectedStyleId)?.displayName || selectedStyleId}
          </span>
          {autoRotate && (
            <>
              <span className="text-muted-foreground">•</span>
              <span className="text-green-500 text-xs">Rotating</span>
            </>
          )}
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDrawerHeight(drawerHeight === 'large' ? 'collapsed' : 'large')}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
          >
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Controls</span>
            <ChevronUp className={`w-4 h-4 transition-transform ${drawerHeight !== 'collapsed' ? 'rotate-180' : ''}`} />
          </button>
          
          <button
            onClick={() => setIsVisible(false)}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Content */}
      {drawerHeight !== 'collapsed' && (
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Animation Controls */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Play className="w-4 h-4" />
                Animations
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {animations.map((anim) => (
                  <button
                    key={anim.mode}
                    onClick={() => onAnimationModeChange(anim.mode)}
                    className={`
                      p-2 text-xs rounded-md border transition-all duration-200
                      ${animationMode === anim.mode 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-muted/50 hover:bg-muted border-border'
                      }
                    `}
                  >
                    <div className="flex items-center gap-1 justify-center">
                      <anim.icon className="w-3 h-3" />
                      <span>{anim.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Rotation Controls */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <RotateCw className="w-4 h-4" />
                Rotation
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => onAutoRotateChange(!autoRotate)}
                  className={`
                    w-full p-2 text-sm rounded-md border transition-all duration-200
                    ${autoRotate 
                      ? 'bg-green-500 text-white border-green-500' 
                      : 'bg-muted/50 hover:bg-muted border-border'
                    }
                  `}
                >
                  {autoRotate ? 'Stop Rotation' : 'Auto Rotate'}
                </button>
                
                {autoRotate && (
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Speed</label>
                    <input
                      type="range"
                      min="0.1"
                      max="2"
                      step="0.1"
                      value={rotationSpeed}
                      onChange={(e) => onRotationSpeedChange(parseFloat(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-xs text-muted-foreground text-center">{rotationSpeed.toFixed(1)}x</div>
                  </div>
                )}
              </div>
            </div>

            {/* Material Selection */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Materials
              </h3>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-auto">
                {CRDVisualStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => onStyleChange(style.id)}
                    disabled={style.locked}
                    className={`
                      p-2 text-xs rounded-md border transition-all duration-200 text-left
                      ${selectedStyleId === style.id 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : style.locked
                        ? 'bg-muted/30 text-muted-foreground border-muted cursor-not-allowed'
                        : 'bg-muted/50 hover:bg-muted border-border'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{style.displayName}</span>
                      {style.locked && <span className="text-xs">🔒</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};