
import React, { Suspense, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Card3D } from './Card3D';
import { SpaceErrorBoundary } from './components/SpaceErrorBoundary';
import { ReliableSpaceEnvironment } from './environments/ReliableSpaceEnvironment';
import type { SpaceEnvironment, SpaceControls } from './types';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';

interface Simple3DCard {
  id: string;
  title: string;
  image_url?: string;
}

interface SpaceRenderer3DProps {
  card: Simple3DCard;
  environment: SpaceEnvironment;
  controls: SpaceControls;
  effectValues?: EffectValues;
  selectedScene?: EnvironmentScene;
  selectedLighting?: LightingPreset;
  materialSettings?: MaterialSettings;
  overallBrightness?: number[];
  interactiveLighting?: boolean;
  onCardClick?: () => void;
  onCameraReset?: () => void;
}

const LoadingFallback: React.FC = React.memo(() => (
  <>
    <ambientLight intensity={0.6} />
    <directionalLight position={[5, 10, 5]} intensity={0.8} />
  </>
));
LoadingFallback.displayName = 'LoadingFallback';

// Map environment types to reliable image IDs
const getEnvironmentImageId = (environment: SpaceEnvironment): string => {
  if (environment?.config?.panoramicPhotoId) {
    return environment.config.panoramicPhotoId;
  }
  
  switch (environment?.type) {
    case 'forest':
      return 'forest-clearing';
    case 'ocean':
      return 'ocean-sunset';
    case 'neon':
      return 'neon-city';
    case 'cosmic':
      return 'cosmic-void';
    case 'sports':
      return 'sports-arena';
    case 'cultural':
      return 'concert-hall';
    case 'studio':
    case 'void':
      return 'modern-studio';
    case 'panoramic':
      return environment?.config?.panoramicPhotoId || 'modern-studio';
    default:
      return 'modern-studio';
  }
};

export const SpaceRenderer3D: React.FC<SpaceRenderer3DProps> = React.memo(({
  card,
  environment,
  controls,
  effectValues = {},
  selectedScene,
  selectedLighting,
  materialSettings,
  overallBrightness = [100],
  interactiveLighting = false,
  onCardClick,
  onCameraReset,
}) => {
  // Memoize environment configuration to prevent unnecessary re-renders
  const environmentConfig = useMemo(() => {
    if (!environment) {
      return {
        imageId: 'modern-studio',
        exposure: 1.0,
        brightness: 1.0
      };
    }

    return {
      imageId: getEnvironmentImageId(environment),
      exposure: environment.config?.exposure || 1.0,
      brightness: environment.config?.lightIntensity || 1.0
    };
  }, [environment]);

  // Memoize camera settings
  const cameraConfig = useMemo(() => ({
    position: [2, 1, 6] as [number, number, number],
    fov: controls?.fieldOfView || 45
  }), [controls?.fieldOfView]);

  // Memoize OrbitControls settings
  const controlsConfig = useMemo(() => ({
    enablePan: false,
    enableZoom: true,
    autoRotate: controls?.autoRotate || false,
    autoRotateSpeed: controls?.orbitSpeed || 0.5,
    minDistance: 4,
    maxDistance: 12,
    minPolarAngle: Math.PI / 8,
    maxPolarAngle: Math.PI - Math.PI / 8,
    enableDamping: true,
    dampingFactor: 0.05,
    target: [0, 0, 0] as [number, number, number]
  }), [controls?.autoRotate, controls?.orbitSpeed]);

  // Stable callbacks
  const handleLoadComplete = useCallback(() => {
    console.log('✅ 3D Environment loaded:', environmentConfig.imageId);
  }, [environmentConfig.imageId]);

  const handleLoadError = useCallback((error: Error) => {
    console.error('❌ 3D Environment error:', error);
  }, []);

  // Early return if no card
  if (!card) {
    return null;
  }

  return (
    <div className="w-full h-full">
      <Canvas
        camera={cameraConfig}
        shadows
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: false,
          premultipliedAlpha: false,
          powerPreference: 'high-performance'
        }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.domElement.style.background = 'transparent';
          // Optimize WebGL settings
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
        onError={(error) => console.error('SpaceRenderer3D Canvas error:', error)}
      >
        <Suspense fallback={<LoadingFallback />}>
          <SpaceErrorBoundary spaceName={environment?.name || 'Unknown'} fallback={<LoadingFallback />}>
            <ReliableSpaceEnvironment
              imageId={environmentConfig.imageId}
              rotation={environment?.config?.autoRotation || 0}
              exposure={environmentConfig.exposure}
              brightness={environmentConfig.brightness}
              onLoadComplete={handleLoadComplete}
              onLoadError={handleLoadError}
            />
          </SpaceErrorBoundary>
          
          <Card3D
            card={card}
            controls={controls}
            effectValues={effectValues}
            selectedScene={selectedScene}
            selectedLighting={selectedLighting}
            materialSettings={materialSettings}
            overallBrightness={overallBrightness}
            interactiveLighting={interactiveLighting}
            onClick={onCardClick}
          />
        </Suspense>

        <OrbitControls {...controlsConfig} />
      </Canvas>
    </div>
  );
});

SpaceRenderer3D.displayName = 'SpaceRenderer3D';
