
import React from 'react';
import { CollapsibleSection } from '@/components/ui/design-system';
import type { SpaceEnvironment, SpaceControls } from '../../../spaces/types';
import type { EnvironmentScene, EnvironmentControls } from '../../../types';
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
  onResetCamera = () => {}
}) => {
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
        {/* Environment Scenes */}
        <SceneGrid
          selectedScene={selectedScene}
          onSceneChange={onSceneChange}
        />

        {/* 3D Space Environment Selection */}
        <SpaceEnvironmentGrid
          selectedSpace={selectedSpace}
          onSpaceChange={onSpaceChange}
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
            Complete control over backgrounds, 3D environments, camera behavior, and atmospheric effects.
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
};
