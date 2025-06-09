import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Orbit, RotateCcw, Move3D, Globe } from 'lucide-react';
import { CollapsibleSection } from '@/components/ui/design-system';
import { EnhancedColoredSlider } from '../../EnhancedColoredSlider';
import { cn } from '@/lib/utils';
import type { SpaceEnvironment, SpaceControls } from '../../../spaces/types';
import type { EnvironmentScene, EnvironmentControls } from '../../../types';
import { ENVIRONMENT_SCENES } from '../../../constants';

interface SpacesSectionProps {
  selectedSpace?: SpaceEnvironment;
  spaceControls: SpaceControls;
  selectedScene: EnvironmentScene;
  environmentControls: EnvironmentControls;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onSpaceChange?: (space: SpaceEnvironment) => void;
  onControlsChange: (controls: SpaceControls) => void;
  onSceneChange: (scene: EnvironmentScene) => void;
  onEnvironmentControlsChange: (controls: EnvironmentControls) => void;
  onResetCamera?: () => void;
}

// All 10 space environments with diverse themes
const SPACE_ENVIRONMENTS: SpaceEnvironment[] = [
  {
    id: 'void',
    name: 'Dark Void',
    description: 'Infinite darkness with subtle stars',
    previewUrl: '/api/placeholder/120/80',
    type: 'void',
    emoji: '🌌',
    config: {
      backgroundColor: '#000000',
      ambientColor: '#404040',
      lightIntensity: 0.3,
      particleCount: 5000,
      animationSpeed: 1
    }
  },
  {
    id: 'nebula',
    name: 'Cosmic Nebula',
    description: 'Colorful cosmic clouds and particles',
    previewUrl: '/api/placeholder/120/80',
    type: 'cosmic',
    emoji: '✨',
    config: {
      backgroundColor: '#1a0033',
      ambientColor: '#ff00ff',
      lightIntensity: 0.6,
      particleCount: 5000,
      animationSpeed: 2
    }
  },
  {
    id: 'studio-space',
    name: 'Studio Space',
    description: 'Clean minimal space with soft lighting',
    previewUrl: '/api/placeholder/120/80',
    type: 'studio',
    emoji: '⚪',
    config: {
      backgroundColor: '#f0f0f0',
      ambientColor: '#ffffff',
      lightIntensity: 1.0,
      particleCount: 0,
      animationSpeed: 0
    }
  },
  {
    id: 'abstract-flow',
    name: 'Abstract Flow',
    description: 'Flowing geometric patterns',
    previewUrl: '/api/placeholder/120/80',
    type: 'abstract',
    emoji: '🔮',
    config: {
      backgroundColor: '#4338ca',
      ambientColor: '#8b5cf6',
      lightIntensity: 0.8,
      particleCount: 2000,
      animationSpeed: 3
    }
  },
  {
    id: 'matrix-code',
    name: 'Matrix Code',
    description: 'Flowing green digital rain',
    previewUrl: '/api/placeholder/120/80',
    type: 'matrix',
    emoji: '🔢',
    config: {
      backgroundColor: '#001100',
      ambientColor: '#00ff00',
      lightIntensity: 0.4,
      particleCount: 3000,
      animationSpeed: 1.5
    }
  },
  {
    id: 'cartoon-world',
    name: 'Cartoon World',
    description: 'Whimsical colorful cartoon environment',
    previewUrl: '/api/placeholder/120/80',
    type: 'cartoon',
    emoji: '🎨',
    config: {
      backgroundColor: '#87CEEB',
      ambientColor: '#ffeb3b',
      lightIntensity: 1.2,
      particleCount: 1000,
      animationSpeed: 0.5
    }
  },
  {
    id: 'sketch-art',
    name: 'Sketch Art',
    description: 'Hand-drawn artistic sketch style',
    previewUrl: '/api/placeholder/120/80',
    type: 'sketch',
    emoji: '✏️',
    config: {
      backgroundColor: '#f5f5f5',
      ambientColor: '#333333',
      lightIntensity: 0.9,
      particleCount: 0,
      animationSpeed: 0.2
    }
  },
  {
    id: 'neon-city',
    name: 'Neon City',
    description: 'Cyberpunk cityscape with neon lights',
    previewUrl: '/api/placeholder/120/80',
    type: 'neon',
    emoji: '🌆',
    config: {
      backgroundColor: '#0a0a0a',
      ambientColor: '#ff00ff',
      lightIntensity: 0.7,
      particleCount: 800,
      animationSpeed: 1.5
    }
  },
  {
    id: 'forest-glade',
    name: 'Forest Glade',
    description: 'Natural woodland with dappled light',
    previewUrl: '/api/placeholder/120/80',
    type: 'forest',
    emoji: '🌲',
    config: {
      backgroundColor: '#90EE90',
      ambientColor: '#228B22',
      lightIntensity: 0.8,
      particleCount: 1000,
      animationSpeed: 0.3
    }
  },
  {
    id: 'ocean-depths',
    name: 'Ocean Depths',
    description: 'Underwater scene with floating bubbles',
    previewUrl: '/api/placeholder/120/80',
    type: 'ocean',
    emoji: '🌊',
    config: {
      backgroundColor: '#006994',
      ambientColor: '#20B2AA',
      lightIntensity: 0.6,
      particleCount: 500,
      animationSpeed: 0.8
    }
  }
];

export const SpacesSection: React.FC<SpacesSectionProps> = ({
  selectedSpace = SPACE_ENVIRONMENTS[0],
  spaceControls,
  selectedScene,
  environmentControls,
  isOpen,
  onToggle,
  onSpaceChange = () => {},
  onControlsChange,
  onSceneChange,
  onEnvironmentControlsChange,
  onResetCamera = () => {}
}) => {
  const updateControl = (key: keyof SpaceControls, value: number | boolean) => {
    onControlsChange({
      ...spaceControls,
      [key]: value
    });
  };

  const updateEnvironmentControl = (key: keyof EnvironmentControls, value: number) => {
    onEnvironmentControlsChange({
      ...environmentControls,
      [key]: value
    });
  };

  const categories = ['natural', 'fantasy', 'futuristic', 'architectural'] as const;
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'natural': return '🌿';
      case 'fantasy': return '✨';
      case 'futuristic': return '🚀';
      case 'architectural': return '🏛️';
      default: return '🌍';
    }
  };

  const statusText = `${selectedSpace.name} • ${selectedScene.name}`;

  return (
    <CollapsibleSection
      title="Spaces"
      emoji="🌌"
      statusText={statusText}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-6">
        {/* Environment Categories */}
        <div className="space-y-3">
          <h4 className="text-white font-medium text-sm flex items-center">
            <Globe className="w-4 h-4 text-blue-400 mr-2" />
            Scenes
          </h4>
          
          {categories.map((category) => {
            const categoryScenes = ENVIRONMENT_SCENES.filter(s => s.category === category);
            if (categoryScenes.length === 0) return null;

            return (
              <div key={category} className="space-y-2">
                <h5 className="text-white/70 font-medium text-xs flex items-center capitalize">
                  <span className="mr-2">{getCategoryIcon(category)}</span>
                  {category}
                </h5>
                
                <div className="grid grid-cols-2 gap-2">
                  {categoryScenes.map((scene) => (
                    <button
                      key={scene.id}
                      onClick={() => onSceneChange(scene)}
                      className={cn(
                        "relative aspect-video rounded-lg overflow-hidden transition-all border-2",
                        selectedScene.id === scene.id 
                          ? 'border-blue-400 scale-105 shadow-lg shadow-blue-400/20' 
                          : 'border-white/20 hover:border-white/40 opacity-80 hover:opacity-100'
                      )}
                    >
                      <img
                        src={scene.previewUrl}
                        alt={scene.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-end p-2">
                        <div className="text-white text-xs font-medium">
                          {scene.name}
                        </div>
                      </div>
                      {selectedScene.id === scene.id && (
                        <div className="absolute top-2 right-2">
                          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* 3D Space Environment Selection */}
        <div className="space-y-3 border-t border-white/10 pt-4">
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
                <div 
                  className="w-full h-full flex items-center justify-center text-2xl"
                  style={{ 
                    background: `linear-gradient(135deg, ${space.config.backgroundColor}80, ${space.config.ambientColor}40)`
                  }}
                >
                  {space.emoji}
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

        {/* Environment Controls */}
        <div className="space-y-4 border-t border-white/10 pt-4">
          <h4 className="text-white font-medium flex items-center">
            Environment Controls
          </h4>

          {/* Depth of Field */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <Label className="text-white text-sm mb-3 block font-medium">
              Depth of Field: {environmentControls.depthOfField.toFixed(1)}
            </Label>
            <EnhancedColoredSlider
              value={[environmentControls.depthOfField]}
              onValueChange={([value]) => updateEnvironmentControl('depthOfField', value)}
              min={0}
              max={5}
              step={0.1}
              isActive={environmentControls.depthOfField > 0}
              styleColor="#45B26B"
              effectName="Depth of Field"
            />
          </div>

          {/* Parallax Intensity */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <Label className="text-white text-sm mb-3 block font-medium">
              Parallax Intensity: {environmentControls.parallaxIntensity.toFixed(1)}
            </Label>
            <EnhancedColoredSlider
              value={[environmentControls.parallaxIntensity]}
              onValueChange={([value]) => updateEnvironmentControl('parallaxIntensity', value)}
              min={0}
              max={3}
              step={0.1}
              isActive={environmentControls.parallaxIntensity > 0}
              styleColor="#3B82F6"
              effectName="Parallax"
            />
          </div>

          {/* Field of View */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <Label className="text-white text-sm mb-3 block font-medium">
              Field of View: {environmentControls.fieldOfView}°
            </Label>
            <EnhancedColoredSlider
              value={[environmentControls.fieldOfView]}
              onValueChange={([value]) => updateEnvironmentControl('fieldOfView', value)}
              min={60}
              max={120}
              step={5}
              isActive={environmentControls.fieldOfView !== 75}
              styleColor="#8B5CF6"
              effectName="Field of View"
            />
          </div>

          {/* Atmospheric Density */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <Label className="text-white text-sm mb-3 block font-medium">
              Atmospheric Density: {(environmentControls.atmosphericDensity * 100).toFixed(0)}%
            </Label>
            <EnhancedColoredSlider
              value={[environmentControls.atmosphericDensity]}
              onValueChange={([value]) => updateEnvironmentControl('atmosphericDensity', value)}
              min={0}
              max={2}
              step={0.1}
              isActive={environmentControls.atmosphericDensity !== 1}
              styleColor="#F59E0B"
              effectName="Atmospheric Density"
            />
          </div>
        </div>

        {/* Feature Status */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-400/30">
          <div className="text-purple-300 text-xs font-medium mb-1">
            🚀 Unified Spaces & Environments
          </div>
          <div className="text-white/70 text-xs">
            Complete control over backgrounds, 3D environments, camera behavior, and atmospheric effects.
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
};
