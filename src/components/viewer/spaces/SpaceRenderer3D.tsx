
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Card3D } from './Card3D';
import { SpaceErrorBoundary } from './components/SpaceErrorBoundary';
import { PanoramicSpace } from './environments/PanoramicSpace';
import type { SpaceEnvironment, SpaceControls } from './types';

interface Simple3DCard {
  id: string;
  title: string;
  image_url?: string;
}

interface SpaceRenderer3DProps {
  card: Simple3DCard;
  environment: SpaceEnvironment;
  controls: SpaceControls;
  onCardClick?: () => void;
  onCameraReset?: () => void;
}

const LoadingFallback: React.FC = () => (
  <>
    <color attach="background" args={['#1a1a1a']} />
    <Environment preset="studio" />
    <ambientLight intensity={0.4} />
  </>
);

// Map environment types to panoramic photo IDs
const getEnvironmentPhotoId = (environment: SpaceEnvironment): string => {
  // If already panoramic with photoId, use it
  if (environment.type === 'panoramic' && environment.config.panoramicPhotoId) {
    return environment.config.panoramicPhotoId;
  }
  
  // Map other environment types to appropriate panoramic photos
  switch (environment.type) {
    case 'forest':
      return 'forest-clearing';
    case 'ocean':
      return 'ocean-sunset';
    case 'neon':
    case 'cosmic':
      return 'cosmic-void';
    case 'sports':
      return 'sports-arena';
    case 'cultural':
      return 'concert-hall';
    case 'studio':
    case 'void':
      return 'modern-studio';
    default:
      return 'modern-studio'; // Fallback to studio
  }
};

export const SpaceRenderer3D: React.FC<SpaceRenderer3DProps> = ({
  card,
  environment,
  controls,
  onCardClick,
  onCameraReset,
}) => {
  console.log('SpaceRenderer3D: Rendering environment:', environment.type, environment.name);

  // Create panoramic environment config
  const panoramicConfig = {
    ...environment.config,
    panoramicPhotoId: getEnvironmentPhotoId(environment),
  };

  const renderEnvironment = () => {
    try {
      return <PanoramicSpace config={panoramicConfig} controls={controls} />;
    } catch (error) {
      console.error('SpaceRenderer3D: Error rendering environment:', error);
      return <LoadingFallback />;
    }
  };

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: controls.fieldOfView || 45 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        onError={(error) => console.error('SpaceRenderer3D Canvas error:', error)}
      >
        <color attach="background" args={[environment.config.backgroundColor || '#1a1a1a']} />
        
        <Suspense fallback={<LoadingFallback />}>
          <SpaceErrorBoundary spaceName={environment.name} fallback={<LoadingFallback />}>
            {renderEnvironment()}
          </SpaceErrorBoundary>
          
          <Card3D
            card={card}
            controls={controls}
            onClick={onCardClick}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
