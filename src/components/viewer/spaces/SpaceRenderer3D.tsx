import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Environment } from '@react-three/drei';
import { Group, Vector3 } from 'three';
import type { SpaceEnvironment, SpaceControls } from './types';
import { MatrixCodeSpace } from './environments/MatrixCodeSpace';
import { CartoonWorldSpace } from './environments/CartoonWorldSpace';
import { SketchArtSpace } from './environments/SketchArtSpace';
import { NeonCitySpace } from './environments/NeonCitySpace';
import { ForestGladeSpace } from './environments/ForestGladeSpace';
import { OceanDepthsSpace } from './environments/OceanDepthsSpace';
import { SportsVenueSpace } from './environments/SportsVenueSpace';
import { CulturalSpace } from './environments/CulturalSpace';
import { RetailSpace } from './environments/RetailSpace';
import { NaturalSpace } from './environments/NaturalSpace';
import { ProfessionalSpace } from './environments/ProfessionalSpace';

interface SpaceRenderer3DProps {
  environment: SpaceEnvironment;
  controls: SpaceControls;
  children?: React.ReactNode;
  onCameraReset?: () => void;
}

function FloatingCard({ controls, children }: { controls: SpaceControls; children: React.ReactNode }) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Floating animation
      const floatY = Math.sin(state.clock.elapsedTime * 0.5) * controls.floatIntensity * 0.1;
      groupRef.current.position.y = floatY;

      // Auto rotation
      if (controls.autoRotate) {
        groupRef.current.rotation.y += 0.005 * controls.orbitSpeed;
      }

      // Gravity effect simulation
      if (controls.gravityEffect > 0) {
        const gravity = Math.sin(state.clock.elapsedTime * 0.3) * controls.gravityEffect * 0.05;
        groupRef.current.position.y += gravity;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <Float
        speed={controls.floatIntensity}
        rotationIntensity={controls.floatIntensity * 0.1}
        floatIntensity={controls.floatIntensity * 0.1}
      >
        {children}
      </Float>
    </group>
  );
}

function SpaceEnvironmentRenderer({ environment }: { environment: SpaceEnvironment }) {
  switch (environment.type) {
    // New categorized environments
    case 'sports':
      return <SportsVenueSpace config={environment.config} />;
    case 'cultural':
      return <CulturalSpace config={environment.config} />;
    case 'retail':
      return <RetailSpace config={environment.config} />;
    case 'natural':
      return <NaturalSpace config={environment.config} />;
    case 'professional':
      return <ProfessionalSpace config={environment.config} />;
    
    // Existing themed environments
    case 'matrix':
      return <MatrixCodeSpace config={environment.config} />;
    case 'cartoon':
      return <CartoonWorldSpace config={environment.config} />;
    case 'sketch':
      return <SketchArtSpace config={environment.config} />;
    case 'neon':
      return <NeonCitySpace config={environment.config} />;
    case 'forest':
      return <ForestGladeSpace config={environment.config} />;
    case 'ocean':
      return <OceanDepthsSpace config={environment.config} />;
    case 'void':
      return <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />;
    case 'cosmic':
      return (
        <>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.8} fade speed={2} />
          <fog attach="fog" args={['#ff00ff', 10, 100]} />
        </>
      );
    case 'studio':
      return <Environment preset="studio" />;
    case 'abstract':
      return (
        <>
          <fog attach="fog" args={['#4338ca', 5, 50]} />
          <Stars radius={50} depth={25} count={2000} factor={6} saturation={0.3} fade speed={3} />
        </>
      );
    default:
      return <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />;
  }
}

export const SpaceRenderer3D: React.FC<SpaceRenderer3DProps> = ({
  environment,
  controls,
  children,
  onCameraReset
}) => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ 
          position: [0, 0, controls.cameraDistance],
          fov: 75 
        }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: environment.config.backgroundColor }}
      >
        {/* Lighting */}
        <ambientLight intensity={environment.config.lightIntensity * 0.4} color={environment.config.ambientColor} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={environment.config.lightIntensity * 0.8} 
          castShadow 
        />
        <pointLight position={[-10, -10, -5]} intensity={environment.config.lightIntensity * 0.3} />

        {/* Environment */}
        <SpaceEnvironmentRenderer environment={environment} />

        {/* Floating Card */}
        <FloatingCard controls={controls}>
          {children}
        </FloatingCard>

        {/* Camera Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          autoRotate={controls.autoRotate}
          autoRotateSpeed={controls.orbitSpeed * 10}
          minDistance={3}
          maxDistance={15}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
        />
      </Canvas>
    </div>
  );
};
