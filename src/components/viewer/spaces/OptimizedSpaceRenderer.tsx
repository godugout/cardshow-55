
import React, { Suspense, useState, useEffect, useRef, useCallback } from 'react';
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
  const [performanceLevel, setPerformanceLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [hasError, setHasError] = useState(false);
  const performanceMonitor = useRef<PerformanceMonitor | null>(null);
  const resourceManager = useRef<ResourceManager | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize managers safely
  useEffect(() => {
    try {
      performanceMonitor.current = new PerformanceMonitor();
      resourceManager.current = ResourceManager.getInstance();
      performanceMonitor.current.start();
    } catch (error) {
      console.error('Error initializing managers:', error);
      setHasError(true);
    }
  }, []);

  // Performance monitoring with safety checks
  useEffect(() => {
    const monitor = performanceMonitor.current;
    if (!monitor) return;

    intervalRef.current = setInterval(() => {
      try {
        monitor.update();
        const newLevel = monitor.getPerformanceLevel();
        
        if (newLevel && newLevel !== performanceLevel) {
          setPerformanceLevel(newLevel);
          console.log(`Performance level changed to: ${newLevel}`);
        }
      } catch (error) {
        console.warn('Performance monitoring error:', error);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      try {
        monitor?.stop();
        resourceManager.current?.dispose();
      } catch (error) {
        console.warn('Cleanup error:', error);
      }
    };
  }, [performanceLevel]);

  const renderEnvironment = useCallback(() => {
    if (hasError || !environment?.type || !environment?.config) {
      return <FallbackEnvironment />;
    }

    const safeConfig = {
      backgroundColor: environment.config.backgroundColor || '#000000',
      ambientColor: environment.config.ambientColor || '#ffffff',
      lightIntensity: (environment.config.lightIntensity || 1.0) * environmentIntensity,
      ...environment.config
    };

    try {
      switch (environment.type) {
        case 'void':
        case 'cosmic':
          return <OptimizedVoidSpace config={safeConfig} performanceLevel={performanceLevel} />;
        
        case 'matrix':
          return <OptimizedMatrixSpace config={safeConfig} performanceLevel={performanceLevel} />;
        
        case 'forest':
          return <ForestGladeSpace config={safeConfig} />;
        
        case 'neon':
          return <NeonCitySpace config={safeConfig} />;
        
        case 'ocean':
          return <OceanDepthsSpace config={safeConfig} />;
        
        case 'sketch':
          return <SketchArtSpace config={safeConfig} />;
        
        default:
          console.warn(`Unknown environment type: ${environment.type}`);
          return <FallbackEnvironment />;
      }
    } catch (error) {
      console.error('Error rendering environment:', error);
      setHasError(true);
      return <FallbackEnvironment />;
    }
  }, [environment, environmentIntensity, performanceLevel, hasError]);

  // Safe card validation
  const safeCard = React.useMemo(() => {
    if (!card) {
      return {
        id: 'fallback',
        title: 'Loading Card',
        image_url: '/placeholder-card.jpg',
        rarity: 'common' as const,
        tags: [],
        design_metadata: {},
        visibility: 'private' as const,
        category: 'default',
        effects: {
          holographic: false,
          foil: false,
          chrome: false
        },
        creator_attribution: {},
        publishing_options: {
          marketplace_listing: false,
          crd_catalog_inclusion: false,
          print_available: false,
          pricing: { currency: 'USD' },
          distribution: { limited_edition: false }
        }
      };
    }
    return card;
  }, [card]);

  // Safe controls validation
  const safeControls = React.useMemo(() => {
    if (!controls) {
      return {
        autoRotate: false,
        orbitSpeed: 1,
        cameraDistance: 8,
        floatIntensity: 0,
        gravityEffect: 0
      };
    }
    return controls;
  }, [controls]);

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-full bg-black text-white">
        <div className="text-center">
          <p>Unable to load 3D environment</p>
          <p className="text-sm text-gray-400">Using fallback view</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="flex items-center justify-center h-full bg-black text-white">
          <div className="text-center">
            <p>3D Environment Error</p>
            <p className="text-sm text-gray-400">Fallback mode active</p>
          </div>
        </div>
      }
      onError={(error) => {
        console.error('3D Environment Error:', error);
        setHasError(true);
      }}
    >
      <div className="w-full h-full relative">
        <Canvas
          camera={{ 
            position: [0, 0, safeControls.cameraDistance || 8], 
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
          onError={(error) => {
            console.error('Canvas error:', error);
            setHasError(true);
          }}
        >
          <Suspense fallback={null}>
            {renderEnvironment()}
            
            <ErrorBoundary fallback={null}>
              <Card3D card={safeCard} controls={safeControls} />
            </ErrorBoundary>
            
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
              autoRotate={safeControls.autoRotate || false}
              autoRotateSpeed={safeControls.orbitSpeed || 1}
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
