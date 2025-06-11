
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Group } from 'three';
import { SimpleCard3D } from './SimpleCard3D';
import type { SpaceControls } from './types';

interface Simple3DCard {
  id: string;
  title: string;
  image_url?: string;
  rarity?: string;
  tags?: string[];
}

interface Card3DProps {
  card: Simple3DCard;
  controls: SpaceControls;
  onClick?: () => void;
}

export const Card3D: React.FC<Card3DProps> = ({ 
  card, 
  controls, 
  onClick 
}) => {
  const groupRef = useRef<Group>(null);
  
  // Simple state for 3D card interaction
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      // Floating animation
      const floatY = Math.sin(state.clock.elapsedTime * 0.5) * controls.floatIntensity * 0.1;
      groupRef.current.position.y = floatY;

      // Auto rotation
      if (controls.autoRotate) {
        groupRef.current.rotation.y += 0.005 * controls.orbitSpeed;
      }

      // Gravity effect simulation
      if (controls.gravityEffect > 0) {
        const gravity = Math.sin(state.clock.elapsedTime * 0.3) * controls.gravityEffect * 0.05;
        groupRef.current.position.y += gravity;
      }

      // Gentle hover animation
      if (isHovering) {
        groupRef.current.position.y += 0.1;
      }
    }
  });

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
    onClick?.();
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return (
    <group ref={groupRef}>
      {/* Invisible interaction plane */}
      <mesh 
        castShadow 
        receiveShadow
        onClick={handleCardClick}
        onPointerEnter={handleMouseEnter}
        onPointerLeave={handleMouseLeave}
      >
        <planeGeometry args={[2.5, 3.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* HTML overlay for the simplified card */}
      <Html
        transform
        occlude
        position={[0, 0, 0.01]}
        distanceFactor={1}
        style={{
          width: '240px',
          height: '336px',
          pointerEvents: 'none'
        }}
      >
        <div style={{ 
          width: '240px', 
          height: '336px', 
          transform: 'scale(1)',
          filter: isHovering ? 'brightness(1.1)' : 'brightness(1)',
          transition: 'filter 0.3s ease'
        }}>
          <SimpleCard3D
            card={card}
            isFlipped={isFlipped}
            onFlip={handleCardClick}
          />
        </div>
      </Html>
    </group>
  );
};
