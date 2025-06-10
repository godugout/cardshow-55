
import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { FloatingCard } from './components/FloatingCard';
import { ReliablePanoramicSpace } from './environments/ReliablePanoramicSpace';
import { LoadingFallback } from './components/LoadingFallback';
import type { SpaceEnvironment, SpaceControls } from './types';
import * as THREE from 'three';

interface SpaceRendererProps {
  spaceEnvironment: SpaceEnvironment;
  spaceControls: SpaceControls;
  card: any;
  onCardClick: () => void;
  onCameraReset: () => void;
  environmentControls?: {
    depthOfField: number;
    parallaxIntensity: number;
    fieldOfView: number;
    atmosphericDensity: number;
  };
}

export const SpaceRenderer: React.FC<SpaceRendererProps> = ({
  spaceEnvironment,
  spaceControls,
  card,
  onCardClick,
  onCameraReset,
  environmentControls = {
    depthOfField: 1.0,
    parallaxIntensity: 1.0,
    fieldOfView: 75,
    atmosphericDensity: 1.0
  }
}) => {
  const orbitControlsRef = useRef<any>();
  
  console.log('🌌 SpaceRenderer rendering with controls:', { spaceControls, environmentControls });

  // Reset camera when requested
  useEffect(() => {
    if (orbitControlsRef.current) {
      const controls = orbitControlsRef.current;
      
      // Apply camera distance
      const targetDistance = spaceControls.cameraDistance;
      const currentDistance = controls.getDistance();
      
      if (Math.abs(currentDistance - targetDistance) > 0.1) {
        controls.dollyTo(targetDistance, true);
      }
    }
  }, [spaceControls.cameraDistance]);

  // Enhanced camera settings based on environment controls
  const cameraSettings = {
    position: [0, 0, spaceControls.cameraDistance] as [number, number, number],
    fov: environmentControls.fieldOfView,
    near: 0.1,
    far: 1000
  };

  const handleCanvasError = (error: any) => {
    console.error('🚨 SpaceRenderer Canvas error:', error);
  };

  return (
    <div className="fixed inset-0 w-full h-full">
      <Canvas
        camera={cameraSettings}
        shadows
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true
        }}
        onError={handleCanvasError}
      >
        {/* Enhanced fog for atmospheric density */}
        <fog 
          attach="fog" 
          args={['#000000', 10, 50 * environmentControls.atmosphericDensity]} 
        />
        
        <Suspense fallback={<LoadingFallback />}>
          {/* Environment with enhanced controls */}
          <ReliablePanoramicSpace
            config={{
              ...spaceEnvironment.config,
              exposure: spaceEnvironment.config.exposure * environmentControls.atmosphericDensity
            }}
            controls={spaceControls}
          />
          
          {/* Enhanced floating card with physics */}
          <FloatingCard
            card={card}
            floatIntensity={spaceControls.floatIntensity}
            autoRotate={spaceControls.autoRotate}
            gravityEffect={spaceControls.gravityEffect}
            onClick={onCardClick}
            environmentControls={environmentControls}
          />
          
          {/* Enhanced orbit controls */}
          <OrbitControls
            ref={orbitControlsRef}
            enablePan={false}
            enableZoom={true}
            autoRotate={spaceControls.orbitSpeed > 0}
            autoRotateSpeed={spaceControls.orbitSpeed * 2}
            minDistance={2}
            maxDistance={20}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
            dampingFactor={0.05}
            enableDamping={true}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
