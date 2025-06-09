import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { LoadingState } from '@/components/common/LoadingState';
import { HDRIEnvironmentRenderer } from '../environments/HDRIEnvironmentRenderer';
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
            // Keep existing space environment rendering for SpaceEnvironments
            <>
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
              <pointLight position={[-10, -10, -5]} intensity={0.5} />
            </>
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
