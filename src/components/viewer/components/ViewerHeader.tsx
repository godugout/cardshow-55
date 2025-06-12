
import React from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewerHeaderProps {
  onClose?: () => void;
  showStudioButton: boolean;
  onOpenStudio: () => void;
  hasMultipleCards?: boolean;
  currentCardIndex?: number;
  totalCards?: number;
  onCardChange?: (index: number) => void;
  setIsFlipped?: (flipped: boolean) => void;
}

export const ViewerHeader: React.FC<ViewerHeaderProps> = ({
  onClose,
  showStudioButton,
  onOpenStudio,
  hasMultipleCards = false,
  currentCardIndex = 0,
  totalCards = 0,
  onCardChange,
  setIsFlipped
}) => {
  const canGoPrev = hasMultipleCards && currentCardIndex > 0;
  const canGoNext = hasMultipleCards && currentCardIndex < totalCards - 1;

  const handlePreviousCard = () => {
    if (canGoPrev && onCardChange) {
      onCardChange(currentCardIndex - 1);
      setIsFlipped?.(false);
    }
  };

  const handleNextCard = () => {
    if (canGoNext && onCardChange) {
      onCardChange(currentCardIndex + 1);
      setIsFlipped?.(false);
    }
  };

  return (
    <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-none">
      {/* Left: Back to CRD Button and Navigation */}
      <div className="flex items-center space-x-3 pointer-events-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="bg-black bg-opacity-50 hover:bg-opacity-70 backdrop-blur border border-white/20 text-white flex items-center space-x-2 px-3 py-2"
        >
          <img 
            src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
            alt="CRD Logo" 
            className="w-5 h-5"
            onError={(e) => {
              console.warn('CRD logo failed to load');
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="text-sm font-medium">Back to CRD</span>
        </Button>

        {/* Navigation Controls */}
        {hasMultipleCards && (
          <div className="flex items-center space-x-2 bg-black bg-opacity-50 backdrop-blur-lg rounded-lg p-2 border border-white/20">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreviousCard}
              disabled={!canGoPrev}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed p-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="text-white text-sm px-2">
              {currentCardIndex + 1} / {totalCards}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextCard}
              disabled={!canGoNext}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed p-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Right: Studio Button (when panel is closed) */}
      {showStudioButton && (
        <div className="pointer-events-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenStudio}
            className="bg-black bg-opacity-50 hover:bg-opacity-70 backdrop-blur border border-white/20 text-white flex items-center space-x-2 px-3 py-2"
          >
            <Sparkles className="w-4 h-4 text-crd-green" />
            <span className="text-sm font-medium">Studio</span>
          </Button>
        </div>
      )}
    </div>
  );
};
