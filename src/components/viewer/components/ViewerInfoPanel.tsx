
import React from 'react';

interface ViewerInfoPanelProps {
  showStats: boolean;
  isFlipped: boolean;
  shouldShowPanel: boolean;
  hasMultipleCards: boolean;
}

export const ViewerInfoPanel: React.FC<ViewerInfoPanelProps> = ({
  showStats,
  isFlipped,
  shouldShowPanel,
  hasMultipleCards
}) => {
  if (!showStats) return null;

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 select-none" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
      <div className="bg-black bg-opacity-70 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm">
        <div className="flex items-center space-x-4">
          <span>
            {isFlipped ? 'Back' : 'Front'} side
          </span>
          <span className="text-gray-400">•</span>
          <span>
            Click to flip
          </span>
          {hasMultipleCards && (
            <>
              <span className="text-gray-400">•</span>
              <span>
                Use ← → to navigate
              </span>
            </>
          )}
          {shouldShowPanel && (
            <>
              <span className="text-gray-400">•</span>
              <span>
                Studio panel open
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
