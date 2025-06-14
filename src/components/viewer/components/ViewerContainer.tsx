
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
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

  // Prevent background scrolling when viewer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Render the viewer using a portal to break free from parent constraints
  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0">
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
      </div>
    </div>,
    document.body
  );
};
