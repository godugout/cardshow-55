
import React, { useRef, useEffect, Suspense } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import { Environment, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface HDRIEnvironmentProps {
  hdriUrl: string;
  exposure?: number;
  backgroundBlurriness?: number;
  environmentIntensity?: number;
  rotationY?: number;
}

const HDRITexture: React.FC<{ url: string; rotationY?: number }> = ({ url, rotationY = 0 }) => {
  const texture = useLoader(THREE.TextureLoader, url);
  
  useFrame(() => {
    if (texture && rotationY !== 0) {
      texture.offset.x += rotationY * 0.001;
    }
  });

  return (
    <Sphere args={[50]} scale={[-1, 1, 1]}>
      <meshBasicMaterial 
        map={texture}
        side={THREE.BackSide}
      />
    </Sphere>
  );
};

const FallbackEnvironment: React.FC<{ environmentIntensity: number }> = ({ environmentIntensity }) => (
  <>
    <Environment preset="studio" />
    <ambientLight intensity={0.3 * environmentIntensity} />
    <directionalLight
      position={[10, 10, 5]}
      intensity={0.5 * environmentIntensity}
      castShadow
    />
  </>
);

export const HDRIEnvironment: React.FC<HDRIEnvironmentProps> = ({
  hdriUrl,
  exposure = 1.0,
  backgroundBlurriness = 0,
  environmentIntensity = 1.0,
  rotationY = 0
}) => {
  const { gl } = useThree();

  useEffect(() => {
    console.log('HDRIEnvironment: Loading HDRI from:', hdriUrl);
    gl.toneMappingExposure = exposure;
  }, [gl, exposure, hdriUrl]);

  return (
    <Suspense fallback={<FallbackEnvironment environmentIntensity={environmentIntensity} />}>
      <HDRITexture url={hdriUrl} rotationY={rotationY} />
      
      <ambientLight intensity={0.2 * environmentIntensity} />
      
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.5 * environmentIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </Suspense>
  );
};
