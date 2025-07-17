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
  });

  const handlePointerEnter = () => onHover(true);
  const handlePointerLeave = () => onHover(false);

  return (
    <group position={position}>
      {/* Subtle Aura for Selected Satellite */}
      {isActive && (
        <mesh>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial 
            transparent 
            opacity={0.15}
            color="#22c55e" // Green from the CRD gradient
          />
        </mesh>
      )}
      
      {/* Outer glow ring for selected satellite */}
      {isActive && (
        <mesh>
          <ringGeometry args={[0.35, 0.45, 16]} />
          <meshBasicMaterial 
            transparent 
            opacity={0.2}
            color="#06b6d4" // Blue-green from the CRD gradient
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Main Satellite with Actual Material */}
      <mesh 
        ref={meshRef}
        onClick={onClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        scale={isActive ? 1.8 : isHovered ? 1.15 : 1}
      >
        {style.category === 'premium' ? (
          <boxGeometry args={[0.2, 0.2, 0.2]} />
        ) : (
          <sphereGeometry args={[0.15, 16, 16]} />
        )}
        
        {/* Show the actual material instead of gray shell */}
        <MaterialSystem 
          mode={style.id as any} 
          intensity={isActive ? 1.5 : isHovered ? 1.2 : 1}
          type="card"
        />
      </mesh>

      {/* Connection beam to card (when active) */}
      {isActive && (
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.002, 0.002, position.length() * 0.8, 8]} />
          <meshBasicMaterial 
            color="#22c55e" 
            transparent 
            opacity={0.4}
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