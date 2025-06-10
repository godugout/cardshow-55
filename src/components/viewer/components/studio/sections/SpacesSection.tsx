
import React from 'react';
import { CollapsibleSection } from '@/components/ui/design-system';
import type { SpaceEnvironment, SpaceControls } from '../../../spaces/types';
import type { EnvironmentScene, EnvironmentControls, BackgroundType } from '../../../types';
import { 
  SceneGrid, 
  SpaceEnvironmentGrid, 
  CardPhysicsSection, 
  EnvironmentControlsSection,
  SPACE_ENVIRONMENTS 
} from './spaces';
import { EnhancedCameraControlsSection } from './spaces/EnhancedCameraControlsSection';

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
  const statusText = backgroundType === '3dSpace' && selectedSpace
    ? `${selectedSpace.name} (3D Space)` 
    : `${selectedScene.name} (Scene)`;

  const handleSceneChange = (scene: EnvironmentScene) => {
    console.log('🎬 Scene changed to:', scene.name);
    onSceneChange(scene);
    onBackgroundTypeChange('scene');
  };

  const handleSpaceChange = (space: SpaceEnvironment) => {
    console.log('🌌 Space changed to:', space.name);
    onSpaceChange(space);
    onBackgroundTypeChange('3dSpace');
  };

  return (
    <CollapsibleSection
      title="Spaces"
      emoji="🌌"
      statusText={statusText}
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

        {/* 3D Space Controls (only show when 3D space is active) */}
        {backgroundType === '3dSpace' && (
          <>
            {/* Enhanced Camera Controls */}
            <EnhancedCameraControlsSection
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

        {/* Environment Controls (for both 2D and 3D) */}
        <EnvironmentControlsSection
          environmentControls={environmentControls}
          onEnvironmentControlsChange={onEnvironmentControlsChange}
        />

        {/* Enhanced Feature Status */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-400/30">
          <div className="text-purple-300 text-xs font-medium mb-1 flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            🚀 Enhanced Studio Controls
          </div>
          <div className="text-white/70 text-xs">
            All controls now provide real-time visual feedback. 
            Mode: {backgroundType === '3dSpace' ? '3D Immersive' : '2D Enhanced'}
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
};
