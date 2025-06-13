
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
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
  description?: string;
  rarity?: string;
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
  renderCard?: boolean;
}

const LoadingFallback: React.FC = () => (
  <>
    <ambientLight intensity={0.4} />
    <directionalLight position={[5, 10, 5]} intensity={0.6} />
  </>
);

// Optimized image URLs with proper sizing
const getOptimizedEnvironmentImageId = (environment: SpaceEnvironment): string => {
  if (environment.config.panoramicPhotoId) {
    return environment.config.panoramicPhotoId;
  }
  
  const baseUrl = 'https://images.unsplash.com/';
  const params = '?w=1024&h=512&fit=crop&crop=center&auto=format&q=85';
  
  switch (environment.type) {
    case 'forest':
      return `${baseUrl}photo-1441974231531-c6227db76b6e${params}`;
    case 'ocean':
      return `${baseUrl}photo-1505142468610-359e7d316be0${params}`;
    case 'neon':
      return `${baseUrl}photo-1518709268805-4e9042af2176${params}`;
    case 'cosmic':
      return `${baseUrl}photo-1446776877081-d282a0f896e2${params}`;
    case 'sports':
      return `${baseUrl}photo-1461896836934-ffe607ba8211${params}`;
    case 'cultural':
      return `${baseUrl}photo-1493225457124-a3eb161ffa5f${params}`;
    case 'studio':
    case 'void':
      return `${baseUrl}photo-1586953208448-b95a79798f07${params}`;
    case 'panoramic':
      return environment.config.panoramicPhotoId ? 
        `${baseUrl}${environment.config.panoramicPhotoId}${params}` :
        `${baseUrl}photo-1586953208448-b95a79798f07${params}`;
    default:
      return `${baseUrl}photo-1586953208448-b95a79798f07${params}`;
  }
};

export const SpaceRenderer3D: React.FC<SpaceRenderer3DProps> = ({
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
  renderCard = true
}) => {
  console.log('🎬 SpaceRenderer3D: Rendering TRUE 3D environment:', environment.type, environment.name, 'renderCard:', renderCard);

  const imageUrl = getOptimizedEnvironmentImageId(environment);
  const exposure = environment.config.exposure || 1.0;
  const brightness = environment.config.lightIntensity || 1.0;

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: controls.fieldOfView || 45 }}
        shadows
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: false,
          premultipliedAlpha: false,
          powerPreference: 'high-performance'
        }}
        style={{ background: 'transparent' }}
        onCreated={({ gl, scene }) => {
          gl.domElement.style.background = 'transparent';
          // Enable shadows with proper Three.js API
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          // Better texture filtering
          const context = gl.getContext();
          context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR_MIPMAP_LINEAR);
        }}
        onError={(error) => console.error('SpaceRenderer3D Canvas error:', error)}
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Enhanced Environment Lighting */}
          <ambientLight intensity={brightness * 0.3} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={brightness * 0.8}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />

          <SpaceErrorBoundary spaceName={environment.name} fallback={<LoadingFallback />}>
            <ReliableSpaceEnvironment
              imageId={imageUrl}
              rotation={environment.config.autoRotation || 0}
              exposure={exposure}
              brightness={brightness}
              onLoadComplete={() => console.log('✅ Environment loaded:', imageUrl)}
              onLoadError={(error) => console.error('❌ Environment error:', error)}
            />
          </SpaceErrorBoundary>
          
          {/* Render the TRUE 3D card with real geometry */}
          {renderCard && (
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
          )}

          {/* Enhanced Contact Shadows for 3D realism */}
          <ContactShadows
            opacity={0.4}
            scale={15}
            blur={2}
            far={20}
            resolution={512}
            color="#000000"
            position={[0, -2, 0]}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          autoRotate={controls.autoRotate}
          autoRotateSpeed={controls.orbitSpeed || 0.5}
          minDistance={4}
          maxDistance={20}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
          enableDamping={true}
          dampingFactor={0.05}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
};
