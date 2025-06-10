
import React, { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { Environment, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface HDRIEnvironmentProps {
  hdriUrl: string;
  exposure?: number;
  backgroundBlurriness?: number;
  environmentIntensity?: number;
  rotationY?: number;
}

export const HDRIEnvironment: React.FC<HDRIEnvironmentProps> = ({
  hdriUrl,
  exposure = 1.0,
  backgroundBlurriness = 0,
  environmentIntensity = 1.0,
  rotationY = 0
}) => {
  const envMapRef = useRef<THREE.Texture | null>(null);

  // Load HDRI texture
  const hdriTexture = useLoader(RGBELoader, hdriUrl);

  useEffect(() => {
    if (hdriTexture) {
      hdriTexture.mapping = THREE.EquirectangularReflectionMapping;
      envMapRef.current = hdriTexture;
    }
  }, [hdriTexture]);

  useFrame(() => {
    if (envMapRef.current && rotationY !== 0) {
      envMapRef.current.offset.x += rotationY * 0.001;
    }
  });

  return (
    <>
      <Environment
        map={hdriTexture}
        background
        backgroundBlurriness={backgroundBlurriness}
        environmentIntensity={environmentIntensity}
      />
      
      {/* Additional atmospheric effects can be added here */}
      <ambientLight intensity={0.2} />
      
      {/* Dynamic directional light based on HDRI */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </>
  );
};
