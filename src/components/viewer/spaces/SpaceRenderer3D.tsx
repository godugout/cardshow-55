
import React from 'react';
import { OptimizedSpaceRenderer } from './OptimizedSpaceRenderer';
import type { SpaceEnvironment, SpaceControls } from './types';
import type { CardData } from '@/types/card';

interface SpaceRenderer3DProps {
  environment: SpaceEnvironment;
  controls: SpaceControls;
  card: CardData;
  onCameraReset?: () => void;
  environmentIntensity?: number;
}

export const SpaceRenderer3D: React.FC<SpaceRenderer3DProps> = (props) => {
  return <OptimizedSpaceRenderer {...props} />;
};
