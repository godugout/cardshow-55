
import React, { useState, useEffect } from 'react';
import { Card3DViewer } from './Card3DViewer';
import { Card3DToggle } from './Card3DToggle';
import { CardViewer3DContainer } from './CardViewer3DContainer';
import type { CardData } from '@/hooks/useCardEditor';

interface EnhancedCardDisplayProps {
  card: CardData;
  className?: string;
  defaultTo3D?: boolean;
  showToggle?: boolean;
}

// WebGL feature detection
const detectWebGLSupport = () => {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!context;
  } catch (e) {
    return false;
  }
};

export const EnhancedCardDisplay: React.FC<EnhancedCardDisplayProps> = ({
  card,
  className = '',
  defaultTo3D = true,
  showToggle = true
}) => {
  const [is3D, setIs3D] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Check WebGL support on mount
  useEffect(() => {
    const supported = detectWebGLSupport();
    setWebGLSupported(supported);
    
    if (supported && defaultTo3D) {
      setIs3D(true);
    }
  }, [defaultTo3D]);

  // Smooth transition between 2D and 3D modes
  const handleToggle = (new3D: boolean) => {
    if (!webGLSupported && new3D) {
      console.warn('WebGL not supported, staying in 2D mode');
      return;
    }

    setIsTransitioning(true);
    
    // Brief delay to show transition effect
    setTimeout(() => {
      setIs3D(new3D);
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Toggle control */}
      {showToggle && (
        <div className="absolute top-4 right-4 z-10">
          <Card3DToggle
            is3D={is3D}
            onToggle={handleToggle}
            disabled={!webGLSupported || isTransitioning}
          />
        </div>
      )}

      {/* WebGL not supported notification */}
      {!webGLSupported && (
        <div className="absolute top-4 left-4 bg-yellow-500/20 text-yellow-200 px-3 py-1 rounded text-sm z-10">
          3D view unavailable
        </div>
      )}

      {/* Card display with transition */}
      <div 
        className={`w-full h-full transition-all duration-300 ${
          isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {is3D && webGLSupported ? (
          <Card3DViewer
            card={card}
            className="w-full h-full"
            interactive={true}
            autoRotate={false}
            showStats={process.env.NODE_ENV === 'development'}
          />
        ) : (
          <CardViewer3DContainer
            card={card}
            className="w-full h-full"
            environment="studio"
            interactive={true}
            autoRotate={false}
          />
        )}
      </div>

      {/* Performance metrics overlay (development only) */}
      {process.env.NODE_ENV === 'development' && is3D && (
        <div className="absolute bottom-4 left-4 bg-black/80 text-white px-2 py-1 rounded text-xs">
          Mode: {is3D ? '3D (Three.js)' : '2D (Fallback)'}
          <br />
          WebGL: {webGLSupported ? 'Supported' : 'Not supported'}
        </div>
      )}
    </div>
  );
};
