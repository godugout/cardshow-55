import React from 'react';
import { Play, Pause, Eye, EyeOff, Package, PackageOpen, Sparkles, Zap, Orbit } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';

interface CRDBottomToolbarProps {
  selectedTemplate: string;
  colorPalette: string;
  effects: string[];
  // Quick action states
  isRotating?: boolean;
  onToggleRotation?: () => void;
  showMaterialsRing?: boolean;
  onToggleMaterialsRing?: () => void;
  showCase?: boolean;
  onToggleCase?: () => void;
  animationPreset?: 'subtle' | 'dynamic' | 'epic';
  onSetAnimationPreset?: (preset: 'subtle' | 'dynamic' | 'epic') => void;
}

export const CRDBottomToolbar: React.FC<CRDBottomToolbarProps> = ({
  selectedTemplate,
  colorPalette,
  effects,
  isRotating = false,
  onToggleRotation,
  showMaterialsRing = true,
  onToggleMaterialsRing,
  showCase = true,
  onToggleCase,
  animationPreset = 'subtle',
  onSetAnimationPreset
}) => {
  const animationPresets = [
    { id: 'subtle', label: 'Subtle', icon: Sparkles },
    { id: 'dynamic', label: 'Dynamic', icon: Zap },
    { id: 'epic', label: 'Epic', icon: Orbit }
  ] as const;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 bg-crd-darker/90 backdrop-blur-sm border border-crd-mediumGray/30 rounded-lg shadow-lg min-w-[600px]">
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        {/* Left Section - Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Rotation Toggle */}
          <CRDButton
            variant="outline"
            size="sm"
            onClick={onToggleRotation}
            className={`h-8 px-3 text-xs ${
              isRotating 
                ? 'bg-crd-blue/20 border-crd-blue/50 text-crd-blue' 
                : 'bg-crd-mediumGray/10 border-crd-mediumGray/30 text-crd-lightGray hover:bg-crd-mediumGray/20'
            }`}
            title={isRotating ? 'Stop rotation' : 'Start rotation'}
          >
            {isRotating ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
            {isRotating ? 'Stop' : 'Rotate'}
          </CRDButton>

          {/* Materials Ring Toggle */}
          <CRDButton
            variant="outline"
            size="sm"
            onClick={onToggleMaterialsRing}
            className={`h-8 px-3 text-xs ${
              showMaterialsRing 
                ? 'bg-crd-purple/20 border-crd-purple/50 text-crd-purple' 
                : 'bg-crd-mediumGray/10 border-crd-mediumGray/30 text-crd-lightGray hover:bg-crd-mediumGray/20'
            }`}
            title={showMaterialsRing ? 'Hide materials ring' : 'Show materials ring'}
          >
            {showMaterialsRing ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
            Materials
          </CRDButton>

          {/* Case Toggle */}
          <CRDButton
            variant="outline"
            size="sm"
            onClick={onToggleCase}
            className={`h-8 px-3 text-xs ${
              showCase 
                ? 'bg-crd-amber/20 border-crd-amber/50 text-crd-amber' 
                : 'bg-crd-mediumGray/10 border-crd-mediumGray/30 text-crd-lightGray hover:bg-crd-mediumGray/20'
            }`}
            title={showCase ? 'Remove case' : 'Show case'}
          >
            {showCase ? <Package className="w-3 h-3 mr-1" /> : <PackageOpen className="w-3 h-3 mr-1" />}
            Case
          </CRDButton>

          {/* Animation Presets */}
          <div className="flex items-center gap-1 ml-2 pl-2 border-l border-crd-mediumGray/30">
            {animationPresets.map((preset) => {
              const Icon = preset.icon;
              const isActive = animationPreset === preset.id;
              
              return (
                <CRDButton
                  key={preset.id}
                  variant="outline"
                  size="sm"
                  onClick={() => onSetAnimationPreset?.(preset.id)}
                  className={`h-8 px-2 text-xs ${
                    isActive
                      ? 'bg-crd-green/20 border-crd-green/50 text-crd-green'
                      : 'bg-crd-mediumGray/10 border-crd-mediumGray/30 text-crd-lightGray hover:bg-crd-mediumGray/20'
                  }`}
                  title={`${preset.label} animation preset`}
                >
                  <Icon className="w-3 h-3" />
                </CRDButton>
              );
            })}
          </div>
        </div>

        {/* Center Section - Condensed Card Info */}
        <div className="flex items-center gap-2">
          {/* Template */}
          <div className="px-2 py-1 rounded bg-crd-blue/20 text-crd-blue border border-crd-blue/30 text-xs font-medium">
            {selectedTemplate || 'None'}
          </div>
          
          {/* Colors */}
          <div className="px-2 py-1 rounded bg-crd-purple/20 text-crd-purple border border-crd-purple/30 text-xs font-medium">
            {colorPalette || 'Default'}
          </div>
          
          {/* Effects */}
          <div className="px-2 py-1 rounded bg-crd-amber/20 text-crd-amber border border-crd-amber/30 text-xs font-medium">
            {effects.length > 0 ? `${effects.length} FX` : 'No FX'}
          </div>

          {/* Status */}
          <div className="flex items-center gap-1 ml-1">
            <div className="w-1.5 h-1.5 bg-crd-green rounded-full animate-pulse"></div>
            <span className="text-crd-green text-xs font-medium">Ready</span>
          </div>
        </div>

        {/* Right Section - Future Expansion */}
        <div className="flex items-center gap-2">
          <div className="text-xs text-crd-lightGray/50">
            CRD Pro
          </div>
        </div>
      </div>
    </div>
  );
};