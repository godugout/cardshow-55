
import React from 'react';
import { EnvironmentSphere } from './EnvironmentSphere';
import type { EnvironmentScene } from '../types';

interface BackgroundRendererProps {
  selectedScene: EnvironmentScene;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
}

export const BackgroundRenderer: React.FC<BackgroundRendererProps> = React.memo(({
  selectedScene,
  mousePosition,
  isHovering,
}) => {
  return (
    <div className="absolute inset-0 z-0">
      <EnvironmentSphere
        scene={selectedScene}
        mousePosition={mousePosition}
        isHovering={isHovering}
      />
    </div>
  );
});

BackgroundRenderer.displayName = 'BackgroundRenderer';
