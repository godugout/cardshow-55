
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { LoadingState } from '@/components/common/LoadingState';
import { HDRIEnvironmentRenderer } from '../environments/HDRIEnvironmentRenderer';
import { CartoonWorldSpace } from './environments/CartoonWorldSpace';
import { MatrixCodeSpace } from './environments/MatrixCodeSpace';
import { SketchArtSpace } from './environments/SketchArtSpace';
import { ForestGladeSpace } from './environments/ForestGladeSpace';
import { NeonCitySpace } from './environments/NeonCitySpace';
import { OceanDepthsSpace } from './environments/OceanDepthsSpace';
import { VoidSpace } from './environments/VoidSpace';
import { CosmicNebulaSpace } from './environments/CosmicNebulaSpace';
import type { SpaceEnvironment, SpaceControls } from './types';
import type { EnvironmentScene } from '../types';

interface SpaceRenderer3DProps {
  environment: SpaceEnvironment | EnvironmentScene;
  controls: SpaceControls;
  onCameraReset?: () => void;
  children?: React.ReactNode;
  environmentIntensity?: number;
}

export const SpaceRenderer3D: React.FC<SpaceRenderer3DProps> = ({
  environment,
  controls,
  onCameraReset,
  children,
  environmentIntensity = 1.0
}) => {
  // Check if environment is an EnvironmentScene (has hdriUrl) or SpaceEnvironment
  const isEnvironmentScene = 'hdriUrl' in environment || 'panoramicUrl' in environment;
  
  // Render the appropriate space environment
  const renderSpaceEnvironment = () => {
    if (isEnvironmentScene) return null;
    
    const spaceEnv = environment as SpaceEnvironment;
    
    switch (spaceEnv.type) {
      case 'void':
        return <VoidSpace config={spaceEnv.config} />;
      case 'cosmic':
        return <CosmicNebulaSpace config={spaceEnv.config} />;
      case 'cartoon':
        return <CartoonWorldSpace config={spaceEnv.config} />;
      case 'matrix':
        return <MatrixCodeSpace config={spaceEnv.config} />;
      case 'sketch':
        return <SketchArtSpace config={spaceEnv.config} />;
      case 'forest':
        return <ForestGladeSpace config={spaceEnv.config} />;
      case 'neon':
        return <NeonCitySpace config={spaceEnv.config} />;
      case 'ocean':
        return <OceanDepthsSpace config={spaceEnv.config} />;
      case 'studio':
        return (
          <>
            <ambientLight intensity={spaceEnv.config.lightIntensity * 0.8} color={spaceEnv.config.ambientColor} />
            <directionalLight position={[10, 10, 5]} intensity={spaceEnv.config.lightIntensity} castShadow />
            <pointLight position={[-10, -10, -5]} intensity={spaceEnv.config.lightIntensity * 0.3} />
          </>
        );
      case 'abstract':
        return (
          <>
            <fog attach="fog" args={[spaceEnv.config.backgroundColor, 20, 100]} />
            <ambientLight intensity={spaceEnv.config.lightIntensity * 0.4} color={spaceEnv.config.ambientColor} />
            <pointLight position={[0, 10, 0]} intensity={spaceEnv.config.lightIntensity * 0.6} color={spaceEnv.config.ambientColor} />
          </>
        );
      default:
        return (
          <>
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          </>
        );
    }
  };

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{
          position: [0, 0, controls.cameraDistance || 8],
          fov: 75
        }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {isEnvironmentScene ? (
            // Use HDRI Environment Renderer for environment scenes
            <HDRIEnvironmentRenderer 
              scene={environment as EnvironmentScene}
              intensity={environmentIntensity}
              enableCaching={true}
            />
          ) : (
            // Render 3D space environment
            renderSpaceEnvironment()
          )}

          {children}

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
            autoRotate={controls.autoRotate || false}
            autoRotateSpeed={controls.orbitSpeed || 0.5}
            minDistance={3}
            maxDistance={20}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
