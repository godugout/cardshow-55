
import React from 'react';
import { CollapsibleSection } from '@/components/ui/design-system';
import type { SpaceEnvironment, SpaceControls } from '../../../spaces/types';
import type { EnvironmentScene, EnvironmentControls, BackgroundType } from '../../../types';
import { 
  SceneGrid, 
  SpaceEnvironmentGrid, 
  CameraControlsSection, 
  CardPhysicsSection, 
  EnvironmentControlsSection,
  SPACE_ENVIRONMENTS 
} from './spaces';

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
  backgroundType?: BackgroundType;
  onBackgroundTypeChange?: (type: BackgroundType) => void;
}

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
  onResetCamera = () => {},
  backgroundType = 'scene',
  onBackgroundTypeChange = () => {}
}) => {
  const statusText = backgroundType === '3dSpace' 
    ? `${selectedSpace.name} (3D Space)` 
    : `${selectedScene.name} (Scene)`;

  const handleSceneChange = (scene: EnvironmentScene) => {
    onSceneChange(scene);
    onBackgroundTypeChange('scene');
  };

  const handleSpaceChange = (space: SpaceEnvironment) => {
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
          selectedSpace={selectedSpace}
          onSpaceChange={handleSpaceChange}
          isActive={backgroundType === '3dSpace'}
        />

        {/* Camera Controls */}
        <CameraControlsSection
          spaceControls={spaceControls}
          onControlsChange={onControlsChange}
          onResetCamera={onResetCamera}
        />

        {/* Card Physics */}
        <CardPhysicsSection
          spaceControls={spaceControls}
          onControlsChange={onControlsChange}
        />

        {/* Environment Controls */}
        <EnvironmentControlsSection
          environmentControls={environmentControls}
          onEnvironmentControlsChange={onEnvironmentControlsChange}
        />

        {/* Feature Status */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-400/30">
          <div className="text-purple-300 text-xs font-medium mb-1">
            🚀 Unified Spaces & Environments
          </div>
          <div className="text-white/70 text-xs">
            Switch between 2D scenes and immersive 3D environments. Active: {backgroundType === '3dSpace' ? '3D Space' : '2D Scene'}
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
};
