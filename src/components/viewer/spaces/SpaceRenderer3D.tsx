
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
    <color attach="background" args={['#1a1a1a']} />
  </>
);

// Optimized image URLs with proper sizing
const getOptimizedEnvironmentImageId = (environment: SpaceEnvironment): string => {
  console.log('🖼️ Getting environment image for:', environment.name, environment.type);
  
  if (environment.config.panoramicPhotoId) {
    console.log('📸 Using panoramicPhotoId:', environment.config.panoramicPhotoId);
    return environment.config.panoramicPhotoId;
  }
  
  const baseUrl = 'https://images.unsplash.com/';
  const params = '?w=1024&h=512&fit=crop&crop=center&auto=format&q=85';
  
  let imageId = '';
  switch (environment.type) {
    case 'forest':
      imageId = `${baseUrl}photo-1441974231531-c6227db76b6e${params}`;
      break;
    case 'ocean':
      imageId = `${baseUrl}photo-1505142468610-359e7d316be0${params}`;
      break;
    case 'neon':
      imageId = `${baseUrl}photo-1518709268805-4e9042af2176${params}`;
      break;
    case 'cosmic':
      imageId = `${baseUrl}photo-1446776877081-d282a0f896e2${params}`;
      break;
    case 'sports':
      imageId = `${baseUrl}photo-1461896836934-ffe607ba8211${params}`;
      break;
    case 'cultural':
      imageId = `${baseUrl}photo-1493225457124-a3eb161ffa5f${params}`;
      break;
    case 'studio':
    case 'void':
      imageId = `${baseUrl}photo-1586953208448-b95a79798f07${params}`;
      break;
    case 'panoramic':
      imageId = environment.config.panoramicPhotoId ? 
        `${baseUrl}${environment.config.panoramicPhotoId}${params}` :
        `${baseUrl}photo-1586953208448-b95a79798f07${params}`;
      break;
    default:
      imageId = `${baseUrl}photo-1586953208448-b95a79798f07${params}`;
  }
  
  console.log('🌐 Generated image URL:', imageId);
  return imageId;
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
  console.log('🎬 SpaceRenderer3D: Rendering 3D environment:', environment.type, environment.name, 'renderCard:', renderCard);

  const imageUrl = getOptimizedEnvironmentImageId(environment);
  const exposure = environment.config.exposure || 1.0;
  const brightness = environment.config.lightIntensity || 1.0;

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ 
          position: [0, 0, 6], // Reduced from 8 to 6 for better environment visibility
          fov: controls.fieldOfView || 45,
          near: 0.1,
          far: 1000
        }}
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
          console.log('🎨 Canvas created, configuring renderer...');
          gl.domElement.style.background = 'transparent';
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          
          // Better texture filtering
          const context = gl.getContext();
          context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR_MIPMAP_LINEAR);
          
          console.log('✅ Canvas configuration complete');
        }}
        onError={(error) => console.error('SpaceRenderer3D Canvas error:', error)}
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Reduced ambient lighting to not wash out environment */}
          <ambientLight intensity={brightness * 0.2} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={brightness * 0.6}
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
          
          {/* Render the 3D card if requested */}
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
            opacity={0.3}
            scale={12}
            blur={1.5}
            far={15}
            resolution={512}
            color="#000000"
            position={[0, -1.5, 0]}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          autoRotate={controls.autoRotate}
          autoRotateSpeed={controls.orbitSpeed || 0.5}
          minDistance={3} // Reduced from 4
          maxDistance={15} // Reduced from 20
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
