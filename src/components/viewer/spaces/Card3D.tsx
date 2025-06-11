
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
      // Reset base position to prevent jumping
      let baseY = 0;

      // Floating animation - isolated from other effects
      if (controls.floatIntensity > 0) {
        const floatY = Math.sin(state.clock.elapsedTime * 0.5) * controls.floatIntensity * 0.1;
        baseY += floatY;
      }

      // Gravity effect simulation - isolated from other effects
      if (controls.gravityEffect > 0) {
        const gravity = Math.sin(state.clock.elapsedTime * 0.3) * controls.gravityEffect * 0.05;
        baseY += gravity;
      }

      // REMOVED: Hover jump animation that was causing the issue
      // if (isHovering) {
      //   baseY += 0.1;
      // }

      // Set the final position without stacking effects
      groupRef.current.position.y = baseY;

      // Auto rotation - only if enabled
      if (controls.autoRotate) {
        groupRef.current.rotation.y += 0.005 * controls.orbitSpeed;
      }
    }
  });

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
    onClick?.();
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  // Convert pixel dimensions to Three.js units (240px × 336px card)
  // Using a scale factor of 0.01 (240px = 2.4 units, 336px = 3.36 units)
  const cardWidth = 2.4;
  const cardHeight = 3.36;

  return (
    <group ref={groupRef}>
      {/* Invisible interaction plane - properly sized and positioned */}
      <mesh 
        castShadow 
        receiveShadow
        onClick={handleCardClick}
        onPointerEnter={handleMouseEnter}
        onPointerLeave={handleMouseLeave}
        position={[0, 0, 0]}
      >
        <planeGeometry args={[cardWidth, cardHeight]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* HTML overlay for the simplified card - centered at same position */}
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
          transform: 'translate(-50%, -50%)', // Center the HTML content
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
