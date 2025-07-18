import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CosmicMoonProps {
  scrollProgress: number;
  isSunsetPoint: boolean;
}

export const CosmicMoon: React.FC<CosmicMoonProps> = ({ 
  scrollProgress, 
  isSunsetPoint 
}) => {
  const moonRef = useRef<THREE.Group>(null);
  const crescentRef = useRef<THREE.Mesh>(null);

  // Crescent moon material - silvery with glow
  const moonMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#E6E6FA',
      emissive: '#4169E1',
      emissiveIntensity: 0.3,
      roughness: 0.8,
      metalness: 0.1,
    });
  }, []);

  useFrame((state) => {
    if (moonRef.current && crescentRef.current) {
      const time = state.clock.elapsedTime;
      
      // Moon appears and descends during sunset point
      if (isSunsetPoint) {
        // Calculate moon descent position
        const sunsetProgress = Math.min(1, (scrollProgress - 0.65) / 0.2); // 0.65-0.85 range
        const moonY = THREE.MathUtils.lerp(8, 1.5, sunsetProgress); // From top to below "No glue needed"
        const moonX = THREE.MathUtils.lerp(-2, -1.5, sunsetProgress); // Slight horizontal drift
        
        moonRef.current.position.set(moonX, moonY, -8);
        moonRef.current.visible = true;
        
        // Subtle rotation for realism
        crescentRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;
        
        // Gentle glow pulsing
        const glowPulse = Math.sin(time * 2) * 0.1 + 0.3;
        moonMaterial.emissiveIntensity = glowPulse;
      } else {
        moonRef.current.visible = false;
      }
    }
  });

  return (
    <group ref={moonRef} visible={false}>
      {/* Crescent Moon Shape */}
      <mesh ref={crescentRef} rotation={[0, 0, Math.PI / 4]}>
        {/* Create crescent by subtracting a smaller sphere */}
        <group>
          {/* Main moon sphere */}
          <mesh>
            <sphereGeometry args={[0.4, 32, 32]} />
            <primitive object={moonMaterial} />
          </mesh>
          {/* Darker sphere to create crescent effect */}
          <mesh position={[0.25, 0, 0]}>
            <sphereGeometry args={[0.35, 32, 32]} />
            <meshBasicMaterial color="#0a0a2e" transparent opacity={1} />
          </mesh>
        </group>
      </mesh>
      
      {/* Subtle moon glow ring */}
      <mesh>
        <ringGeometry args={[0.45, 0.55, 32]} />
        <meshBasicMaterial 
          color="#4169E1" 
          transparent 
          opacity={0.2} 
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};