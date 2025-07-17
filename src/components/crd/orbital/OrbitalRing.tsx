import React, { useState, useCallback, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MaterialSatellite } from './MaterialSatellite';
import { CRDVisualStyles, type CRDVisualStyle } from '../styles/StyleRegistry';

interface OrbitalRingProps {
  radius?: number;
  cardRotation: THREE.Euler;
  onStyleChange: (style: CRDVisualStyle) => void;
  selectedStyleId: string;
}

export const OrbitalRing: React.FC<OrbitalRingProps> = ({
  radius = 4,
  cardRotation,
  onStyleChange,
  selectedStyleId
}) => {
  const [hoveredSatellite, setHoveredSatellite] = useState<string | null>(null);
  const ringRef = useRef<THREE.Group>(null);

  // Calculate satellite positions around the equator - SHOW ALL STYLES
  const satellitePositions = React.useMemo(() => {
    const positions: { style: CRDVisualStyle; position: THREE.Vector3; angle: number }[] = [];
    const allStyles = CRDVisualStyles; // Show ALL styles, not just unlocked ones
    const angleStep = (Math.PI * 2) / allStyles.length;

    allStyles.forEach((style, index) => {
      const angle = index * angleStep;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      positions.push({
        style,
        position: new THREE.Vector3(x, 0, z),
        angle
      });
    });

    return positions;
  }, [radius]);

  // Detect which satellite the card is pointing at
  const getPointingAtSatellite = useCallback(() => {
    if (!cardRotation) return null;

    // Calculate card's forward direction from rotation
    const cardDirection = new THREE.Vector3(0, 0, -1);
    const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(cardRotation);
    cardDirection.applyMatrix4(rotationMatrix);

    // Project to XZ plane (equatorial plane)
    cardDirection.y = 0;
    cardDirection.normalize();

    // Find the satellite closest to the card's direction
    let closestSatellite = null;
    let minAngle = Math.PI;

    satellitePositions.forEach(({ style, position, angle }) => {
      const satelliteDirection = position.clone().normalize();
      const angleDiff = Math.abs(cardDirection.angleTo(satelliteDirection));
      
      if (angleDiff < minAngle) {
        minAngle = angleDiff;
        closestSatellite = style;
      }
    });

    // Only consider it "pointing at" if within 30 degrees
    return minAngle < Math.PI / 6 ? closestSatellite : null;
  }, [cardRotation, satellitePositions]);

  // Update active style based on card direction
  useFrame(() => {
    const pointingAtStyle = getPointingAtSatellite();
    if (pointingAtStyle && pointingAtStyle.id !== selectedStyleId) {
      onStyleChange(pointingAtStyle);
    }
  });

  const handleSatelliteClick = (style: CRDVisualStyle) => {
    console.log('🎯 Satellite clicked:', style.displayName, 'ID:', style.id);
    // Allow selection of any style for demo purposes
    onStyleChange(style);
  };

  const handleSatelliteHover = (styleId: string, hovered: boolean) => {
    setHoveredSatellite(hovered ? styleId : null);
  };

  return (
    <group ref={ringRef}>
      {/* Orbital ring guide (subtle) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.1, radius + 0.1, 32]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Material Satellites */}
      {satellitePositions.map(({ style, position }) => (
        <MaterialSatellite
          key={style.id}
          position={position}
          style={style}
          isActive={style.id === selectedStyleId}
          isHovered={hoveredSatellite === style.id}
          onClick={() => handleSatelliteClick(style)}
          onHover={(hovered) => handleSatelliteHover(style.id, hovered)}
        />
      ))}
    </group>
  );
};