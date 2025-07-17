import React, { useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface CardMonolithProps {
  isAutoAnimating: boolean;
}

const CardMonolith: React.FC<CardMonolithProps> = ({ isAutoAnimating }) => {
  const cardRef = useRef<THREE.Group>(null);
  const sunRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (cardRef.current) {
      // Position the card in the lower portion of the screen
      cardRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.5 - 2;
      
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
      <group ref={sunRef} position={[0, 2, -10]}>
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

const CameraController: React.FC<{ isAutoAnimating: boolean }> = ({ isAutoAnimating }) => {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3(0, 0, 15));
  const targetLookAt = useRef(new THREE.Vector3(0, -2, 0));

  useFrame(() => {
    if (isAutoAnimating) {
      // Smoothly animate camera to home position
      camera.position.lerp(targetPosition.current, 0.02);
      const lookAtTarget = new THREE.Vector3();
      lookAtTarget.copy(camera.position).add(
        new THREE.Vector3(0, -2, -15).sub(camera.position).normalize()
      );
      camera.lookAt(targetLookAt.current);
    }
  });

  return null;
};

export const FloatingCard3D: React.FC = () => {
  const [isAutoAnimating, setIsAutoAnimating] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetAutoAnimationTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setIsAutoAnimating(false);
    setHasUserInteracted(true);
    
    timeoutRef.current = setTimeout(() => {
      setIsAutoAnimating(true);
    }, 3000);
  }, []);

  const handleInteraction = useCallback(() => {
    resetAutoAnimationTimer();
  }, [resetAutoAnimationTimer]);

  React.useEffect(() => {
    // Start the timer when component mounts
    resetAutoAnimationTimer();
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetAutoAnimationTimer]);

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
        onPointerMove={handleInteraction}
        onPointerDown={handleInteraction}
        onWheel={handleInteraction}
      >
        {/* Minimal ambient space lighting */}
        <ambientLight intensity={0.02} color="#000033" />
        
        <CardMonolith isAutoAnimating={isAutoAnimating} />
        <CameraController isAutoAnimating={isAutoAnimating} />
        
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          maxDistance={25}
          minDistance={3}
          autoRotate={false}
          target={[0, 0, 0]}
          enabled={!isAutoAnimating}
        />
        
        {/* Deep space fog */}
        <fog args={['#0a0a2e', 30, 200]} />
      </Canvas>
    </div>
  );
};