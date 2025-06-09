
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Orbit, RotateCcw, Move3D } from 'lucide-react';
import { CollapsibleSection } from '@/components/ui/design-system';
import { EnhancedColoredSlider } from '../../EnhancedColoredSlider';
import { cn } from '@/lib/utils';

interface SpaceEnvironment {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  type: 'void' | 'cosmic' | 'studio' | 'abstract';
}

interface SpaceControls {
  orbitSpeed: number;
  floatIntensity: number;
  cameraDistance: number;
  autoRotate: boolean;
  gravityEffect: number;
}

interface SpacesSectionProps {
  selectedSpace?: SpaceEnvironment;
  spaceControls: SpaceControls;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onSpaceChange?: (space: SpaceEnvironment) => void;
  onControlsChange: (controls: SpaceControls) => void;
  onResetCamera?: () => void;
}

// Mock space environments for the proposal
const SPACE_ENVIRONMENTS: SpaceEnvironment[] = [
  {
    id: 'void',
    name: 'Dark Void',
    description: 'Infinite darkness with subtle stars',
    previewUrl: '/api/placeholder/120/80',
    type: 'void'
  },
  {
    id: 'nebula',
    name: 'Cosmic Nebula',
    description: 'Colorful cosmic clouds and particles',
    previewUrl: '/api/placeholder/120/80',
    type: 'cosmic'
  },
  {
    id: 'studio-space',
    name: 'Studio Space',
    description: 'Clean minimal space with soft lighting',
    previewUrl: '/api/placeholder/120/80',
    type: 'studio'
  },
  {
    id: 'abstract-flow',
    name: 'Abstract Flow',
    description: 'Flowing geometric patterns',
    previewUrl: '/api/placeholder/120/80',
    type: 'abstract'
  }
];

export const SpacesSection: React.FC<SpacesSectionProps> = ({
  selectedSpace = SPACE_ENVIRONMENTS[0],
  spaceControls,
  isOpen,
  onToggle,
  onSpaceChange = () => {},
  onControlsChange,
  onResetCamera = () => {}
}) => {
  const updateControl = (key: keyof SpaceControls, value: number | boolean) => {
    onControlsChange({
      ...spaceControls,
      [key]: value
    });
  };

  const statusText = selectedSpace.name;

  return (
    <CollapsibleSection
      title="Spaces"
      emoji="🌌"
      statusText={statusText}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-6">
        {/* Space Environment Selection */}
        <div className="space-y-3">
          <h4 className="text-white font-medium text-sm flex items-center">
            <Orbit className="w-4 h-4 text-purple-400 mr-2" />
            3D Spaces
          </h4>
          
          <div className="grid grid-cols-2 gap-2">
            {SPACE_ENVIRONMENTS.map((space) => (
              <button
                key={space.id}
                onClick={() => onSpaceChange(space)}
                className={cn(
                  "relative aspect-video rounded-lg overflow-hidden transition-all border-2",
                  selectedSpace.id === space.id 
                    ? 'border-purple-400 scale-105 shadow-lg shadow-purple-400/20' 
                    : 'border-white/20 hover:border-white/40 opacity-80 hover:opacity-100'
                )}
              >
                <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center">
                  <span className="text-2xl">{space.type === 'void' ? '🌌' : space.type === 'cosmic' ? '✨' : space.type === 'studio' ? '⚪' : '🔮'}</span>
                </div>
                <div className="absolute inset-0 bg-black/20 flex items-end p-2">
                  <div className="text-white text-xs font-medium">
                    {space.name}
                  </div>
                </div>
                {selectedSpace.id === space.id && (
                  <div className="absolute top-2 right-2">
                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Camera Controls */}
        <div className="space-y-4 border-t border-white/10 pt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-medium flex items-center">
              <Move3D className="w-4 h-4 text-blue-400 mr-2" />
              Camera Controls
            </h4>
            <Button
              onClick={onResetCamera}
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs bg-transparent text-white border-white/20 hover:border-white/40"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>

          {/* Orbit Speed */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <Label className="text-white text-sm mb-3 block font-medium">
              Orbit Speed: {spaceControls.orbitSpeed.toFixed(1)}
            </Label>
            <EnhancedColoredSlider
              value={[spaceControls.orbitSpeed]}
              onValueChange={([value]) => updateControl('orbitSpeed', value)}
              min={0}
              max={2}
              step={0.1}
              isActive={spaceControls.orbitSpeed > 0}
              styleColor="#8B5CF6"
              effectName="Orbit Speed"
            />
          </div>

          {/* Camera Distance */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <Label className="text-white text-sm mb-3 block font-medium">
              Camera Distance: {spaceControls.cameraDistance.toFixed(1)}
            </Label>
            <EnhancedColoredSlider
              value={[spaceControls.cameraDistance]}
              onValueChange={([value]) => updateControl('cameraDistance', value)}
              min={3}
              max={15}
              step={0.5}
              isActive={spaceControls.cameraDistance !== 8}
              styleColor="#06B6D4"
              effectName="Camera Distance"
            />
          </div>
        </div>

        {/* Card Physics */}
        <div className="space-y-4 border-t border-white/10 pt-4">
          <h4 className="text-white font-medium flex items-center">
            Card Physics
          </h4>

          {/* Float Intensity */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <Label className="text-white text-sm mb-3 block font-medium">
              Float Intensity: {spaceControls.floatIntensity.toFixed(1)}
            </Label>
            <EnhancedColoredSlider
              value={[spaceControls.floatIntensity]}
              onValueChange={([value]) => updateControl('floatIntensity', value)}
              min={0}
              max={3}
              step={0.1}
              isActive={spaceControls.floatIntensity > 0}
              styleColor="#F59E0B"
              effectName="Float Intensity"
            />
          </div>

          {/* Gravity Effect */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <Label className="text-white text-sm mb-3 block font-medium">
              Gravity Effect: {spaceControls.gravityEffect.toFixed(1)}
            </Label>
            <EnhancedColoredSlider
              value={[spaceControls.gravityEffect]}
              onValueChange={([value]) => updateControl('gravityEffect', value)}
              min={0}
              max={2}
              step={0.1}
              isActive={spaceControls.gravityEffect > 0}
              styleColor="#10B981"
              effectName="Gravity Effect"
            />
          </div>

          {/* Auto Rotate Toggle */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-4 h-4 text-green-400" />
                <span className="text-white text-sm font-medium">Auto Rotate Card</span>
              </div>
              <Button
                onClick={() => updateControl('autoRotate', !spaceControls.autoRotate)}
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 px-3 text-xs transition-all",
                  spaceControls.autoRotate 
                    ? "bg-green-500 text-white border-green-500 hover:bg-green-600" 
                    : "bg-transparent text-white border-white/20 hover:border-white/40"
                )}
              >
                {spaceControls.autoRotate ? 'On' : 'Off'}
              </Button>
            </div>
          </div>
        </div>

        {/* Feature Status */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-400/30">
          <div className="text-purple-300 text-xs font-medium mb-1">
            🚧 Early Preview Feature
          </div>
          <div className="text-white/70 text-xs">
            360° navigation and floating physics are in early development. 
            Full functionality coming soon.
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
};
