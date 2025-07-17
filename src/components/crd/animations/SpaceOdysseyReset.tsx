import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { StarburstMaterial } from '../shaders/StarburstMaterial';

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
  const skyRef = useRef<THREE.Mesh>(null);
  const animationStartTime = useRef<number>(0);
  const hasStarted = useRef(false);
  
  // Create materials
  const starburstMaterial = useMemo(() => new StarburstMaterial(), []);
  const skyMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      bottomColor: { value: new THREE.Color(0x1a1a2e) },
      topColor: { value: new THREE.Color(0x0a0a1e) },
      sunPosition: { value: new THREE.Vector3(0, 8, -3) }
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 bottomColor;
      uniform vec3 topColor;
      uniform vec3 sunPosition;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition).y;
        vec3 color = mix(bottomColor, topColor, h * 0.5 + 0.5);
        gl_FragColor = vec4(color, 1.0);
      }
    `
  }), []);

  // Animation duration constants
  const TOTAL_DURATION = 6.0;
  const PHASES = {
    INITIAL_MOVEMENT: { start: 0, duration: 1.0 },
    CAMERA_POSITION: { start: 1.0, duration: 1.0 },
    SUN_DESCENT: { start: 2.0, duration: 2.5 },
    STARBURST: { start: 3.0, duration: 1.0 },
    FINAL_SETTLE: { start: 4.5, duration: 1.5 }
  };

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
    const progress = Math.min(elapsed / TOTAL_DURATION, 1);

    // Update shader materials
    starburstMaterial.update(elapsed);
    skyMaterial.uniforms.time.value = elapsed;

    // Phase calculations
    const getPhaseProgress = (phase: { start: number; duration: number }) => {
      const phaseElapsed = elapsed - phase.start;
      return Math.max(0, Math.min(1, phaseElapsed / phase.duration));
    };

    // Initial card movement
    if (elapsed < PHASES.CAMERA_POSITION.start) {
      const p = getPhaseProgress(PHASES.INITIAL_MOVEMENT);
      const eased = 1 - Math.pow(1 - p, 3); // Ease out cubic
      groupRef.current.position.y = Math.sin(p * Math.PI * 2) * 0.2 * (1 - eased);
      groupRef.current.rotation.x = (0.2 - eased * 0.2);
    }

    // Camera positioning
    if (elapsed >= PHASES.CAMERA_POSITION.start && elapsed < PHASES.SUN_DESCENT.start) {
      const p = getPhaseProgress(PHASES.CAMERA_POSITION);
      const eased = 1 - Math.pow(1 - p, 3);
      groupRef.current.position.y = 0;
      groupRef.current.rotation.x = 0.2 * (1 - eased);
      
      // Position sun
      if (sunRef.current) {
        sunRef.current.visible = true;
        sunRef.current.position.set(0, 8, -3);
        starburstMaterial.setIntensity(p);
      }
    }

    // Sun descent
    if (elapsed >= PHASES.SUN_DESCENT.start && elapsed < PHASES.FINAL_SETTLE.start) {
      const p = getPhaseProgress(PHASES.SUN_DESCENT);
      const sunY = 8 - p * 6;
      
      if (sunRef.current) {
        sunRef.current.position.y = sunY;
        
        // Starburst effect when sun aligns with monolith
        const starburstIntensity = Math.pow(Math.sin(Math.PI * p), 2);
        starburstMaterial.setIntensity(1.5 + starburstIntensity * 2);
      }
    }

    // Final settling
    if (elapsed >= PHASES.FINAL_SETTLE.start) {
      const p = getPhaseProgress(PHASES.FINAL_SETTLE);
      
      if (p >= 1 && hasStarted.current) {
        hasStarted.current = false;
        onComplete();
      }
    }
  });

  if (!isAnimating) return null;

  return (
    <group ref={groupRef}>
      {/* Sky background */}
      <mesh ref={skyRef} position={[0, 0, -10]} scale={[20, 20, 1]}>
        <planeGeometry args={[1, 1]} />
        <primitive object={skyMaterial} attach="material" />
      </mesh>

      {/* Sun with starburst effect */}
      <mesh ref={sunRef} position={[0, 8, -3]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <primitive object={starburstMaterial} attach="material" />
        
        {/* Outer glow */}
        <mesh scale={[3, 3, 3]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshBasicMaterial 
            color="#FFD700" 
            transparent
            opacity={0.1}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </mesh>

      {/* Volumetric light rays */}
      <mesh position={[0, 0, -1]} scale={[10, 10, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial 
          color="#FFD700"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};