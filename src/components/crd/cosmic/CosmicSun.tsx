import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

interface CosmicSunProps {
  scrollProgress: number;
  onSunsetPointReached?: (reached: boolean) => void;
  onCardLeanRequired?: (lean: boolean) => void;
}

export const CosmicSun: React.FC<CosmicSunProps> = ({ 
  scrollProgress, 
  onSunsetPointReached, 
  onCardLeanRequired 
}) => {
  const sunRef = useRef<THREE.Mesh>(null);
  const fireRingRef = useRef<THREE.Mesh>(null);
  const previousSunsetState = useRef(false);

  // Realistic sun material with fiery surface
  const sunMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#FFA500',
      emissive: '#FF4500',
      emissiveIntensity: 1.5,
      roughness: 1.0,
      metalness: 0.0,
    });
  }, []);

  // Fiery edge ring material - subtle animated fire effect
  const fireRingMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: '#FF6B35',
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
  }, []);

  useFrame((state) => {
    if (sunRef.current && fireRingRef.current) {
      const time = state.clock.elapsedTime;
      
      // Enhanced sun movement with non-linear descent and sunset point detection
      // Sunset point: 0.65-0.75 scroll progress range
      const sunsetPointStart = 0.65;
      const sunsetPointEnd = 0.75;
      const isSunsetPoint = scrollProgress >= sunsetPointStart && scrollProgress <= sunsetPointEnd;
      
      // Non-linear easing function for smooth deceleration at sunset point
      const easeInOutQuart = (t: number) => {
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
      };
      
      // Apply easing to create dramatic slowdown at sunset point
      let easedProgress = scrollProgress;
      if (scrollProgress > sunsetPointStart) {
        const localProgress = (scrollProgress - sunsetPointStart) / (1 - sunsetPointStart);
        easedProgress = sunsetPointStart + (1 - sunsetPointStart) * easeInOutQuart(localProgress);
      }
      
      // Enhanced sun positioning - lower final position so only small part visible
      const sunY = THREE.MathUtils.lerp(8, -4, easedProgress * 0.9); // Much lower descent
      const sunZ = THREE.MathUtils.lerp(-5, -3.5, easedProgress * 0.8); // Position in front of card
      
      sunRef.current.position.set(0, sunY, sunZ);
      fireRingRef.current.position.copy(sunRef.current.position);
      
      // Detect sunset point transition and notify parent
      if (isSunsetPoint && !previousSunsetState.current) {
        previousSunsetState.current = true;
        onSunsetPointReached?.(true);
        onCardLeanRequired?.(true);
      }
      
      // Enhanced lighting effects based on position
      const baseIntensity = THREE.MathUtils.lerp(0.8, 3.0, scrollProgress);
      
      // Dramatic pulsating at sunset point
      if (isSunsetPoint) {
        const dramaticPulse = Math.sin(time * 2) * 0.5 + 1.2;
        sunMaterial.emissiveIntensity = baseIntensity * dramaticPulse;
        
        // Enhanced fire ring for sunset drama
        const sunsetFlicker = Math.sin(time * 6) * 0.3 + Math.sin(time * 9) * 0.2;
        fireRingMaterial.opacity = 0.8 + sunsetFlicker;
        fireRingMaterial.color.setHSL(0.1 + sunsetFlicker * 0.1, 1, 0.6); // Color shift
      } else if (scrollProgress > 0.8) {
        const pulse = Math.sin(time * 1.5) * 0.3 + 1;
        sunMaterial.emissiveIntensity = baseIntensity * pulse;
        
        const fireFlicker = Math.sin(time * 4) * 0.2 + Math.sin(time * 7) * 0.1;
        fireRingMaterial.opacity = 0.7 + fireFlicker;
      } else {
        sunMaterial.emissiveIntensity = baseIntensity;
      }
      
      // Enhanced surface animation
      sunRef.current.rotation.y += 0.003;
      sunRef.current.rotation.x += 0.001;
      
      // Dynamic fire ring animation
      fireRingRef.current.rotation.z += 0.015;
      const fireScale = 1.05 + Math.sin(time * 4) * 0.03;
      fireRingRef.current.scale.setScalar(fireScale);
      
      // Enhanced scaling with dramatic growth at sunset
      let scale = THREE.MathUtils.lerp(0.8, 1.8, scrollProgress);
      if (isSunsetPoint) {
        scale *= 1.1; // 10% larger during sunset point
      }
      sunRef.current.scale.setScalar(scale);
    }
  });

  const visible = scrollProgress > 0.3;
  if (!visible) return null;

  return (
    <group>
      {/* Main Sun Body */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <primitive object={sunMaterial} />
      </mesh>
      
      {/* Subtle Fiery Edge Ring */}
      <mesh ref={fireRingRef}>
        <torusGeometry args={[1.02, 0.05, 16, 64]} />
        <primitive object={fireRingMaterial} />
      </mesh>
    </group>
  );
};