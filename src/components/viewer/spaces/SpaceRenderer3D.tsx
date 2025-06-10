
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Card3D } from './Card3D';
import { SpaceErrorBoundary } from './components/SpaceErrorBoundary';
import { ForestGladeSpace } from './environments/ForestGladeSpace';
import { OceanDepthsSpace } from './environments/OceanDepthsSpace';
import { NeonCitySpace } from './environments/NeonCitySpace';
import { MatrixCodeSpace } from './environments/MatrixCodeSpace';
import { CartoonWorldSpace } from './environments/CartoonWorldSpace';
import { SketchArtSpace } from './environments/SketchArtSpace';
import { SportsVenueSpace } from './environments/SportsVenueSpace';
import { CulturalSpace } from './environments/CulturalSpace';
import { RetailSpace } from './environments/RetailSpace';
import { NaturalSpace } from './environments/NaturalSpace';
import { ProfessionalSpace } from './environments/ProfessionalSpace';
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

export const SpaceRenderer3D: React.FC<SpaceRenderer3DProps> = ({
  card,
  environment,
  controls,
  onCardClick,
  onCameraReset,
}) => {
  console.log('SpaceRenderer3D: Rendering environment:', environment.type, environment.name);

  const renderEnvironment = () => {
    try {
      switch (environment.type) {
        case 'forest':
          return <ForestGladeSpace config={environment.config} />;
        case 'ocean':
          return <OceanDepthsSpace config={environment.config} />;
        case 'neon':
          return <NeonCitySpace config={environment.config} />;
        case 'matrix':
          return <MatrixCodeSpace config={environment.config} />;
        case 'cartoon':
          return <CartoonWorldSpace config={environment.config} />;
        case 'sketch':
          return <SketchArtSpace config={environment.config} />;
        case 'sports':
          return <SportsVenueSpace config={{
            ...environment.config,
            venue: environment.config.venue as "basketball" | "football" | "baseball" | "racing" | undefined
          }} />;
        case 'cultural':
          return <CulturalSpace config={{
            ...environment.config,
            venue: environment.config.venue as "gallery" | "concert" | "library" | "theater" | undefined
          }} />;
        case 'retail':
          return <RetailSpace config={{
            ...environment.config,
            venue: environment.config.venue as "cardshop" | "gaming" | "comic" | "convention" | undefined
          }} />;
        case 'natural':
          return <NaturalSpace config={{
            ...environment.config,
            venue: environment.config.venue as "mountain" | "beach" | "forest" | "desert" | undefined,
            animationSpeed: environment.config.animationSpeed
          }} />;
        case 'professional':
          return <ProfessionalSpace config={{
            ...environment.config,
            venue: environment.config.venue as "office" | "studio" | "broadcast" | "workshop" | undefined
          }} />;
        default:
          console.log('SpaceRenderer3D: Using default environment for type:', environment.type);
          return (
            <>
              <color attach="background" args={[environment.config.backgroundColor || '#1a1a1a']} />
              <Environment preset="studio" />
              <ambientLight intensity={environment.config.lightIntensity} color={environment.config.ambientColor} />
            </>
          );
      }
    } catch (error) {
      console.error('SpaceRenderer3D: Error rendering environment:', error);
      return <LoadingFallback />;
    }
  };

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        onError={(error) => console.error('SpaceRenderer3D Canvas error:', error)}
      >
        {/* Always set a background color first */}
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
          
          <ContactShadows
            opacity={0.4}
            scale={10}
            blur={1}
            far={10}
            resolution={256}
            color="#000000"
          />
          
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            autoRotate={controls.autoRotate}
            autoRotateSpeed={controls.orbitSpeed}
            minDistance={5}
            maxDistance={15}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
