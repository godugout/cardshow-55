
import React from 'react';
import { ViewerLayout } from './ViewerLayout';
import { ViewerEffectsManager } from './ViewerEffectsManager';
import { useViewerContainerState } from '../hooks/useViewerContainerState';
import type { CardData } from '@/hooks/useCardEditor';

interface ViewerContainerProps {
  card: CardData;
  cards: any[];
  currentCardIndex: number;
  onCardChange?: (index: number) => void;
  isOpen: boolean;
  onClose?: () => void;
  onShare?: (card: CardData) => void;
  onDownload?: (card: CardData) => void;
  allowRotation: boolean;
  showStats: boolean;
  ambient: boolean;
}

export const ViewerContainer: React.FC<ViewerContainerProps> = ({
  card,
  cards = [],
  currentCardIndex = 0,
  onCardChange,
  isOpen = true,
  onClose,
  onShare,
  allowRotation = true,
  showStats = true
}) => {
  const containerState = useViewerContainerState({ card, onShare });

  if (!isOpen) return null;

  return (
    <ViewerEffectsManager
      card={card}
      mousePosition={containerState.mousePosition}
      showEffects={containerState.showEffects}
      overallBrightness={containerState.overallBrightness}
      interactiveLighting={containerState.interactiveLighting}
      selectedScene={containerState.selectedScene}
      selectedLighting={containerState.selectedLighting}
      materialSettings={containerState.materialSettings}
      zoom={containerState.zoom}
      rotation={containerState.rotation}
      isHovering={containerState.isHovering}
      onEffectValuesChange={containerState.handleEffectValuesChange}
      onPresetStateChange={containerState.handlePresetStateChange}
    >
      {(effectsManager) => (
        <ViewerLayout
          // Card and navigation props
          card={card}
          cards={cards}
          currentCardIndex={currentCardIndex}
          onCardChange={onCardChange}
          onClose={onClose}
          
          // All container state
          {...containerState}
          
          // Effects manager props
          effectValues={effectsManager.effectValues}
          frameStyles={effectsManager.frameStyles}
          enhancedEffectStyles={effectsManager.enhancedEffectStyles}
          SurfaceTexture={effectsManager.SurfaceTexture}
          handleEffectChange={effectsManager.handleEffectChange}
          handleComboApplication={effectsManager.handleComboApplication}
          isApplyingPreset={effectsManager.isApplyingPreset}
          
          // Configuration
          allowRotation={allowRotation}
          showStats={showStats}
        />
      )}
    </ViewerEffectsManager>
  );
};
