
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
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
  const { gl } = useThree();
  const envMapRef = useRef<THREE.Texture | null>(null);

  useEffect(() => {
    // Set exposure for tone mapping
    gl.toneMappingExposure = exposure;
  }, [gl, exposure]);

  useFrame(() => {
    if (envMapRef.current && rotationY !== 0) {
      envMapRef.current.offset.x += rotationY * 0.001;
    }
  });

  return (
    <>
      {/* Use a high-res texture as background */}
      <Sphere args={[50]} scale={[-1, 1, 1]}>
        <meshBasicMaterial 
          map={new THREE.TextureLoader().load(hdriUrl)}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Additional atmospheric effects */}
      <ambientLight intensity={0.2 * environmentIntensity} />
      
      {/* Dynamic directional light */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.5 * environmentIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </>
  );
};
