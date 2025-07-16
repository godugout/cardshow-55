import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

const CardMonolith: React.FC = () => {
  const cardRef = useRef<THREE.Group>(null);
  const sunRef = useRef<THREE.Group>(null);
  
  // Load the CRD catalog card texture
  const cardTexture = useLoader(THREE.TextureLoader, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=600&fit=crop');
  
  // Configure the texture
  useMemo(() => {
    if (cardTexture) {
      cardTexture.wrapS = THREE.ClampToEdgeWrapping;
      cardTexture.wrapT = THREE.ClampToEdgeWrapping;
      cardTexture.minFilter = THREE.LinearFilter;
      cardTexture.magFilter = THREE.LinearFilter;
    }
  }, [cardTexture]);
  
  useFrame((state) => {
    if (cardRef.current) {
      // Subtle floating animation
      cardRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.3) * 0.001;
    }
    
    if (sunRef.current) {
      // Subtle sun rotation and pulsing
      sunRef.current.rotation.z = state.clock.elapsedTime * 0.1;
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
      sunRef.current.scale.setScalar(pulse);
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
        
        {/* Card back - CRD design */}
        <mesh position={[0, 0, -0.16]}>
          <boxGeometry args={[2.4, 3.4, 0.01]} />
          <meshStandardMaterial 
            color="#1a1a2e"
            metalness={0.3}
            roughness={0.7}
            emissive="#0a0a2e"
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* CRD Logo on back */}
        <mesh position={[0, 0.8, -0.17]}>
          <boxGeometry args={[1.5, 0.3, 0.01]} />
          <meshStandardMaterial 
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.1}
          />
        </mesh>
        
        {/* Card image area with CRD catalog image */}
        <mesh position={[0, -0.2, -0.2]} rotation={[0, Math.PI, 0]}>
          <boxGeometry args={[2.0, 1.8, 0.01]} />
          <meshStandardMaterial 
            map={cardTexture}
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>
        
        {/* Card title text */}
        <Text
          position={[0, 0.8, -0.18]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          LeBron James
        </Text>
        
        {/* Card subtitle text */}
        <Text
          position={[0, 0.6, -0.18]}
          fontSize={0.08}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
        >
          Los Angeles Lakers
        </Text>
        
        {/* Card description area */}
        <mesh position={[0, -1.3, -0.17]}>
          <boxGeometry args={[2.0, 0.8, 0.01]} />
          <meshStandardMaterial 
            color="#1a1a1a"
            metalness={0.2}
            roughness={0.9}
            emissive="#0a0a0a"
            emissiveIntensity={0.1}
          />
        </mesh>
        
        {/* Card stats text */}
        <Text
          position={[0, -1.2, -0.18]}
          fontSize={0.08}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Forward | 38 years | 4x NBA Champion
        </Text>
        
        {/* Card rarity text */}
        <Text
          position={[0, -1.4, -0.18]}
          fontSize={0.07}
          color="#ff6b35"
          anchorX="center"
          anchorY="middle"
        >
          LEGENDARY
        </Text>
        
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
      
      {/* Realistic Sun */}
      <group ref={sunRef} position={[0, 8, -10]}>
        {/* Sun light source */}
        <pointLight
          intensity={8}
          color="#ffaa00"
          distance={50}
          decay={2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* Sun core */}
        <mesh>
          <sphereGeometry args={[1.8, 64, 64]} />
          <meshStandardMaterial 
            color="#ffdd44"
            emissive="#ff8800"
            emissiveIntensity={3}
          />
        </mesh>
        
        {/* Sun's chromosphere */}
        <mesh>
          <sphereGeometry args={[2.2, 32, 32]} />
          <meshStandardMaterial 
            color="#ff4400"
            emissive="#ff6600"
            emissiveIntensity={1}
            transparent
            opacity={0.4}
          />
        </mesh>
        
        {/* Sun's corona */}
        <mesh>
          <sphereGeometry args={[3, 32, 32]} />
          <meshStandardMaterial 
            color="#ffaa00"
            emissive="#ffaa00"
            emissiveIntensity={0.3}
            transparent
            opacity={0.15}
          />
        </mesh>
        
        {/* Outer corona glow */}
        <mesh>
          <sphereGeometry args={[4, 24, 24]} />
          <meshStandardMaterial 
            color="#ffccaa"
            emissive="#ffccaa"
            emissiveIntensity={0.1}
            transparent
            opacity={0.08}
          />
        </mesh>
      </group>
      
      {/* Deep space star field */}
      {Array.from({ length: 200 }).map((_, i) => {
        const distance = Math.random() * 200 + 50;
        const size = Math.random() * 0.08 + 0.01;
        const intensity = Math.random() * 0.3 + 0.1;
        
        // Gradient colors from purple to blue to match background
        const colors = ['#9333ea', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
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
              color={color}
              emissive={color}
              emissiveIntensity={intensity}
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}
      
      {/* Bright foreground stars */}
      {Array.from({ length: 30 }).map((_, i) => {
        const size = Math.random() * 0.04 + 0.02;
        const intensity = Math.random() * 0.8 + 0.4;
        
        // Warmer colors for foreground stars
        const colors = ['#ffffff', '#fff4e6', '#fef3c7', '#fde68a'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
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
              color={color}
              emissive={color}
              emissiveIntensity={intensity}
              transparent
              opacity={0.8}
            />
          </mesh>
        );
      })}
    </>
  );
};

export const FloatingCard3D: React.FC = () => {
  return (
    <div className="w-full h-[800px] mx-auto bg-gradient-to-t from-purple-900/30 via-blue-900/20 to-black rounded-lg overflow-hidden relative">
      {/* Matching star field for seamless integration */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => {
          const size = Math.random() * 2 + 0.5;
          const opacity = Math.random() * 0.6 + 0.2;
          const animationDelay = Math.random() * 3;
          
          return (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                opacity,
                animationDelay: `${animationDelay}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          );
        })}
      </div>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        scene={{ background: null }}
      >
        {/* Minimal ambient space lighting */}
        <ambientLight intensity={0.02} color="#000033" />
        
        <CardMonolith />
        
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          maxDistance={25}
          minDistance={3}
          autoRotate={false}
          target={[0, 0, 0]}
        />
        
        {/* Deep space fog */}
        <fog args={['#0a0a2e', 30, 200]} />
      </Canvas>
    </div>
  );
};