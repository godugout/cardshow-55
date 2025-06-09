
import React from 'react';
import { Sparkles } from 'lucide-react';

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
  if (!showStats || isFlipped || shouldShowPanel) return null;

  return (
    <div 
      className="absolute bottom-4 left-4 right-4 max-w-2xl mx-auto z-10" 
      style={{ 
        marginRight: hasMultipleCards ? '180px' : '100px', 
        marginLeft: '280px' 
      }}
    >
      <div className="bg-black bg-opacity-80 backdrop-blur-lg rounded-lg p-4 border border-white/10">
        <div className="flex items-center justify-between text-white">
          <div className="flex space-x-4 text-sm">
            <span>Double-click card to flip</span>
            <span>•</span>
            <span>Drag to rotate manually</span>
            <span>•</span>
            <span>Scroll to zoom</span>
            <span>•</span>
            <span>Move mouse for effects</span>
            {hasMultipleCards && (
              <>
                <span>•</span>
                <span>Use ← → keys to navigate</span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">
              Studio | 3D Configuration Display
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
