import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const CardMonolith: React.FC = () => {
  const cardRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (cardRef.current) {
      cardRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <>
      {/* Ground Plane - Lunar surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color="#2a2a2a"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Card Monolith */}
      <group ref={cardRef} position={[0, 0, 0]}>
        {/* Main monolith structure */}
        <mesh>
          <boxGeometry args={[2.5, 3.5, 0.3]} />
          <meshStandardMaterial 
            color="#000000"
            metalness={0.9}
            roughness={0.1}
            emissive="#111111"
          />
        </mesh>
        
        {/* Mysterious glow effect */}
        <mesh>
          <boxGeometry args={[2.6, 3.6, 0.31]} />
          <meshStandardMaterial 
            color="#000000"
            metalness={1}
            roughness={0}
            transparent
            opacity={0.3}
            emissive="#0a0a2e"
          />
        </mesh>
      </group>
      
      {/* The Sun */}
      <mesh position={[0, 8, -10]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial 
          color="#ffff88"
          emissive="#ffaa00"
          emissiveIntensity={2}
        />
      </mesh>
      
      {/* Sun corona effect */}
      <mesh position={[0, 8, -10]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial 
          color="#ffff00"
          emissive="#ffaa00"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Distant stars */}
      {Array.from({ length: 50 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 100,
            Math.random() * 20 + 5,
            (Math.random() - 0.5) * 100 - 20
          ]}
        >
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial 
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={Math.random() * 0.5 + 0.3}
          />
        </mesh>
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