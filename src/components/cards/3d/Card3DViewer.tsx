
import React, { useState, useCallback } from 'react';
import { Card3DScene } from './Card3DScene';
import { useDeviceCapabilities } from './hooks/useDeviceCapabilities';
import { Button } from '@/components/ui/button';
import { RotateCcw, Settings, Maximize2, Minimize2 } from 'lucide-react';
import type { Card } from '@/types/card';

interface Card3DViewerProps {
  cards: Card[];
  selectedCard?: Card;
  onCardSelect?: (card: Card) => void;
  className?: string;
  showControls?: boolean;
}

export const Card3DViewer: React.FC<Card3DViewerProps> = ({
  cards,
  selectedCard,
  onCardSelect,
  className = '',
  showControls = true
}) => {
  const capabilities = useDeviceCapabilities();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const handleResetCamera = useCallback(() => {
    // This would reset camera position - implemented in OrbitControls
    window.dispatchEvent(new CustomEvent('resetCamera'));
  }, []);

  // Show 2D fallback for very old devices
  if (capabilities.tier === 'fallback') {
    return (
      <div className={`relative bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden ${className}`}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`
                aspect-[2.5/3.5] rounded-lg overflow-hidden cursor-pointer
                transform transition-transform duration-200 hover:scale-105
                ${selectedCard?.id === card.id ? 'ring-2 ring-blue-500' : ''}
              `}
              onClick={() => onCardSelect?.(card)}
            >
              <img
                src={card.thumbnail_url || card.image_url || ''}
                alt={card.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        
        <div className="absolute bottom-4 left-4 text-white text-sm">
          <p>Enhanced 2D Mode</p>
          <p className="text-xs text-gray-400">3D requires WebGL support</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : className}`}>
      {/* 3D Scene */}
      <div className="w-full h-full">
        <Card3DScene
          cards={cards}
          selectedCardId={selectedCard?.id}
          onCardSelect={onCardSelect}
          enableInteraction={true}
        />
      </div>

      {/* Controls Overlay */}
      {showControls && (
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleResetCamera}
            className="bg-black/50 hover:bg-black/70 text-white border-0"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowSettings(!showSettings)}
            className="bg-black/50 hover:bg-black/70 text-white border-0"
          >
            <Settings className="w-4 h-4" />
          </Button>
          
          <Button
            size="sm"
            variant="secondary"
            onClick={handleToggleFullscreen}
            className="bg-black/50 hover:bg-black/70 text-white border-0"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      )}

      {/* Device Tier Indicator (Development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-xs">
          3D Tier: {capabilities.tier} | WebGL: {capabilities.webglVersion} | GPU: {capabilities.gpuTier}
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-2 rounded text-xs max-w-xs">
        {capabilities.isMobile ? (
          <p>Pinch to zoom, drag to rotate, tap cards to select</p>
        ) : (
          <p>Mouse wheel to zoom, drag to rotate, click cards to select</p>
        )}
      </div>
    </div>
  );
};
