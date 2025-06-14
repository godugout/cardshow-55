
import React, { useState, useCallback } from 'react';
import { CSS360Background } from './CSS360Background';
import { CSS3DCard } from './CSS3DCard';
import { getDefaultPanoramic360Environment, getPanoramic360EnvironmentById } from './Panoramic360Library';
import type { CardData } from '@/hooks/useCardEditor';
import type { Panoramic360Environment } from './Panoramic360Library';

interface Simple360EnvironmentProps {
  card: CardData;
  environmentId?: string;
  mousePosition?: { x: number; y: number };
  isHovering?: boolean;
  autoRotate?: boolean;
  zoom?: number;
  onCardClick?: () => void;
}

export const Simple360Environment: React.FC<Simple360EnvironmentProps> = ({
  card,
  environmentId,
  mousePosition = { x: 0.5, y: 0.5 },
  isHovering = false,
  autoRotate = false,
  zoom = 1,
  onCardClick
}) => {
  const [environment, setEnvironment] = useState<Panoramic360Environment>(() => {
    if (environmentId) {
      return getPanoramic360EnvironmentById(environmentId) || getDefaultPanoramic360Environment();
    }
    return getDefaultPanoramic360Environment();
  });

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);

  console.log('🌍 Simple360Environment rendering:', {
    cardTitle: card.title,
    environmentName: environment.name,
    environmentId
  });

  const handleLoadComplete = useCallback(() => {
    console.log('✅ 360° environment loaded successfully:', environment.name);
    setIsLoading(false);
    setLoadError(null);
  }, [environment.name]);

  const handleLoadError = useCallback((error: Error) => {
    console.error('❌ 360° environment failed to load:', error);
    setLoadError(error);
    setIsLoading(false);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 360° Background */}
      <CSS360Background
        environment={environment}
        mousePosition={mousePosition}
        autoRotate={autoRotate}
        onLoadComplete={handleLoadComplete}
        onLoadError={handleLoadError}
      />

      {/* 3D Card */}
      <div className="relative z-10">
        <CSS3DCard
          card={card}
          environment={environment}
          mousePosition={mousePosition}
          isHovering={isHovering}
          autoRotate={autoRotate}
          zoom={zoom}
          onClick={onCardClick}
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <div className="text-white text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-2" />
            <p>Loading {environment.name}...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 z-20">
          <div className="text-white text-center bg-red-900/50 rounded-lg p-4">
            <p className="text-red-300">Failed to load environment</p>
            <p className="text-sm text-red-400 mt-1">{environment.name}</p>
          </div>
        </div>
      )}

      {/* Environment Info */}
      <div className="absolute bottom-4 left-4 text-white/70 text-sm z-10">
        <p>{environment.name}</p>
        <p className="text-xs opacity-70">{environment.description}</p>
      </div>
    </div>
  );
};
