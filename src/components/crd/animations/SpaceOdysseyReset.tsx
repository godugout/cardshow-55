import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SpaceOdysseyResetProps {
  isAnimating: boolean;
  onComplete: () => void;
}

export const SpaceOdysseyReset: React.FC<SpaceOdysseyResetProps> = ({
  isAnimating,
  onComplete
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const sunRef = useRef<THREE.Mesh>(null);
  const animationStartTime = useRef<number>(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (isAnimating && !hasStarted.current) {
      hasStarted.current = true;
      animationStartTime.current = Date.now();
    } else if (!isAnimating) {
      hasStarted.current = false;
    }
  }, [isAnimating]);

  useFrame((state) => {
    if (!isAnimating || !groupRef.current || !sunRef.current) return;

    const elapsed = (Date.now() - animationStartTime.current) / 1000;
    const duration = 4.0; // Total animation duration
    const progress = Math.min(elapsed / duration, 1);

    // Animation phases
    const phase1Duration = 1.0; // Floating and leaning forward
    const phase2Duration = 1.5; // Rising upright  
    const phase3Duration = 1.0; // Sun descent
    const phase4Duration = 0.5; // Materials develop

    if (progress < phase1Duration / duration) {
      // Phase 1: Floating in space, leaning forward
      const phase1Progress = (elapsed / phase1Duration);
      const floatY = Math.sin(phase1Progress * Math.PI * 4) * 0.1;
      const leanX = Math.sin(phase1Progress * Math.PI * 2) * 0.3;
      
      groupRef.current.position.set(0, floatY, 0);
      groupRef.current.rotation.set(leanX, 0, 0);
      
      // Sun is hidden
      sunRef.current.visible = false;
      
    } else if (progress < (phase1Duration + phase2Duration) / duration) {
      // Phase 2: Rising upright
      const phase2Progress = (elapsed - phase1Duration) / phase2Duration;
      const easedProgress = 1 - Math.pow(1 - phase2Progress, 3); // Ease out cubic
      
      // Smooth transition to upright position
      const floatY = Math.sin((phase1Duration + elapsed - phase1Duration) * Math.PI * 2) * 0.1 * (1 - easedProgress);
      const leanX = 0.3 * (1 - easedProgress);
      
      groupRef.current.position.set(0, floatY, 0);
      groupRef.current.rotation.set(leanX, 0, 0);
      
      // Sun starts appearing
      sunRef.current.visible = phase2Progress > 0.5;
      if (sunRef.current.visible) {
        sunRef.current.position.set(0, 8 - (phase2Progress - 0.5) * 2, -3);
      }
      
    } else if (progress < (phase1Duration + phase2Duration + phase3Duration) / duration) {
      // Phase 3: Sun descent behind monolith
      const phase3Progress = (elapsed - phase1Duration - phase2Duration) / phase3Duration;
      
      // Card is fully upright
      groupRef.current.position.set(0, 0, 0);
      groupRef.current.rotation.set(0, 0, 0);
      
      // Sun moves down behind the card
      sunRef.current.visible = true;
      sunRef.current.position.set(0, 6 - phase3Progress * 8, -3);
      
    } else {
      // Phase 4: Materials and ring develop
      const phase4Progress = (elapsed - phase1Duration - phase2Duration - phase3Duration) / phase4Duration;
      
      // Card remains upright
      groupRef.current.position.set(0, 0, 0);
      groupRef.current.rotation.set(0, 0, 0);
      
      // Sun has set
      sunRef.current.visible = false;
      
      // Animation complete
      if (phase4Progress >= 1 && hasStarted.current) {
        hasStarted.current = false;
        onComplete();
      }
    }
  });

  if (!isAnimating) return null;

  return (
    <group ref={groupRef}>
      {/* Glowing Sun */}
      <mesh ref={sunRef} position={[0, 8, -3]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial 
          color="#FFD700" 
          transparent
          opacity={0.8}
        />
        {/* Sun glow effect */}
        <mesh scale={[2, 2, 2]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshBasicMaterial 
            color="#FFD700" 
            transparent
            opacity={0.2}
          />
        </mesh>
      </mesh>
      
      {/* Overlay to darken the scene during animation */}
      <mesh position={[0, 0, -5]} scale={[100, 100, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial 
          color="#000000" 
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
};