
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { ShowcaseCard } from './ShowcaseCard';
import { ShowcaseErrorBoundary } from './ShowcaseErrorBoundary';
import type { CardData } from '@/hooks/useCardEditor';
import type { SlabPresetConfig } from './SlabPresets';

interface ShowcaseCanvasProps {
  card: CardData;
  slabConfig: SlabPresetConfig;
  exploded: boolean;
  onExplodedChange: (exploded: boolean) => void;
}

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-white text-lg">Loading 3D showcase...</div>
  </div>
);

export const ShowcaseCanvas: React.FC<ShowcaseCanvasProps> = ({
  card,
  slabConfig,
  exploded,
  onExplodedChange
}) => {
  return (
    <div className="w-full h-full">
      <ShowcaseErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          onError={(error) => {
            console.error('Canvas error:', error);
          }}
        >
          <Environment preset="studio" />
          
          <Suspense fallback={null}>
            <ShowcaseCard
              card={card}
              slabConfig={slabConfig}
              exploded={exploded}
            />
          </Suspense>

          <OrbitControls
            enablePan={false}
            enableZoom={true}
            autoRotate={slabConfig.type === 'museum' && slabConfig.autoRotate}
            autoRotateSpeed={0.5}
            minDistance={5}
            maxDistance={15}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
          />
        </Canvas>
      </ShowcaseErrorBoundary>
    </div>
  );
};
