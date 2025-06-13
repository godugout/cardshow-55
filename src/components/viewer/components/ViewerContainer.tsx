
import React from 'react';
import { useViewerContainerState } from '../hooks/useViewerContainerState';
import { ViewerEffectsManager } from './ViewerEffectsManager';
import { ViewerLayout } from './ViewerLayout';
import { RenderModeManager } from './RenderModeManager';
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
  onDownload,
  allowRotation = true,
  showStats = false,
  ambient = true
}) => {
  // Call the hook at component level
  const stateProps = useViewerContainerState({ card, onShare });

  if (!isOpen) return null;

  return (
    <RenderModeManager card={card} effectValues={{}}>
      {({ enableTrue3D, onToggle3D }) => (
        <ViewerEffectsManager
          card={card}
          mousePosition={stateProps.mousePosition}
          showEffects={stateProps.showEffects}
          overallBrightness={stateProps.overallBrightness}
          interactiveLighting={stateProps.interactiveLighting}
          selectedScene={stateProps.selectedScene}
          selectedLighting={stateProps.selectedLighting}
          materialSettings={stateProps.materialSettings}
          zoom={stateProps.zoom}
          rotation={stateProps.rotation}
          isHovering={stateProps.isHovering}
          onEffectValuesChange={stateProps.handleEffectValuesChange}
          onPresetStateChange={stateProps.handlePresetStateChange}
        >
          {(effectsManager) => (
            <ViewerLayout
              {...stateProps}
              card={card}
              cards={cards}
              currentCardIndex={currentCardIndex}
              onCardChange={onCardChange}
              onClose={onClose}
              allowRotation={allowRotation}
              showStats={showStats}
              {...effectsManager}
              enableTrue3D={enableTrue3D}
              onToggle3D={onToggle3D}
            />
          )}
        </ViewerEffectsManager>
      )}
    </RenderModeManager>
  );
};
