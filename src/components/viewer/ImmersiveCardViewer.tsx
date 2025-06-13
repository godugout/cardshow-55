
import React, { useState, useCallback } from 'react';
import { ViewerStateManager } from './components/ViewerStateManager';
import { CardInteractionHandlers } from './components/CardInteractionHandlers';
import { ViewerLayout } from './components/ViewerLayout';

interface ImmersiveCardViewerProps {
  card: any;
  cards?: any[];
  currentCardIndex?: number;
  onCardChange?: (card: any, index: number) => void;
  isOpen: boolean;
  onClose: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  allowRotation?: boolean;
  showStats?: boolean;
  ambient?: boolean;
}

export const ImmersiveCardViewer: React.FC<ImmersiveCardViewerProps> = ({
  card,
  cards = [],
  currentCardIndex = 0,
  onCardChange,
  isOpen,
  onClose,
  onShare,
  onDownload,
  allowRotation = true,
  showStats = false,
  ambient = false
}) => {
  const [isStudioVisible, setIsStudioVisible] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>(undefined);
  const [showBackgroundInfo, setShowBackgroundInfo] = useState(true);

  const handleCloseStudio = useCallback(() => {
    setIsStudioVisible(false);
  }, []);

  const handleOpenStudio = useCallback(() => {
    setIsStudioVisible(true);
  }, []);

  return (
    <ViewerStateManager>
      {(viewerState) => (
        <CardInteractionHandlers card={card}>
          {(interactionHandlers) => (
            <ViewerLayout
              card={card}
              isStudioVisible={isStudioVisible}
              onClose={onClose}
              onOpenStudio={handleOpenStudio}
              onCloseStudio={handleCloseStudio}
              selectedPresetId={selectedPresetId}
              setSelectedPresetId={setSelectedPresetId}
              showBackgroundInfo={showBackgroundInfo}
              {...viewerState}
              {...interactionHandlers}
            />
          )}
        </CardInteractionHandlers>
      )}
    </ViewerStateManager>
  );
};
