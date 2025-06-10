
import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Card3D } from './Card3D';
import { OptimizedVoidSpace } from './environments/OptimizedVoidSpace';
import { OptimizedMatrixSpace } from './environments/OptimizedMatrixSpace';
import { ForestGladeSpace } from './environments/ForestGladeSpace';
import { NeonCitySpace } from './environments/NeonCitySpace';
import { OceanDepthsSpace } from './environments/OceanDepthsSpace';
import { SketchArtSpace } from './environments/SketchArtSpace';
import { ResourceManager } from '../utils/ResourceManager';
import { PerformanceMonitor } from '../utils/PerformanceMonitor';
import type { SpaceEnvironment, SpaceControls } from './types';
import type { CardData } from '@/types/card';

interface OptimizedSpaceRendererProps {
  environment: SpaceEnvironment;
  controls: SpaceControls;
  card: CardData;
  onCameraReset?: () => void;
  environmentIntensity?: number;
}

const FallbackEnvironment = () => (
  <>
    <color attach="background" args={['#000000']} />
    <ambientLight intensity={0.5} />
    <directionalLight position={[10, 10, 5]} intensity={0.5} />
  </>
);

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-white">Loading 3D environment...</div>
  </div>
);

export const OptimizedSpaceRenderer: React.FC<OptimizedSpaceRendererProps> = ({
  environment,
  controls,
  card,
  onCameraReset,
  environmentIntensity = 1.0
}) => {
  const [performanceLevel, setPerformanceLevel] = useState<'low' | 'medium' | 'high'>('high');
  const [hasError, setHasError] = useState(false);
  const performanceMonitor = useRef(new PerformanceMonitor());
  const resourceManager = useRef(ResourceManager.getInstance());

  useEffect(() => {
    const monitor = performanceMonitor.current;
    const interval = setInterval(() => {
      monitor.update();
      const newLevel = monitor.getPerformanceLevel();
      if (newLevel !== performanceLevel) {
        setPerformanceLevel(newLevel);
        console.log(`Performance level changed to: ${newLevel}`);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      resourceManager.current.dispose();
    };
  }, [performanceLevel]);

  const renderEnvironment = () => {
    if (hasError) {
      return <FallbackEnvironment />;
    }

    const config = {
      ...environment.config,
      lightIntensity: environment.config.lightIntensity * environmentIntensity
    };

    try {
      switch (environment.type) {
        case 'void':
        case 'cosmic':
          return <OptimizedVoidSpace config={config} performanceLevel={performanceLevel} />;
        
        case 'matrix':
          return <OptimizedMatrixSpace config={config} performanceLevel={performanceLevel} />;
        
        case 'forest':
          return <ForestGladeSpace config={config} />;
        
        case 'neon':
          return <NeonCitySpace config={config} />;
        
        case 'ocean':
          return <OceanDepthsSpace config={config} />;
        
        case 'sketch':
          return <SketchArtSpace config={config} />;
        
        default:
          return <FallbackEnvironment />;
      }
    } catch (error) {
      console.error('Error rendering environment:', error);
      setHasError(true);
      return <FallbackEnvironment />;
    }
  };

  return (
    <ErrorBoundary
      fallback={
        <div className="flex items-center justify-center h-full bg-black text-white">
          <div className="text-center">
            <p>Unable to load 3D environment</p>
            <p className="text-sm text-gray-400">Using fallback view</p>
          </div>
        </div>
      }
      onError={() => setHasError(true)}
    >
      <div className="w-full h-full relative">
        <Canvas
          camera={{ 
            position: [0, 0, controls.cameraDistance], 
            fov: 75 
          }}
          shadows={performanceLevel === 'high'}
          dpr={performanceLevel === 'low' ? [0.5, 1] : [1, 2]}
          gl={{ 
            antialias: performanceLevel !== 'low',
            alpha: true,
            powerPreference: 'high-performance'
          }}
          onCreated={() => {
            console.log('Canvas created successfully');
          }}
        >
          <Suspense fallback={null}>
            {renderEnvironment()}
            <Card3D card={card} controls={controls} />
            
            {performanceLevel === 'high' && (
              <ContactShadows
                opacity={0.2}
                scale={10}
                blur={1}
                far={10}
                resolution={256}
                color="#000000"
              />
            )}
            
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              autoRotate={controls.autoRotate}
              autoRotateSpeed={controls.orbitSpeed}
              minDistance={3}
              maxDistance={20}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI - Math.PI / 6}
            />
          </Suspense>
        </Canvas>

        {/* Performance indicator */}
        {performanceLevel !== 'high' && (
          <div className="absolute top-2 right-2 text-xs text-yellow-400 bg-black/50 px-2 py-1 rounded">
            Performance: {performanceLevel}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};
