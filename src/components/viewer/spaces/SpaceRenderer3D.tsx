
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
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
  
  // Use properly sized image URLs from Unsplash
  const baseUrl = 'https://images.unsplash.com/';
  const params = '?w=1024&h=512&fit=crop&crop=center&auto=format&q=85'; // Optimized params
  
  switch (environment.type) {
    case 'forest':
      return `${baseUrl}photo-1441974231531-c6227db76b6e${params}`; // Forest path
    case 'ocean':
      return `${baseUrl}photo-1505142468610-359e7d316be0${params}`; // Ocean sunset
    case 'neon':
      return `${baseUrl}photo-1518709268805-4e9042af2176${params}`; // Neon city
    case 'cosmic':
      return `${baseUrl}photo-1446776877081-d282a0f896e2${params}`; // Cosmic space
    case 'sports':
      return `${baseUrl}photo-1461896836934-ffe607ba8211${params}`; // Sports stadium
    case 'cultural':
      return `${baseUrl}photo-1493225457124-a3eb161ffa5f${params}`; // Concert hall
    case 'studio':
    case 'void':
      return `${baseUrl}photo-1586953208448-b95a79798f07${params}`; // Modern studio
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
  console.log('🎬 SpaceRenderer3D: Rendering environment:', environment.type, environment.name, 'renderCard:', renderCard);

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
          powerPreference: 'high-performance' // Better performance for complex scenes
        }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.domElement.style.background = 'transparent';
          // Enable better texture filtering
          gl.getContext().texParameteri(gl.getContext().TEXTURE_2D,  gl.getContext().TEXTURE_MIN_FILTER, gl.getContext().LINEAR_MIPMAP_LINEAR);
        }}
        onError={(error) => console.error('SpaceRenderer3D Canvas error:', error)}
      >
        <Suspense fallback={<LoadingFallback />}>
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
          
          {/* Only render the 3D card if renderCard is true */}
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
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          autoRotate={controls.autoRotate}
          autoRotateSpeed={controls.orbitSpeed || 0.5}
          minDistance={3}
          maxDistance={15}
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
