
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

interface PanoramicEnvironmentProps {
  photoUrl: string;
  rotation?: number;
  exposure?: number;
  saturation?: number;
  brightness?: number;
}

export const PanoramicEnvironment: React.FC<PanoramicEnvironmentProps> = ({
  photoUrl,
  rotation = 0,
  exposure = 1.0,
  saturation = 1.0,
  brightness = 1.0
}) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const { gl, scene } = useThree();
  
  // Load the panoramic texture
  const texture = useLoader(TextureLoader, photoUrl);
  
  useEffect(() => {
    // Configure texture for panoramic use
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.flipY = false;
    
    // Set as environment map
    scene.environment = texture;
    scene.background = texture;
    
    // Configure tone mapping for realistic exposure
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = exposure;
    
    return () => {
      scene.environment = null;
      scene.background = null;
    };
  }, [texture, scene, gl, exposure]);

  useFrame(() => {
    if (sphereRef.current && rotation !== 0) {
      sphereRef.current.rotation.y += rotation * 0.001;
    }
  });

  return (
    <>
      {/* Invisible sphere for environment mapping */}
      <mesh ref={sphereRef} scale={[-100, 100, 100]}>
        <sphereGeometry args={[1, 64, 32]} />
        <meshBasicMaterial
          map={texture}
          side={THREE.BackSide}
          transparent={false}
        />
      </mesh>
      
      {/* Enhanced lighting for card illumination */}
      <ambientLight intensity={0.4 * brightness} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.6 * brightness}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.3 * brightness}
        color="#ffffff"
      />
    </>
  );
};
