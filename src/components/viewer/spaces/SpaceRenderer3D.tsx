
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Card3D } from './Card3D';
import { SpaceErrorBoundary } from './components/SpaceErrorBoundary';
import { Simple360Environment } from './environments/Simple360Environment';
import { PANORAMIC_360_ENVIRONMENTS, getPanoramic360EnvironmentById, getDefaultPanoramic360Environment } from './environments/Panoramic360Library';
import type { SpaceEnvironment, SpaceControls } from './types';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import type { CardData } from '@/hooks/useCardEditor';

interface SpaceRenderer3DProps {
  card: CardData;
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
  console.log('🎬 SpaceRenderer3D: Rendering 360° environment:', {
    id: environment.id,
    name: environment.name,
    type: environment.type,
    renderCard
  });

  // Check if this is a 360° environment request
  const is360Environment = environment.type === 'panoramic' || environment.category === 'panoramic';
  
  if (is360Environment) {
    console.log('🌍 Using CSS-based 360° environment system');
    return (
      <Simple360Environment
        card={card}
        environmentId={environment.id}
        autoRotate={controls.autoRotate}
        onCardClick={onCardClick}
      />
    );
  }

  // Fallback to basic Three.js scene for non-360 environments
  const panoramicEnvironment = getDefaultPanoramic360Environment();
  
  console.log('🎨 Using fallback Three.js environment');

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ 
          position: [0, 0, 8],
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
          console.log('🎨 Canvas created for fallback Three.js scene');
          gl.domElement.style.background = 'transparent';
        }}
        onError={(error) => console.error('SpaceRenderer3D Canvas error:', error)}
      >
        <Suspense fallback={<LoadingFallback />}>
          <SpaceErrorBoundary spaceName="Fallback Environment" fallback={<LoadingFallback />}>
            {/* Basic lighting setup */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
            <pointLight position={[-5, 5, 5]} intensity={0.4} />
            
            {/* Simple gradient background */}
            <color attach="background" args={['#1a1a2e']} />
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
          autoRotateSpeed={0.5}
          minDistance={3}
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
