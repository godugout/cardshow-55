
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Card3D } from './Card3D';
import { SpaceErrorBoundary } from './components/SpaceErrorBoundary';
import { ReliablePanoramicSpace } from './environments/ReliablePanoramicSpace';
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
    <color attach="background" args={['#1a1a2e']} />
    <Environment preset="studio" />
    <ambientLight intensity={0.4} />
    <directionalLight position={[5, 10, 5]} intensity={0.6} />
  </>
);

// Map all environment types to appropriate image IDs
const getEnvironmentImageId = (environment: SpaceEnvironment): string => {
  // If already has panoramic photo ID, use it
  if (environment.config.panoramicPhotoId) {
    return environment.config.panoramicPhotoId;
  }
  
  // Map environment types to image IDs
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
      return 'modern-studio'; // Safe fallback
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

  // Create reliable panoramic environment config
  const reliableConfig = {
    ...environment.config,
    panoramicPhotoId: getEnvironmentImageId(environment),
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
        <color attach="background" args={[environment.config.backgroundColor || '#1a1a2e']} />
        
        <Suspense fallback={<LoadingFallback />}>
          <SpaceErrorBoundary spaceName={environment.name} fallback={<LoadingFallback />}>
            <ReliablePanoramicSpace config={reliableConfig} controls={controls} />
          </SpaceErrorBoundary>
          
          <Card3D
            card={card}
            controls={controls}
            onClick={onCardClick}
          />
        </Suspense>

        {/* Separate camera controls - ONLY for camera, not card */}
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
