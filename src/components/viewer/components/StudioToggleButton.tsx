
import React, { useState, useEffect, useCallback } from 'react';
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
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize state only once to prevent flickering
  useEffect(() => {
    const initializeState = () => {
      const hasVisitedStudio = localStorage.getItem('crd-studio-visited');
      const firstVisit = !hasVisitedStudio;
      
      setIsFirstVisit(firstVisit);
      setShowTooltip(firstVisit);
      setIsInitialized(true);
      
      // Auto-hide tooltip after 5 seconds for first-time users
      if (firstVisit) {
        const timer = setTimeout(() => {
          setShowTooltip(false);
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    };

    // Use requestAnimationFrame to prevent initial render conflicts
    const timeoutId = setTimeout(initializeState, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleToggle = useCallback(() => {
    if (isFirstVisit) {
      localStorage.setItem('crd-studio-visited', 'true');
      setIsFirstVisit(false);
      setShowTooltip(false);
    }
    onToggle();
  }, [isFirstVisit, onToggle]);

  // Keyboard shortcut listener with debouncing
  useEffect(() => {
    let debounceTimer: NodeJS.Timeout;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 's' || e.key === 'S') {
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          const activeElement = document.activeElement;
          if (activeElement && 
              !['INPUT', 'TEXTAREA', 'SELECT'].includes(activeElement.tagName)) {
            e.preventDefault();
            
            // Debounce the key press to prevent rapid firing
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(handleToggle, 100);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      clearTimeout(debounceTimer);
    };
  }, [handleToggle]);

  // Don't render until initialized to prevent flickering
  if (!isInitialized) {
    return (
      <div className="w-20 h-10 bg-transparent rounded-lg animate-pulse" />
    );
  }

  return (
    <div className="relative">
      <Button
        onClick={handleToggle}
        className={`
          transition-all duration-300 ease-in-out
          ${isVisible 
            ? 'bg-green-500 text-black hover:bg-green-400 shadow-green-500/25' 
            : 'bg-black/60 text-white hover:bg-black/80 shadow-black/25'
          } 
          backdrop-blur-md border border-white/20 px-4 py-2 rounded-lg 
          hover:scale-105 hover:shadow-lg
          ${isFirstVisit ? 'animate-pulse' : ''}
        `}
        title={`${isVisible ? 'Close' : 'Open'} Studio Panel (Press 'S')`}
      >
        <Sparkles className={`w-5 h-5 mr-2 transition-transform duration-200 ${isVisible ? 'rotate-12' : ''}`} />
        <span className="font-semibold">Studio</span>
        {isFirstVisit && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping" />
        )}
      </Button>

      {/* First-time user tooltip with improved animations */}
      {showTooltip && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50 animate-fade-in">
          <div className="bg-black/90 text-white text-sm px-3 py-2 rounded-lg border border-white/20 backdrop-blur-md whitespace-nowrap shadow-xl">
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
