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
  const animationStartTime = useRef<number | null>(null);
  
  // Define the base transforms for our scene positioning
  const basePosition = new THREE.Vector3(0, -2, 0);
  const baseRotation = new THREE.Euler(-0.4, 0, 0); // Base tilt towards sun
  
  // Easing function for smooth animations
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };
  
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    
    if (cardRef.current) {
      // Gentle bobbing motion in Y-axis only (±0.5 units)
      const bobOffset = Math.sin(elapsed * 0.8) * 0.5;
      cardRef.current.position.copy(basePosition).add(new THREE.Vector3(0, bobOffset, 0));
      
      // Handle auto-animation rotation
      if (isAutoAnimating) {
        if (animationStartTime.current === null) {
          animationStartTime.current = elapsed;
        }
        
        const animationElapsed = elapsed - animationStartTime.current;
        
        // Keep card in normal orientation throughout animation
        const sway = Math.sin(elapsed * 0.2) * 0.1;
        cardRef.current.rotation.set(baseRotation.x + sway, baseRotation.y, Math.sin(elapsed * 0.15) * 0.05);
      } else {
        // Reset animation timing and use base rotation with gentle motion
        animationStartTime.current = null;
        const tiltAngle = baseRotation.x + Math.sin(elapsed * 0.2) * 0.1;
        cardRef.current.rotation.set(tiltAngle, baseRotation.y, Math.sin(elapsed * 0.15) * 0.05);
      }
    }
    
    if (sunRef.current) {
      // Subtle sun rotation and pulsing
      sunRef.current.rotation.z = elapsed * 0.1;
      const pulse = Math.sin(elapsed * 2) * 0.1 + 1;
      sunRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <>
      {/* Card Monolith */}
      <group ref={cardRef}>
        {/* Black stone monolith - the core element */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.5, 3.5, 0.05]} />
          <meshStandardMaterial 
            color="#000000"
            roughness={0.1}
            metalness={0.0}
          />
        </mesh>
        
        {/* Completely transparent glass case - front */}
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[2.52, 3.52, 0.02]} />
          <meshPhysicalMaterial 
            color="#ffffff"
            transmission={1.0}
            opacity={0.02}
            transparent={true}
            roughness={0.0}
            metalness={0.0}
            clearcoat={1.0}
            clearcoatRoughness={0.0}
            ior={1.5}
            thickness={0.02}
          />
        </mesh>
        
        {/* Completely transparent glass case - back */}
        <mesh position={[0, 0, -0.03]}>
          <boxGeometry args={[2.52, 3.52, 0.02]} />
          <meshPhysicalMaterial 
            color="#ffffff"
            transmission={1.0}
            opacity={0.02}
            transparent={true}
            roughness={0.0}
            metalness={0.0}
            clearcoat={1.0}
            clearcoatRoughness={0.0}
            ior={1.5}
            thickness={0.02}
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
  const animationStartTime = useRef<number | null>(null);
  const initialCameraPosition = useRef(new THREE.Vector3());
  const initialCameraTarget = useRef(new THREE.Vector3());
  
  // Animation targets for different stages
  const homePosition = new THREE.Vector3(0, 0, 15);
  const homeTarget = new THREE.Vector3(0, -2, 0);
  const closePosition = new THREE.Vector3(0, -1, 6);
  const closeTarget = new THREE.Vector3(0, -2, 0);
  const finalPosition = new THREE.Vector3(0, -0.5, 6);
  const finalTarget = new THREE.Vector3(0, -2, 0);
  
  // Easing function for smooth animations
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  useFrame((state) => {
    if (isAutoAnimating) {
      if (animationStartTime.current === null) {
        animationStartTime.current = state.clock.getElapsedTime();
        initialCameraPosition.current.copy(camera.position);
        // Calculate where camera is currently looking
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(camera.quaternion);
        initialCameraTarget.current.copy(camera.position).add(forward.multiplyScalar(10));
      }
      
      const animationElapsed = state.clock.getElapsedTime() - animationStartTime.current;
      
      // Stage 1: Gentle Return (0-2 seconds)
      if (animationElapsed <= 2.0) {
        const stageProgress = Math.min(animationElapsed / 2.0, 1.0);
        const easedProgress = easeInOutCubic(stageProgress);
        
        camera.position.lerpVectors(initialCameraPosition.current, homePosition, easedProgress);
        const currentTarget = new THREE.Vector3().lerpVectors(initialCameraTarget.current, homeTarget, easedProgress);
        camera.lookAt(currentTarget);
      }
      // Stage 2: Zoom and Focus (2-4 seconds)
      else if (animationElapsed <= 4.0) {
        const stageProgress = (animationElapsed - 2.0) / 2.0;
        const easedProgress = easeInOutCubic(stageProgress);
        
        camera.position.lerpVectors(homePosition, closePosition, easedProgress);
        const currentTarget = new THREE.Vector3().lerpVectors(homeTarget, closeTarget, easedProgress);
        camera.lookAt(currentTarget);
      }
      // Stage 3: Final Positioning (4-5 seconds)
      else if (animationElapsed <= 5.0) {
        const stageProgress = (animationElapsed - 4.0) / 1.0;
        const easedProgress = easeInOutCubic(stageProgress);
        
        camera.position.lerpVectors(closePosition, finalPosition, easedProgress);
        const currentTarget = new THREE.Vector3().lerpVectors(closeTarget, finalTarget, easedProgress);
        camera.lookAt(currentTarget);
        
        // Add subtle orbital movement around the card
        const orbitRadius = 0.5 * easedProgress;
        const orbitAngle = (animationElapsed - 4.0) * 0.5;
        camera.position.x += Math.sin(orbitAngle) * orbitRadius;
        camera.position.z += Math.cos(orbitAngle) * orbitRadius * 0.3;
      }
      // Maintain final position
      else {
        camera.position.copy(finalPosition);
        camera.lookAt(finalTarget);
        
        // Continue subtle orbital movement
        const orbitAngle = (animationElapsed - 4.0) * 0.5;
        camera.position.x = finalPosition.x + Math.sin(orbitAngle) * 0.5;
        camera.position.z = finalPosition.z + Math.cos(orbitAngle) * 0.15;
      }
    } else {
      // Reset animation timing when not auto-animating
      animationStartTime.current = null;
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