
import React, { Suspense, useState } from 'react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { CardViewer3D } from './CardViewer3D';
import { Card3DViewer } from './Card3DViewer';
import { Card3DToggle } from './Card3DToggle';
import type { CardData } from '@/hooks/useCardEditor';

interface CardViewer3DContainerProps {
  card: CardData;
  environment?: 'studio' | 'city' | 'sunset' | 'dawn';
  interactive?: boolean;
  autoRotate?: boolean;
  className?: string;
  enableAdvanced3D?: boolean;
  showToggle?: boolean;
}

const CardViewer3DFallback: React.FC<{ card: CardData }> = ({ card }) => (
  <div className="w-full h-full bg-surface-medium flex items-center justify-center rounded-xl">
    <div className="text-center text-white p-8">
      <div className="w-32 h-44 bg-surface-dark rounded-lg mx-auto mb-4 flex items-center justify-center">
        {card.image_url ? (
          <img 
            src={card.image_url} 
            alt={card.title}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <span className="text-text-muted">Card</span>
        )}
      </div>
      <p className="text-sm text-text-secondary">3D viewer unavailable</p>
    </div>
  </div>
);

const ErrorFallback: React.FC<{ error?: Error; resetError?: () => void; card: CardData }> = ({ card }) => (
  <CardViewer3DFallback card={card} />
);

export const CardViewer3DContainer: React.FC<CardViewer3DContainerProps> = ({
  card,
  environment = 'studio',
  interactive = true,
  autoRotate = false,
  className = '',
  enableAdvanced3D = true,
  showToggle = true
}) => {
  const [useAdvanced3D, setUseAdvanced3D] = useState(enableAdvanced3D);

  // Check if we should use the advanced 3D system
  const shouldUseAdvanced3D = enableAdvanced3D && useAdvanced3D;

  return (
    <div className={`w-full h-full relative ${className}`}>
      {/* 3D Mode Toggle */}
      {showToggle && enableAdvanced3D && (
        <div className="absolute top-4 right-4 z-10">
          <Card3DToggle
            is3D={useAdvanced3D}
            onToggle={setUseAdvanced3D}
          />
        </div>
      )}

      <ErrorBoundary fallback={(props) => <ErrorFallback {...props} card={card} />}>
        <Suspense fallback={<CardViewer3DFallback card={card} />}>
          {shouldUseAdvanced3D ? (
            <Card3DViewer
              card={card}
              className="w-full h-full"
              interactive={interactive}
              autoRotate={autoRotate}
              showStats={process.env.NODE_ENV === 'development'}
            />
          ) : (
            <CardViewer3D
              card={card}
              environment={environment}
              interactive={interactive}
              autoRotate={autoRotate}
            />
          )}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
