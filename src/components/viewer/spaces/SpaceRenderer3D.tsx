
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
  renderCard?: boolean; // New prop to control card rendering
}

const LoadingFallback: React.FC = () => (
  <>
    <ambientLight intensity={0.4} />
    <directionalLight position={[5, 10, 5]} intensity={0.6} />
  </>
);

// Map environment types to reliable image IDs
const getEnvironmentImageId = (environment: SpaceEnvironment): string => {
  if (environment.config.panoramicPhotoId) {
    return environment.config.panoramicPhotoId;
  }
  
  switch (environment.type) {
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
      return environment.config.panoramicPhotoId || 'modern-studio';
    default:
      return 'modern-studio';
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
  renderCard = true // Default to true for backward compatibility
}) => {
  console.log('🎬 SpaceRenderer3D: Rendering environment:', environment.type, environment.name, 'renderCard:', renderCard);

  const imageId = getEnvironmentImageId(environment);
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
          premultipliedAlpha: false
        }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.domElement.style.background = 'transparent';
        }}
        onError={(error) => console.error('SpaceRenderer3D Canvas error:', error)}
      >
        <Suspense fallback={<LoadingFallback />}>
          <SpaceErrorBoundary spaceName={environment.name} fallback={<LoadingFallback />}>
            <ReliableSpaceEnvironment
              imageId={imageId}
              rotation={environment.config.autoRotation || 0}
              exposure={exposure}
              brightness={brightness}
              onLoadComplete={() => console.log('✅ Environment loaded:', imageId)}
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
