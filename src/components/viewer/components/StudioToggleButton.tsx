
import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StudioToggleButtonProps {
  isVisible: boolean;
  onToggle: () => void;
}

export const StudioToggleButton: React.FC<StudioToggleButtonProps> = ({
  isVisible,
  onToggle
}) => {
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Check if this is the user's first visit to the studio
    const hasVisitedStudio = localStorage.getItem('crd-studio-visited');
    if (!hasVisitedStudio) {
      setIsFirstVisit(true);
      setShowTooltip(true);
      
      // Auto-hide tooltip after 5 seconds
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleToggle = () => {
    if (isFirstVisit) {
      localStorage.setItem('crd-studio-visited', 'true');
      setIsFirstVisit(false);
      setShowTooltip(false);
    }
    onToggle();
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 's' || e.key === 'S') {
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          // Only trigger if no modifier keys are pressed and focus is not on an input
          const activeElement = document.activeElement;
          if (activeElement && 
              !['INPUT', 'TEXTAREA', 'SELECT'].includes(activeElement.tagName)) {
            e.preventDefault();
            handleToggle();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  return (
    <div className="relative">
      <Button
        onClick={handleToggle}
        className={`
          ${isVisible 
            ? 'bg-crd-green text-black hover:bg-crd-green/90' 
            : 'bg-black/60 text-white hover:bg-black/80'
          } 
          backdrop-blur-md border border-white/20 px-4 py-2 rounded-lg 
          transition-all duration-200 hover:scale-105 
          ${isFirstVisit ? 'animate-pulse' : ''}
        `}
        title={`${isVisible ? 'Close' : 'Open'} Studio Panel (Press 'S')`}
      >
        <Sparkles className="w-5 h-5 mr-2" />
        <span className="font-semibold">Studio</span>
        {isFirstVisit && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-crd-green rounded-full animate-ping" />
        )}
      </Button>

      {/* First-time user tooltip */}
      {showTooltip && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50">
          <div className="bg-black/90 text-white text-sm px-3 py-2 rounded-lg border border-white/20 backdrop-blur-md whitespace-nowrap">
            <div className="text-center">
              <div className="font-semibold mb-1">🎨 Welcome to Studio!</div>
              <div>Click here to access all effects & settings</div>
              <div className="text-xs text-gray-300 mt-1">Tip: Press 'S' to toggle</div>
            </div>
            {/* Arrow pointing up */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-black/90" />
          </div>
        </div>
      )}
    </div>
  );
};
