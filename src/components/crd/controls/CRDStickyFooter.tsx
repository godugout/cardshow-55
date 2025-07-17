import React, { useState } from 'react';
import { Settings, ChevronUp, X } from 'lucide-react';
import { CRDControlPanel } from './CRDControlPanel';
import { type AnimationMode, type LightingPreset } from '../types/CRDTypes';

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
  
  // Lighting Settings  
  lightingPreset: LightingPreset;
  lightingIntensity: number;
  onLightingPresetChange: (preset: LightingPreset) => void;
  onLightingIntensityChange: (intensity: number) => void;
}

export const CRDStickyFooter: React.FC<CRDStickyFooterProps> = (props) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      >
        <Settings className="w-5 h-5" />
      </button>
    );
  }

  return (
    <>
      {/* Expanded Overlay */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Sticky Footer */}
      <div 
        className={`
          fixed bottom-0 left-0 right-0 z-50 
          transform transition-all duration-300 ease-out
          ${isHovered || isExpanded ? 'translate-y-0' : 'translate-y-12'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Expanded Panel */}
        {isExpanded && (
          <div className="absolute bottom-full left-4 right-4 mb-2 max-w-4xl mx-auto">
            <CRDControlPanel
              {...props}
              className="shadow-2xl border-2 border-primary/20"
            />
          </div>
        )}

        {/* Footer Bar */}
        <div className="bg-card/95 backdrop-blur-md border-t border-border shadow-2xl">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Quick Status */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {props.animationMode.charAt(0).toUpperCase() + props.animationMode.slice(1)}
                </span>
                <span>•</span>
                <span>{props.selectedStyleId}</span>
                <span>•</span>
                <span>
                  {props.lightingPreset.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleExpanded}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Controls</span>
                  <ChevronUp className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
                
                <button
                  onClick={handleClose}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};