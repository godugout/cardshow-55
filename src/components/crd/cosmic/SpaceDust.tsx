import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface SpaceDustProps {
  scrollProgress: number;
}

export const SpaceDust: React.FC<SpaceDustProps> = ({ scrollProgress }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const count = 2000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Create a spherical distribution around the scene
      const radius = 30 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, [count]);

  const sizes = useMemo(() => {
    const sizeArray = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      sizeArray[i] = Math.random() * 3 + 0.5;
    }
    return sizeArray;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      // Slow drift animation
      pointsRef.current.rotation.x += 0.0001;
      pointsRef.current.rotation.y += 0.0002;
      
      // Subtle floating movement
      const time = state.clock.elapsedTime;
      pointsRef.current.position.y = Math.sin(time * 0.1) * 0.2;
    }
  });

  // Calculate visibility based on scroll progress
  const opacity = Math.max(0, Math.min(1, (scrollProgress - 0.1) / 0.2));
  const visible = scrollProgress > 0.1;

  if (!visible) return null;

  return (
    <Points ref={pointsRef} positions={positions} sizes={sizes}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.8}
        sizeAttenuation={true}
        opacity={opacity}
        alphaTest={0.001}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};