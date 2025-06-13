
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

// Complete mapping of space environments to high-quality background images
const getOptimizedEnvironmentImageUrl = (environment: SpaceEnvironment): string => {
  console.log('🖼️ Getting environment image for:', environment.name, environment.type, environment.id);
  
  // Primary mapping based on space environment ID
  const spaceIdToImageMap: Record<string, string> = {
    // Natural environments
    'forest-clearing': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2048&h=1024&fit=crop&q=80',
    'mountain-vista': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2048&h=1024&fit=crop&q=80',
    'ocean-sunset': 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=2048&h=1024&fit=crop&q=80',
    
    // Urban/Modern environments
    'city-rooftop': 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=2048&h=1024&fit=crop&q=80',
    'neon-city': 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=2048&h=1024&fit=crop&q=80',
    'cyberpunk-alley': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=2048&h=1024&fit=crop&q=80',
    
    // Interior environments
    'modern-studio': 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=2048&h=1024&fit=crop&q=80',
    'warehouse-loft': 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=2048&h=1024&fit=crop&q=80',
    'luxury-lounge': 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=2048&h=1024&fit=crop&q=80',
    
    // Sports environments
    'sports-arena': 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=2048&h=1024&fit=crop&q=80',
    'basketball-court': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=2048&h=1024&fit=crop&q=80',
    'stadium-field': 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=2048&h=1024&fit=crop&q=80',
    
    // Cultural environments
    'concert-hall': 'https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=2048&h=1024&fit=crop&q=80',
    'art-gallery': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=2048&h=1024&fit=crop&q=80',
    'theater-stage': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=2048&h=1024&fit=crop&q=80',
    
    // Fantasy/Cosmic environments
    'cosmic-void': 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=2048&h=1024&fit=crop&q=80',
    'crystal-cave': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=2048&h=1024&fit=crop&q=80',
    'aurora-sky': 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=2048&h=1024&fit=crop&q=80',
    
    // Default spaces
    'studio-default': 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=2048&h=1024&fit=crop&q=80',
    'void-space': 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=2048&h=1024&fit=crop&q=80'
  };
  
  // Check for direct space ID match first
  if (environment.id && spaceIdToImageMap[environment.id]) {
    const imageUrl = spaceIdToImageMap[environment.id];
    console.log('✅ Found direct ID match:', environment.id, '→', imageUrl);
    return imageUrl;
  }
  
  // Check for panoramicPhotoId mapping
  if (environment.config.panoramicPhotoId && spaceIdToImageMap[environment.config.panoramicPhotoId]) {
    const imageUrl = spaceIdToImageMap[environment.config.panoramicPhotoId];
    console.log('✅ Found panoramicPhotoId match:', environment.config.panoramicPhotoId, '→', imageUrl);
    return imageUrl;
  }
  
  // Fallback based on environment type with unique images
  const typeToImageMap: Record<string, string> = {
    'forest': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2048&h=1024&fit=crop&q=80',
    'mountain': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2048&h=1024&fit=crop&q=80',
    'ocean': 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=2048&h=1024&fit=crop&q=80',
    'city': 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=2048&h=1024&fit=crop&q=80',
    'neon': 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=2048&h=1024&fit=crop&q=80',
    'cosmic': 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=2048&h=1024&fit=crop&q=80',
    'sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=2048&h=1024&fit=crop&q=80',
    'cultural': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=2048&h=1024&fit=crop&q=80',
    'studio': 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=2048&h=1024&fit=crop&q=80',
    'void': 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=2048&h=1024&fit=crop&q=80',
    'panoramic': 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=2048&h=1024&fit=crop&q=80'
  };
  
  const fallbackImageUrl = typeToImageMap[environment.type] || typeToImageMap['studio'];
  console.log('⚠️ Using type-based fallback:', environment.type, '→', fallbackImageUrl);
  
  return fallbackImageUrl;
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
  console.log('🎬 SpaceRenderer3D: Rendering environment:', {
    id: environment.id,
    name: environment.name,
    type: environment.type,
    renderCard
  });

  const imageUrl = getOptimizedEnvironmentImageUrl(environment);
  const exposure = environment.config.exposure || 1.0;
  const brightness = environment.config.lightIntensity || 1.0;

  console.log('🖼️ Final image URL for rendering:', imageUrl);

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ 
          position: [0, 0, 6],
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
          
          const context = gl.getContext();
          context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR_MIPMAP_LINEAR);
          
          console.log('✅ Canvas configuration complete');
        }}
        onError={(error) => console.error('SpaceRenderer3D Canvas error:', error)}
      >
        <Suspense fallback={<LoadingFallback />}>
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
