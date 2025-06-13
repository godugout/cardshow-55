
import React from 'react';
import { StudioSidebar } from './StudioSidebar';
import { StudioContent } from './StudioContent';
import type { CardData } from '@/hooks/useCardEditor';

interface StudioLayoutProps {
  selectedCard: CardData | null;
  onCardSelect: (card: CardData) => void;
  renderViewer?: () => React.ReactNode;
}

export const StudioLayout: React.FC<StudioLayoutProps> = ({
  selectedCard,
  onCardSelect,
  renderViewer
}) => {
  return (
    <div className="flex h-screen bg-crd-dark">
      {/* Left Sidebar */}
      <StudioSidebar
        selectedCard={selectedCard}
        onCardSelect={onCardSelect}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Studio Controls */}
        <div className="w-80 bg-crd-mediumGray border-r border-crd-lightGray">
          <StudioContent
            selectedCard={selectedCard}
          />
        </div>

        {/* Viewer Area */}
        <div className="flex-1 bg-crd-dark relative overflow-hidden">
          {renderViewer ? renderViewer() : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-crd-lightGray">
                <p className="text-xl mb-2">No card selected</p>
                <p className="text-sm">Select a card from the sidebar to view in 3D</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
