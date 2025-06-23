
import React, { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Preload } from '@react-three/drei';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Card3D } from './Card3D';
import { useDeviceCapabilities } from './hooks/useDeviceCapabilities';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';
import type { Card } from '@/types/card';

interface Card3DSceneProps {
  cards: Card[];
  selectedCardId?: string;
  onCardSelect?: (card: Card) => void;
  className?: string;
  enableInteraction?: boolean;
}

const Card3DSceneFallback: React.FC<{ cards: Card[] }> = ({ cards }) => (
  <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center rounded-xl">
    <div className="text-center text-white p-8">
      <div className="grid grid-cols-2 gap-4 mb-6">
        {cards.slice(0, 4).map((card) => (
          <div key={card.id} className="w-32 h-44 bg-gray-800 rounded-lg overflow-hidden">
            <img 
              src={card.thumbnail_url || card.image_url || ''} 
              alt={card.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-400">3D visualization unavailable</p>
      <p className="text-xs text-gray-500">Showing 2D card preview</p>
    </div>
  </div>
);

// Create a proper fallback component for ErrorBoundary
const SceneFallbackComponent: React.FC<{ error?: Error; resetError?: () => void }> = ({ resetError }) => (
  <Card3DSceneFallback cards={[]} />
);

const Card3DSceneInner: React.FC<Card3DSceneProps> = ({
  cards,
  selectedCardId,
  onCardSelect,
  enableInteraction = true
}) => {
  const capabilities = useDeviceCapabilities();
  const { metrics, qualitySettings, updateMetrics } = usePerformanceMonitor(capabilities);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  
  // Performance monitoring
  const frameRef = useRef<number>(0);
  const lastTime = useRef<number>(performance.now());

  // Fallback for unsupported devices
  if (capabilities.tier === 'fallback' || capabilities.webglVersion === 0) {
    return <Card3DSceneFallback cards={cards} />;
  }

  const handleCardClick = (card: Card) => {
    if (enableInteraction) {
      onCardSelect?.(card);
    }
  };

  const handleCardHover = (card: Card, hovered: boolean) => {
    setHoveredCardId(hovered ? card.id : null);
  };

  // Arrange cards in a 3D grid
  const cardPositions = cards.map((_, index) => {
    const columns = Math.min(cards.length, capabilities.isMobile ? 2 : 4);
    const x = (index % columns - (columns - 1) / 2) * 3;
    const z = Math.floor(index / columns) * -4;
    return [x, 0, z] as [number, number, number];
  });

  return (
    <Canvas
      camera={{ 
        position: [0, 0, 8], 
        fov: capabilities.isMobile ? 60 : 45 
      }}
      shadows={qualitySettings.shadowQuality !== 'off'}
      dpr={qualitySettings.renderScale}
      gl={{ 
        antialias: qualitySettings.antialiasing,
        alpha: true,
        powerPreference: capabilities.isMobile ? 'low-power' : 'high-performance'
      }}
      onCreated={({ gl }) => {
        // Performance monitoring setup
        const animate = () => {
          const now = performance.now();
          const frameTime = now - lastTime.current;
          lastTime.current = now;
          
          frameRef.current++;
          if (frameRef.current % 60 === 0) { // Update metrics every 60 frames
            updateMetrics({
              frameTime,
              fps: 1000 / frameTime,
              memoryUsage: (performance as any).memory?.usedJSHeapSize || 0
            });
          }
        };
        
        gl.setAnimationLoop(animate);
      }}
    >
      {/* Lighting setup based on quality */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow={qualitySettings.shadowQuality !== 'off'}
        shadow-mapSize-width={qualitySettings.shadowQuality === 'high' ? 2048 : 1024}
        shadow-mapSize-height={qualitySettings.shadowQuality === 'high' ? 2048 : 1024}
      />
      
      {/* Environment */}
      {qualitySettings.enableEffects && (
        <Environment preset="studio" />
      )}
      
      {/* Cards */}
      <Suspense fallback={null}>
        {cards.map((card, index) => (
          <Card3D
            key={card.id}
            card={card}
            position={cardPositions[index]}
            isSelected={card.id === selectedCardId}
            isHovered={card.id === hoveredCardId}
            qualitySettings={qualitySettings}
            onClick={() => handleCardClick(card)}
            onHover={(hovered) => handleCardHover(card, hovered)}
          />
        ))}
      </Suspense>
      
      {/* Ground shadows */}
      {qualitySettings.shadowQuality !== 'off' && (
        <ContactShadows
          opacity={0.3}
          scale={10}
          blur={1}
          far={10}
          resolution={qualitySettings.shadowQuality === 'high' ? 256 : 128}
          color="#000000"
        />
      )}
      
      {/* Controls */}
      {enableInteraction && (
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={5}
          maxDistance={20}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
          autoRotate={false}
          enableDamping
          dampingFactor={0.1}
        />
      )}
      
      <Preload all />
    </Canvas>
  );
};

export const Card3DScene: React.FC<Card3DSceneProps> = (props) => {
  return (
    <ErrorBoundary fallback={SceneFallbackComponent}>
      <Card3DSceneInner {...props} />
    </ErrorBoundary>
  );
};
