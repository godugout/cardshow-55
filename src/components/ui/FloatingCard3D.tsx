import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

const CardMonolith: React.FC<{ onInactivity: boolean }> = ({ onInactivity }) => {
  const cardRef = useRef<THREE.Group>(null);
  const sunRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const [animationStartTime, setAnimationStartTime] = useState<number | null>(null);
  const [startPosition, setStartPosition] = useState<THREE.Vector3>(new THREE.Vector3());
  const [startRotation, setStartRotation] = useState<THREE.Euler>(new THREE.Euler());
  const [startCameraPos, setStartCameraPos] = useState<THREE.Vector3>(new THREE.Vector3());
  
  useFrame((state) => {
    if (cardRef.current) {
      if (onInactivity) {
        // Initialize animation on first frame of inactivity
        if (animationStartTime === null) {
          setAnimationStartTime(state.clock.elapsedTime);
          // Capture exact current positions for seamless transition
          setStartPosition(cardRef.current.position.clone());
          setStartRotation(cardRef.current.rotation.clone());
          setStartCameraPos(camera.position.clone());
          return; // Skip this frame to avoid any jumps
        }
        
        // Animation sequence after inactivity detected
        const animationTime = state.clock.elapsedTime - animationStartTime;
        const duration = 5; // 5 second animation
        const progress = Math.min(animationTime / duration, 1);
        
        // Smooth easing function
        const eased = 1 - Math.pow(1 - progress, 3);
        
        // Calculate target positions for dynamic motion
        const motionAmplitude = 3;
        const targetX = startPosition.x + Math.sin(animationTime * 0.8) * motionAmplitude * (1 - eased * 0.5);
        const targetY = startPosition.y + Math.cos(animationTime * 0.6) * motionAmplitude * 0.7 * (1 - eased * 0.5);
        const targetZ = startPosition.z + eased * 8; // Move closer for zoom effect
        
        // Smooth interpolation from start position
        cardRef.current.position.x = THREE.MathUtils.lerp(startPosition.x, targetX, eased);
        cardRef.current.position.y = THREE.MathUtils.lerp(startPosition.y, targetY, eased);
        cardRef.current.position.z = THREE.MathUtils.lerp(startPosition.z, targetZ, eased);
        
        // Calculate target rotations for dynamic motion
        const targetRotX = startRotation.x + Math.sin(animationTime * 0.5) * 0.3;
        const targetRotY = startRotation.y + animationTime * 0.4;
        const targetRotZ = startRotation.z + Math.cos(animationTime * 0.7) * 0.2;
        
        // Smooth rotation interpolation
        cardRef.current.rotation.x = THREE.MathUtils.lerp(startRotation.x, targetRotX, eased);
        cardRef.current.rotation.y = THREE.MathUtils.lerp(startRotation.y, targetRotY, eased);
        cardRef.current.rotation.z = THREE.MathUtils.lerp(startRotation.z, targetRotZ, eased);
        
        // Camera movement from start position
        const targetCamX = startCameraPos.x + 6; // Halfway across horizontal position
        const targetCamZ = Math.max(3, startCameraPos.z - 12); // Zoomed in position
        
        camera.position.x = THREE.MathUtils.lerp(startCameraPos.x, targetCamX, eased);
        camera.position.z = THREE.MathUtils.lerp(startCameraPos.z, targetCamZ, eased);
        
        // Look at the moving card
        camera.lookAt(cardRef.current.position);
      } else {
        // Reset animation state when activity resumes
        if (animationStartTime !== null) {
          setAnimationStartTime(null);
        }
        
        // Normal idle animation with subtle floating inside the case
        cardRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.5 - 2;
        cardRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.08; // Subtle horizontal float
        cardRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.5) * 0.06; // Subtle depth float
        
        // Tilt the card towards the sun with gentle floating motion
        const tiltAngle = -0.4 + Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
        cardRef.current.rotation.x = tiltAngle + Math.sin(state.clock.elapsedTime * 0.35) * 0.03; // Extra subtle tilt
        cardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.04; // Gentle yaw
        cardRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.05 + Math.cos(state.clock.elapsedTime * 0.3) * 0.02; // Enhanced roll
      }
    }
    
    if (sunRef.current) {
      if (onInactivity && animationStartTime !== null) {
        // Enhanced sun motion during animation
        const animationTime = state.clock.elapsedTime - animationStartTime;
        sunRef.current.rotation.z = animationTime * 0.3;
        sunRef.current.position.x = Math.sin(animationTime * 0.2) * 2;
        sunRef.current.position.y = 2 + Math.cos(animationTime * 0.15) * 1;
        const pulse = Math.sin(animationTime * 3) * 0.2 + 1.2;
        sunRef.current.scale.setScalar(pulse);
      } else {
        // Normal sun behavior
        sunRef.current.rotation.z = state.clock.elapsedTime * 0.1;
        sunRef.current.position.x = 0;
        sunRef.current.position.y = 2;
        const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
        sunRef.current.scale.setScalar(pulse);
      }
    }
  });

  return (
    <>
      {/* Obsidian Monolith in Glass Case */}
      <group ref={cardRef} position={[0, 0, 0]}>
        {/* Obsidian monolith - centered and clean */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.5, 3.5, 0.1]} />
          <meshStandardMaterial 
            color="#000000"
            metalness={0.95}
            roughness={0.05}
            emissive="#0a0a0a"
            emissiveIntensity={0.1}
          />
        </mesh>
        
        {/* Edge glow effects - Orange-Green-Blue gradient */}
        {/* Left edge glow */}
        <mesh position={[-1.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[3.5, 0.02]} />
          <meshStandardMaterial 
            color="#ff6b35"
            emissive="#ff6b35"
            emissiveIntensity={2}
            transparent
            opacity={0.8}
          />
        </mesh>
        
        {/* Right edge glow */}
        <mesh position={[1.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[3.5, 0.02]} />
          <meshStandardMaterial 
            color="#4ECDC4"
            emissive="#4ECDC4"
            emissiveIntensity={2}
            transparent
            opacity={0.8}
          />
        </mesh>
        
        {/* Top edge glow */}
        <mesh position={[0, 1.75, 0]}>
          <planeGeometry args={[2.5, 0.02]} />
          <meshStandardMaterial 
            color="#45B7D1"
            emissive="#45B7D1"
            emissiveIntensity={2}
            transparent
            opacity={0.8}
          />
        </mesh>
        
        {/* Bottom edge glow */}
        <mesh position={[0, -1.75, 0]}>
          <planeGeometry args={[2.5, 0.02]} />
          <meshStandardMaterial 
            color="#ff9500"
            emissive="#ff9500"
            emissiveIntensity={2}
            transparent
            opacity={0.8}
          />
        </mesh>
        
        {/* Clear glass case */}
        <mesh>
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
      {useMemo(() => 
        Array.from({ length: 200 }).map((_, i) => {
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
        }), [])}
      
      {/* Bright foreground stars */}
      {useMemo(() => 
        Array.from({ length: 30 }).map((_, i) => {
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
        }), [])}
    </>
  );
};

export const FloatingCard3D: React.FC = () => {
  const [isInactive, setIsInactive] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  
  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
      setIsInactive(false);
    };
    
    // Track mouse movement, clicks, scrolling
    const events = ['mousemove', 'mousedown', 'click', 'scroll', 'wheel', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });
    
    // Check for inactivity every second
    const inactivityTimer = setInterval(() => {
      const now = Date.now();
      if (now - lastActivity > 3000) { // 3 seconds of inactivity
        setIsInactive(true);
      }
    }, 1000);
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      clearInterval(inactivityTimer);
    };
  }, [lastActivity]);

  return (
    <div className="w-full h-screen bg-gradient-to-t from-purple-900/30 via-blue-900/20 to-black overflow-hidden relative">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        scene={{ background: null }}
      >
        {/* Minimal ambient space lighting */}
        <ambientLight intensity={0.02} color="#000033" />
        
        <CardMonolith onInactivity={isInactive} />
        
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