import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Text, Sphere, Plane } from '@react-three/drei';
import * as THREE from 'three';

const CardMonolith: React.FC = () => {
  const cardRef = useRef<THREE.Group>(null);
  const sunRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (cardRef.current) {
      // Very subtle floating animation for the monolith
      cardRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
    
    if (sunRef.current) {
      // Subtle sun rotation
      sunRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <>
      {/* Ground Plane - Lunar surface */}
      <Plane
        args={[50, 50]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2, 0]}
      >
        <meshStandardMaterial 
          color="#2a2a2a"
          roughness={0.9}
          metalness={0.1}
        />
      </Plane>
      
      {/* Card Monolith */}
      <group ref={cardRef} position={[0, 0, 0]}>
        {/* Main monolith structure */}
        <RoundedBox
          args={[2.5, 3.5, 0.3]} // 2.5x3.5 aspect ratio, thicker like monolith
          radius={0.05}
          smoothness={4}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial 
            color="#000000"
            metalness={0.9}
            roughness={0.1}
            emissive="#111111"
          />
        </RoundedBox>
        
        {/* Mysterious glow effect */}
        <RoundedBox
          args={[2.6, 3.6, 0.31]}
          radius={0.05}
          smoothness={4}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial 
            color="#000000"
            metalness={1}
            roughness={0}
            transparent
            opacity={0.3}
            emissive="#0a0a2e"
          />
        </RoundedBox>
        
        {/* Subtle CRD text that appears only under certain light */}
        <Text
          position={[0, 0, 0.16]}
          fontSize={0.15}
          color="#111111"
          anchorX="center"
          anchorY="middle"
        >
          CRD
          <meshStandardMaterial 
            emissive="#001100"
            emissiveIntensity={0.1}
          />
        </Text>
      </group>
      
      {/* The Sun */}
      <Sphere
        ref={sunRef}
        args={[1.5, 32, 32]}
        position={[0, 8, -10]}
      >
        <meshStandardMaterial 
          color="#ffff88"
          emissive="#ffaa00"
          emissiveIntensity={2}
        />
      </Sphere>
      
      {/* Sun corona effect */}
      <Sphere
        args={[2, 32, 32]}
        position={[0, 8, -10]}
      >
        <meshStandardMaterial 
          color="#ffff00"
          emissive="#ffaa00"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </Sphere>
      
      {/* Distant stars */}
      {Array.from({ length: 50 }).map((_, i) => (
        <Sphere
          key={i}
          args={[0.02, 8, 8]}
          position={[
            (Math.random() - 0.5) * 100,
            Math.random() * 20 + 5,
            (Math.random() - 0.5) * 100 - 20
          ]}
        >
          <meshStandardMaterial 
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={Math.random() * 0.5 + 0.3}
          />
        </Sphere>
      ))}
    </>
  );
};

export const FloatingCard3D: React.FC = () => {
  return (
    <div className="w-full h-[600px] mx-auto bg-black rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [3, 2, 8], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        scene={{ background: new THREE.Color('#000011') }}
      >
        {/* Ambient space lighting */}
        <ambientLight intensity={0.1} color="#000033" />
        
        {/* Main sun light */}
        <directionalLight
          position={[0, 8, -10]}
          intensity={3}
          color="#ffaa00"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* Fill light for the monolith */}
        <pointLight
          position={[5, 3, 5]}
          intensity={0.5}
          color="#ffffff"
        />
        
        {/* Dramatic rim light */}
        <directionalLight
          position={[-10, 5, 10]}
          intensity={1}
          color="#4444ff"
        />
        
        <CardMonolith />
        
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          maxDistance={15}
          minDistance={5}
          maxPolarAngle={Math.PI / 2 + 0.3}
          minPolarAngle={Math.PI / 6}
          autoRotate={false}
          target={[0, 0, 0]}
        />
        
        {/* Fog for atmospheric depth */}
        <fog args={['#000011', 10, 100]} />
      </Canvas>
    </div>
  );
};