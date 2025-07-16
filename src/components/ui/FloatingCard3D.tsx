import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const CardMonolith: React.FC = () => {
  const cardRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;
    
    // Phase 1: Approach (0-8 seconds)
    // Phase 2: Eclipse (8-16 seconds)
    // Phase 3: Reset (16-20 seconds)
    const cycle = elapsed % 20;
    
    if (cardRef.current) {
      if (cycle < 8) {
        // Approach phase: Move camera forward toward monolith
        const progress = cycle / 8;
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        state.camera.position.z = 15 - (easeProgress * 12); // Move from 15 to 3
        cardRef.current.position.y = Math.sin(elapsed * 0.3) * 0.05;
        cardRef.current.position.x = 0;
      } else if (cycle < 16) {
        // Eclipse phase: Monolith moves up to block sun
        const progress = (cycle - 8) / 8;
        const easeProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2; // Ease in-out
        state.camera.position.z = 3;
        cardRef.current.position.y = easeProgress * 8; // Move up to block sun
        cardRef.current.position.x = 0;
      } else {
        // Reset phase
        const progress = (cycle - 16) / 4;
        state.camera.position.z = 3 + (progress * 12); // Move back to 15
        cardRef.current.position.y = 8 - (progress * 8); // Move back down
        cardRef.current.position.x = 0;
      }
    }
  });

  return (
    <>
      
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
      
      {/* Deep space star field */}
      {Array.from({ length: 200 }).map((_, i) => {
        const distance = Math.random() * 200 + 50;
        const size = Math.random() * 0.1 + 0.01;
        const intensity = Math.random() * 0.8 + 0.2;
        
        return (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * distance,
              (Math.random() - 0.5) * distance,
              (Math.random() - 0.5) * distance - 50
            ]}
          >
            <sphereGeometry args={[size, 8, 8]} />
            <meshStandardMaterial 
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={intensity}
            />
          </mesh>
        );
      })}
      
      {/* Bright foreground stars */}
      {Array.from({ length: 30 }).map((_, i) => {
        const size = Math.random() * 0.05 + 0.03;
        const intensity = Math.random() * 1.2 + 0.8;
        
        return (
          <mesh
            key={`bright-${i}`}
            position={[
              (Math.random() - 0.5) * 60,
              (Math.random() - 0.5) * 60,
              Math.random() * 30 - 15
            ]}
          >
            <sphereGeometry args={[size, 8, 8]} />
            <meshStandardMaterial 
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={intensity}
            />
          </mesh>
        );
      })}
    </>
  );
};

export const FloatingCard3D: React.FC = () => {
  return (
    <div className="w-full h-[600px] mx-auto bg-black rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        scene={{ background: new THREE.Color('#000011') }}
      >
        {/* Ambient space lighting */}
        <ambientLight intensity={0.05} color="#000033" />
        
        {/* Main sun light */}
        <directionalLight
          position={[0, 8, -10]}
          intensity={4}
          color="#ffaa00"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* Dramatic rim light from behind monolith */}
        <directionalLight
          position={[0, 8, 5]}
          intensity={2}
          color="#ffffff"
        />
        
        {/* Subtle blue rim light */}
        <directionalLight
          position={[-10, 5, 10]}
          intensity={0.5}
          color="#4444ff"
        />
        
        <CardMonolith />
        
        {/* Deep space fog */}
        <fog args={['#000011', 20, 150]} />
      </Canvas>
    </div>
  );
};