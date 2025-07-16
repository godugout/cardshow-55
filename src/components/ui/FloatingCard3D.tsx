import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

const Card3D: React.FC = () => {
  const cardRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (cardRef.current) {
      // Gentle floating animation
      cardRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
      // Subtle rotation
      cardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={cardRef}>
      {/* Card Base */}
      <RoundedBox
        args={[2.5, 3.5, 0.1]} // 2.5x3.5 aspect ratio
        radius={0.1}
        smoothness={4}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial 
          color="#1a1a2e"
          metalness={0.3}
          roughness={0.4}
        />
      </RoundedBox>
      
      {/* Card Front Design */}
      <RoundedBox
        args={[2.3, 3.3, 0.02]}
        radius={0.08}
        smoothness={4}
        position={[0, 0, 0.06]}
      >
        <meshStandardMaterial 
          color="#16325c"
          metalness={0.8}
          roughness={0.2}
        />
      </RoundedBox>
      
      {/* Holographic overlay */}
      <RoundedBox
        args={[2.1, 3.1, 0.01]}
        radius={0.06}
        smoothness={4}
        position={[0, 0, 0.08]}
      >
        <meshStandardMaterial 
          color="#00C851"
          metalness={1}
          roughness={0}
          transparent
          opacity={0.3}
        />
      </RoundedBox>
      
      {/* Card Text */}
      <Text
        position={[0, 1.2, 0.09]}
        fontSize={0.2}
        color="#00C851"
        anchorX="center"
        anchorY="middle"
      >
        CRD
      </Text>
      
      <Text
        position={[0, 0.8, 0.09]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        COLLECTIBLE
      </Text>
      
      {/* Center artwork placeholder */}
      <RoundedBox
        args={[1.8, 1.5, 0.01]}
        radius={0.05}
        smoothness={4}
        position={[0, -0.2, 0.09]}
      >
        <meshStandardMaterial 
          color="#2a4d3a"
          metalness={0.6}
          roughness={0.3}
        />
      </RoundedBox>
      
      {/* Bottom text area */}
      <RoundedBox
        args={[2.0, 0.8, 0.01]}
        radius={0.05}
        smoothness={4}
        position={[0, -1.3, 0.09]}
      >
        <meshStandardMaterial 
          color="#1a1a2e"
          metalness={0.4}
          roughness={0.6}
        />
      </RoundedBox>
      
      <Text
        position={[0, -1.3, 0.1]}
        fontSize={0.08}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
      >
        Digital Trading Card
      </Text>
    </group>
  );
};

export const FloatingCard3D: React.FC = () => {
  return (
    <div className="w-80 h-96 mx-auto">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
        />
        <pointLight
          position={[-10, -10, -5]}
          intensity={0.5}
          color="#00C851"
        />
        <Card3D />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};