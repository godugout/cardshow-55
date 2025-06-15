
import React from 'react';
import { CollapsibleSection } from '@/components/ui/design-system';
import type { EnvironmentScene, EnvironmentControls } from '../../../types';
import { 
  SceneGrid, 
  EnvironmentControlsSection,
} from './spaces';

interface SpacesSectionProps {
  selectedScene: EnvironmentScene;
  environmentControls: EnvironmentControls;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onSceneChange: (scene: EnvironmentScene) => void;
  onEnvironmentControlsChange: (controls: EnvironmentControls) => void;
}

export const SpacesSection: React.FC<SpacesSectionProps> = ({
  selectedScene,
  environmentControls,
  isOpen,
  onToggle,
  onSceneChange,
  onEnvironmentControlsChange,
}) => {
  const statusText = selectedScene.name;

  return (
    <CollapsibleSection
      title="Environment"
      emoji="🏞️"
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

        {/* Environment Controls */}
        <EnvironmentControlsSection
          environmentControls={environmentControls}
          onEnvironmentControlsChange={onEnvironmentControlsChange}
        />
      </div>
    </CollapsibleSection>
  );
};
