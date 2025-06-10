
import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { FloatingCard } from './components/FloatingCard';
import { ReliablePanoramicSpace } from './environments/ReliablePanoramicSpace';
import { LoadingFallback } from './components/LoadingFallback';
import { MotionControls } from '../components/MotionControls';
import type { SpaceEnvironment, SpaceControls } from './types';
import * as THREE from 'three';

interface SpaceRendererProps {
  spaceEnvironment: SpaceEnvironment;
  spaceControls: SpaceControls;
  card: any;
  onCardClick: () => void;
  onCameraReset: () => void;
  onError?: (error: string) => void;
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
  onError,
  environmentControls = {
    depthOfField: 1.0,
    parallaxIntensity: 1.0,
    fieldOfView: 75,
    atmosphericDensity: 1.0
  }
}) => {
  const orbitControlsRef = useRef<any>();
  const cardRotationRef = useRef<any>();
  
  console.log('🌌 SpaceRenderer with simple rotation:', { 
    spaceName: spaceEnvironment.name,
    spaceControls, 
    environmentControls 
  });

  // Reset camera when requested
  useEffect(() => {
    if (orbitControlsRef.current) {
      const controls = orbitControlsRef.current;
      
      // Apply camera distance with smooth transition
      const targetDistance = spaceControls.cameraDistance;
      const currentDistance = controls.getDistance();
      
      if (Math.abs(currentDistance - targetDistance) > 0.1) {
        controls.dollyTo(targetDistance, true);
      }
    }
  }, [spaceControls.cameraDistance]);

  // Enhanced camera settings
  const cameraSettings = {
    position: [0, 0, spaceControls.cameraDistance] as [number, number, number],
    fov: environmentControls.fieldOfView,
    near: 0.1,
    far: 1000
  };

  const handleCanvasError = (error: any) => {
    const errorMessage = error instanceof Error ? error.message : 'Canvas rendering error';
    console.error('🚨 SpaceRenderer Canvas error:', errorMessage);
    onError?.(errorMessage);
  };

  const handleSpaceLoadError = (error: Error) => {
    const errorMessage = `Failed to load space "${spaceEnvironment.name}": ${error.message}`;
    console.error('🚨 Space loading error:', errorMessage);
    onError?.(errorMessage);
  };

  // Simplified control handlers
  const handleStopMotion = () => {
    if (cardRotationRef.current) {
      cardRotationRef.current.stopMotion();
    }
  };

  const handleSnapToCenter = () => {
    if (cardRotationRef.current) {
      cardRotationRef.current.resetRotation();
    }
  };

  const handleResetRotation = () => {
    if (cardRotationRef.current) {
      cardRotationRef.current.resetRotation();
    }
    if (orbitControlsRef.current) {
      orbitControlsRef.current.reset();
    }
  };

  const handleFlipCard = () => {
    if (cardRotationRef.current) {
      cardRotationRef.current.flipCard();
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full">
      {/* Simplified Motion Controls */}
      <div className="absolute top-4 left-4 z-50">
        <MotionControls
          onStopMotion={handleStopMotion}
          onSnapToCenter={handleSnapToCenter}
          onResumeMotion={() => {}} // No complex motion to resume
          onResetRotation={handleResetRotation}
          onFlipCard={handleFlipCard}
          isMotionStopped={false} // Always allow interaction
        />
      </div>

      {/* Simple Instructions */}
      <div className="absolute bottom-4 right-4 z-50 bg-black/60 text-white p-3 rounded-lg text-sm">
        <div className="space-y-1">
          <div>• Drag to rotate card</div>
          <div>• Double-click to flip</div>
          <div>• Use controls to reset</div>
        </div>
      </div>

      {/* 3D Canvas */}
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
        onCreated={({ gl }) => {
          console.log('✅ Canvas created successfully with simple rotation');
        }}
      >
        {/* Enhanced fog for atmospheric density */}
        <fog 
          attach="fog" 
          args={['#000000', 10, 50 * environmentControls.atmosphericDensity]} 
        />
        
        <Suspense fallback={<LoadingFallback />}>
          {/* Environment */}
          <ReliablePanoramicSpace
            config={{
              ...spaceEnvironment.config,
              exposure: spaceEnvironment.config.exposure * environmentControls.atmosphericDensity
            }}
            controls={spaceControls}
            onError={handleSpaceLoadError}
          />
          
          {/* Simplified floating card - always centered */}
          <FloatingCard
            card={card}
            onClick={onCardClick}
            onRotationRef={(rotation) => {
              cardRotationRef.current = rotation;
            }}
          />
          
          {/* Enhanced orbit controls */}
          <OrbitControls
            ref={orbitControlsRef}
            enablePan={false}
            enableZoom={true}
            autoRotate={spaceControls.orbitSpeed > 0}
            autoRotateSpeed={spaceControls.orbitSpeed * 2}
            minDistance={3}
            maxDistance={15}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
            maxAzimuthAngle={Math.PI / 3}
            minAzimuthAngle={-Math.PI / 3}
            dampingFactor={0.1}
            enableDamping={true}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
