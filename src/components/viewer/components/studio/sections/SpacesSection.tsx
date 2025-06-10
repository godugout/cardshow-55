
import React, { useState } from 'react';
import { CollapsibleSection } from '@/components/ui/design-system';
import type { SpaceEnvironment, SpaceControls, HDRIEnvironment } from '../../../spaces/types';
import type { EnvironmentScene, EnvironmentControls, BackgroundType } from '../../../types';
import { 
  SceneGrid, 
  SpaceEnvironmentGrid, 
  HDRIEnvironmentGrid,
  CameraControlsSection, 
  CardPhysicsSection, 
  EnvironmentControlsSection,
  SPACE_ENVIRONMENTS,
  HDRI_ENVIRONMENTS
} from './spaces';

interface SpacesSectionProps {
  selectedSpace?: SpaceEnvironment | null;
  spaceControls?: SpaceControls;
  selectedScene: EnvironmentScene;
  environmentControls: EnvironmentControls;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onSpaceChange?: (space: SpaceEnvironment) => void;
  onSpaceControlsChange?: (controls: SpaceControls) => void;
  onSceneChange: (scene: EnvironmentScene) => void;
  onEnvironmentControlsChange: (controls: EnvironmentControls) => void;
  onResetCamera?: () => void;
  backgroundType?: BackgroundType;
  onBackgroundTypeChange?: (type: BackgroundType) => void;
}

export const SpacesSection: React.FC<SpacesSectionProps> = ({
  selectedSpace = null,
  spaceControls = {
    orbitSpeed: 0.5,
    floatIntensity: 1.0,
    cameraDistance: 8,
    autoRotate: false,
    gravityEffect: 0.0
  },
  selectedScene,
  environmentControls,
  isOpen,
  onToggle,
  onSpaceChange = () => {},
  onSpaceControlsChange = () => {},
  onSceneChange,
  onEnvironmentControlsChange,
  onResetCamera = () => {},
  backgroundType = 'scene',
  onBackgroundTypeChange = () => {}
}) => {
  const [selectedHDRI, setSelectedHDRI] = useState<HDRIEnvironment | null>(null);

  const getStatusText = () => {
    if (backgroundType === '3dSpace' && selectedSpace) {
      return `${selectedSpace.name} (3D Space)`;
    } else if (backgroundType === 'hdri' && selectedHDRI) {
      return `${selectedHDRI.name} (HDRI)`;
    }
    return `${selectedScene.name} (Scene)`;
  };

  const handleSceneChange = (scene: EnvironmentScene) => {
    onSceneChange(scene);
    onBackgroundTypeChange('scene');
  };

  const handleSpaceChange = (space: SpaceEnvironment) => {
    onSpaceChange(space);
    onBackgroundTypeChange('3dSpace');
    setSelectedHDRI(null);
  };

  const handleHDRIChange = (hdri: HDRIEnvironment) => {
    setSelectedHDRI(hdri);
    onBackgroundTypeChange('hdri');
    // Convert HDRI to scene format for compatibility
    const hdriAsScene: EnvironmentScene = {
      id: hdri.id,
      name: hdri.name,
      icon: '🎯',
      category: 'natural',
      description: `HDRI environment: ${hdri.name}`,
      previewUrl: hdri.previewUrl,
      hdriUrl: hdri.hdriUrl,
      panoramicUrl: hdri.fallbackUrl || hdri.previewUrl,
      backgroundImage: hdri.fallbackUrl || hdri.previewUrl,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      lighting: {
        color: '#ffffff',
        intensity: 1.0,
        azimuth: 180,
        elevation: 45
      },
      atmosphere: {
        fog: false,
        fogColor: '#ffffff',
        fogDensity: 0.01,
        particles: false
      },
      depth: {
        layers: 3,
        parallaxIntensity: 0.5,
        fieldOfView: 75
      }
    };
    onSceneChange(hdriAsScene);
  };

  const isControlsActive = backgroundType === '3dSpace' || backgroundType === 'hdri';

  return (
    <CollapsibleSection
      title="Spaces & Environments"
      emoji="🌌"
      statusText={getStatusText()}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-6">
        {/* Environment Scenes */}
        <SceneGrid
          selectedScene={selectedScene}
          onSceneChange={handleSceneChange}
          isActive={backgroundType === 'scene'}
        />

        {/* 3D Space Environment Selection */}
        <SpaceEnvironmentGrid
          selectedSpace={selectedSpace || SPACE_ENVIRONMENTS[0]}
          onSpaceChange={handleSpaceChange}
          isActive={backgroundType === '3dSpace'}
        />

        {/* HDRI Environment Selection */}
        <HDRIEnvironmentGrid
          selectedHDRI={selectedHDRI}
          onHDRIChange={handleHDRIChange}
          isActive={backgroundType === 'hdri'}
        />

        {/* Controls (show when 3D space or HDRI is active) */}
        {isControlsActive && (
          <>
            {/* Camera Controls */}
            <CameraControlsSection
              spaceControls={spaceControls}
              onControlsChange={onSpaceControlsChange}
              onResetCamera={onResetCamera}
            />

            {/* Card Physics */}
            <CardPhysicsSection
              spaceControls={spaceControls}
              onControlsChange={onSpaceControlsChange}
            />
          </>
        )}

        {/* Environment Controls (for all types) */}
        <EnvironmentControlsSection
          environmentControls={environmentControls}
          onEnvironmentControlsChange={onEnvironmentControlsChange}
        />

        {/* Feature Status */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-400/30">
          <div className="text-purple-300 text-xs font-medium mb-1">
            🚀 Enhanced Environments
          </div>
          <div className="text-white/70 text-xs">
            Switch between 2D scenes, 3D spaces, and HDRI environments. Active: {
              backgroundType === '3dSpace' ? '3D Space' : 
              backgroundType === 'hdri' ? 'HDRI Environment' : 
              '2D Scene'
            }
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
};
