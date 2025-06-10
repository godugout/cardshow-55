
import React from 'react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { EnhancedCardCanvas } from './EnhancedCardCanvas';
import type { CardData } from '@/hooks/useCardEditor';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface SafeCardViewerProps {
  card: CardData;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  rotation: { x: number; y: number };
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  overallBrightness: number;
  interactiveLighting: boolean;
  materialSettings: MaterialSettings;
  onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  width?: number;
  height?: number;
}

const CardViewerFallback = () => (
  <div className="flex items-center justify-center w-full h-full bg-surface-dark rounded-lg border border-surface-accent">
    <div className="text-center p-8">
      <div className="text-text-muted mb-2">Card viewer encountered an error</div>
      <div className="text-text-secondary text-sm">Please try refreshing the page</div>
    </div>
  </div>
);

export const SafeCardViewer: React.FC<SafeCardViewerProps> = (props) => {
  return (
    <ErrorBoundary fallback={<CardViewerFallback />}>
      <EnhancedCardCanvas {...props} />
    </ErrorBoundary>
  );
};
