import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

const CardMonolith: React.FC<{ onHover: (isHovering: boolean) => void }> = ({ onHover }) => {
  const cardRef = useRef<THREE.Group>(null);
  const sunRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (cardRef.current) {
      // Position the card in the lower portion of the screen
      cardRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.5 - 3.5;
      
      // Tilt the card towards the sun with flying motion
      const tiltAngle = -0.4 + Math.sin(state.clock.elapsedTime * 0.2) * 0.1; // Base tilt + gentle sway
      cardRef.current.rotation.x = tiltAngle;
      cardRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.05; // Subtle roll
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
      
      {/* Obsidian Monolith in Glass Case */}
      <group ref={cardRef} position={[0, 0, 0]}>
        {/* Obsidian monolith - centered and clean */}
        <mesh 
          position={[0, 0, 0]}
          onPointerEnter={() => onHover(true)}
          onPointerLeave={() => onHover(false)}
        >
          <boxGeometry args={[2.5, 3.5, 0.3]} />
          <meshStandardMaterial 
            color="#000000"
            metalness={0.95}
            roughness={0.05}
            emissive="#0a0a0a"
            emissiveIntensity={0.1}
          />
        </mesh>
        
        {/* Clear glass case */}
        <mesh
          onPointerEnter={() => onHover(true)}
          onPointerLeave={() => onHover(false)}
        >
          <boxGeometry args={[2.6, 3.6, 0.32]} />
          <meshStandardMaterial 
            color="#e6f3ff"
            metalness={0}
            roughness={0}
            transparent
            opacity={0.1}
            emissive="#ffffff"
            emissiveIntensity={0.02}
          />
        </mesh>
      </group>
      
      {/* Realistic Sun */}
      <group ref={sunRef} position={[0, -1, -10]}>
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
            color="#ffee44"
            emissive="#ff9900"
            emissiveIntensity={3}
          />
        </mesh>
        
        {/* Sun's chromosphere */}
        <mesh>
          <sphereGeometry args={[2.2, 32, 32]} />
          <meshStandardMaterial 
            color="#ff6600"
            emissive="#ff7700"
            emissiveIntensity={1.2}
            transparent
            opacity={0.4}
          />
        </mesh>
        
        {/* Sun's corona */}
        <mesh>
          <sphereGeometry args={[3, 32, 32]} />
          <meshStandardMaterial 
            color="#ffbb00"
            emissive="#ffcc33"
            emissiveIntensity={0.4}
            transparent
            opacity={0.18}
          />
        </mesh>
        
        {/* Outer corona glow */}
        <mesh>
          <sphereGeometry args={[4, 24, 24]} />
          <meshStandardMaterial 
            color="#fff8e1"
            emissive="#fff2c7"
            emissiveIntensity={0.15}
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
  const [isHoveringMonolith, setIsHoveringMonolith] = useState(false);
  return (
    <div className="w-full h-screen bg-gradient-to-t from-purple-900/30 via-blue-900/20 to-black overflow-hidden relative">
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
        
        <CardMonolith onHover={setIsHoveringMonolith} />
        
        <OrbitControls
          enableZoom={isHoveringMonolith}
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