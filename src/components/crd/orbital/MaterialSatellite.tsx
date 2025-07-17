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
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current || !glowRef.current) return;

    const time = state.clock.elapsedTime;
    
    // Gentle floating animation
    const float = Math.sin(time * 2 + position.x) * 0.02;
    meshRef.current.position.y = position.y + float;
    
    // Active satellite glow pulse
    if (isActive) {
      const pulse = 1 + Math.sin(time * 4) * 0.3;
      glowRef.current.scale.setScalar(pulse);
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.6 + Math.sin(time * 3) * 0.2;
    } else if (isHovered) {
      glowRef.current.scale.setScalar(1.2);
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.4;
    } else {
      glowRef.current.scale.setScalar(0.8);
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.1;
    }
  });

  const handlePointerEnter = () => onHover(true);
  const handlePointerLeave = () => onHover(false);

  return (
    <group position={position}>
      {/* Glow Effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial 
          color={isActive ? "#00ffff" : "#ffffff"}
          transparent 
          opacity={isActive ? 0.6 : 0.1}
        />
      </mesh>

      {/* Main Satellite */}
      <mesh 
        ref={meshRef}
        onClick={onClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        scale={isActive ? 1.2 : isHovered ? 1.1 : 1}
      >
        {style.category === 'premium' ? (
          <boxGeometry args={[0.2, 0.2, 0.2]} />
        ) : (
          <sphereGeometry args={[0.15, 16, 16]} />
        )}
        <MaterialSystem 
          mode={style.id as any} 
          intensity={1}
          type="card"
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