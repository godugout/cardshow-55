import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MaterialSystem } from '../materials/MaterialSystem';
import { type CRDVisualStyle } from '../styles/StyleRegistry';

interface MaterialSatelliteProps {
  position: THREE.Vector3;
  style: CRDVisualStyle;
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

export const MaterialSatellite: React.FC<MaterialSatelliteProps> = ({
  position,
  style,
  isActive,
  isHovered,
  onClick,
  onHover
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    
    // Gentle floating animation
    const float = Math.sin(time * 2 + position.x) * 0.02;
    meshRef.current.position.y = position.y + float;
    
    // Internal glow effect through material emissive
    if (meshRef.current.material) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      
      if (isActive) {
        // Strong pulsing glow for active satellite
        const pulse = 0.8 + Math.sin(time * 4) * 0.4;
        material.emissiveIntensity = pulse;
        material.emissive.setHex(0x00ffff); // Cyan glow
      } else if (isHovered) {
        // Medium glow for hovered satellite
        material.emissiveIntensity = 0.6;
        material.emissive.setHex(0xffffff); // White glow
      } else {
        // Subtle base glow
        material.emissiveIntensity = 0.2;
        material.emissive.setHex(0x444444); // Dim glow
      }
    }
  });

  const handlePointerEnter = () => onHover(true);
  const handlePointerLeave = () => onHover(false);

  return (
    <group position={position}>
      {/* Main Satellite with Internal Glow */}
      <mesh 
        ref={meshRef}
        onClick={onClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        scale={isActive ? 1.3 : isHovered ? 1.15 : 1}
      >
        {style.category === 'premium' ? (
          <boxGeometry args={[0.2, 0.2, 0.2]} />
        ) : (
          <sphereGeometry args={[0.15, 16, 16]} />
        )}
        
        {/* Satellite uses its own material with emissive glow */}
        <meshStandardMaterial
          color={isActive ? "#ffffff" : "#cccccc"}
          metalness={0.7}
          roughness={0.2}
          emissive="#444444"
          emissiveIntensity={0.2}
          envMapIntensity={2}
        />
      </mesh>

      {/* Connection beam to card (when active) */}
      {isActive && (
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.002, 0.002, position.length() * 0.8, 8]} />
          <meshBasicMaterial 
            color="#00ffff" 
            transparent 
            opacity={0.3}
          />
        </mesh>
      )}

      {/* Lock indicator for locked styles */}
      {style.locked && (
        <mesh position={[0, 0.25, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#ff6b6b" />
        </mesh>
      )}
    </group>
  );
};