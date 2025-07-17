import React, { useState, useCallback, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MaterialSatellite } from './MaterialSatellite';
import { ParticleFlowRing } from './ParticleFlowRing';
import { CRDVisualStyles, type CRDVisualStyle } from '../styles/StyleRegistry';

interface OrbitalRingProps {
  radius?: number;
  cardRotation: THREE.Euler;
  onStyleChange: (style: CRDVisualStyle) => void;
  selectedStyleId: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
  showRing?: boolean;
  showLockIndicators?: boolean;
}

export const OrbitalRing: React.FC<OrbitalRingProps> = ({
  radius = 4,
  cardRotation,
  onStyleChange,
  selectedStyleId,
  autoRotate = true,
  rotationSpeed = 1,
  showRing = true,
  showLockIndicators = true
}) => {
  const [hoveredSatellite, setHoveredSatellite] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartRotation, setDragStartRotation] = useState(0);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [lastMouseX, setLastMouseX] = useState(0);
  
  const ringRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();

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

  // Auto-rotation and drag handling
  useFrame((state) => {
    if (!ringRef.current) return;

    if (autoRotate && !isDragging) {
      // Moon orbital period ≈ 27.3 days, scale to reasonable speed
      const moonSpeed = (Math.PI * 2) / (27.3 * 24 * 3600); // rad/sec
      const scaledSpeed = moonSpeed * rotationSpeed * 10000; // Scale for visibility
      
      setCurrentRotation(prev => prev + scaledSpeed * state.clock.getDelta());
    }

    ringRef.current.rotation.y = currentRotation;
  });

  // Mouse drag handlers
  const handlePointerDown = useCallback((event: any) => {
    if (!ringRef.current) return;
    
    setIsDragging(true);
    setDragStartRotation(currentRotation);
    setLastMouseX(event.nativeEvent?.clientX || event.clientX || 0);
    
    gl.domElement.style.cursor = 'grabbing';
  }, [currentRotation, gl.domElement]);

  const handlePointerMove = useCallback((event: any) => {
    if (!isDragging) return;
    
    const deltaX = (event.nativeEvent?.clientX || event.clientX || 0) - lastMouseX;
    const rotationDelta = deltaX * 0.01; // Sensitivity
    
    setCurrentRotation(dragStartRotation + rotationDelta);
    setLastMouseX(event.nativeEvent?.clientX || event.clientX || 0);
  }, [isDragging, lastMouseX, dragStartRotation]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    gl.domElement.style.cursor = 'grab';
  }, [gl.domElement]);

  // Add global mouse listeners
  React.useEffect(() => {
    const handleGlobalMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - lastMouseX;
        const rotationDelta = deltaX * 0.01;
        setCurrentRotation(dragStartRotation + rotationDelta);
        setLastMouseX(e.clientX);
      }
    };

    const handleGlobalUp = () => {
      if (isDragging) {
        setIsDragging(false);
        gl.domElement.style.cursor = 'auto';
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMove);
      window.addEventListener('mouseup', handleGlobalUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('mouseup', handleGlobalUp);
    };
  }, [isDragging, lastMouseX, dragStartRotation, gl.domElement]);

  const handleSatelliteClick = (style: CRDVisualStyle) => {
    console.log('🎯 Satellite clicked:', style.displayName, 'ID:', style.id);
    // Allow selection of any style for demo purposes
    onStyleChange(style);
  };

  const handleSatelliteHover = (styleId: string, hovered: boolean) => {
    setHoveredSatellite(hovered ? styleId : null);
  };

  return (
    <group 
      ref={ringRef}
      onPointerDown={handlePointerDown}
    >
      {/* Particle Flow Ring (conditional) */}
      {showRing && (
        <ParticleFlowRing
          radius={radius}
          selectedStyleId={selectedStyleId}
          hoveredSatellite={hoveredSatellite}
          satellitePositions={satellitePositions}
        />
      )}

      {/* Material Satellites */}
      {satellitePositions.map(({ style, position }) => (
        <MaterialSatellite
          key={style.id}
          position={position}
          style={{
            ...style,
            locked: showLockIndicators ? style.locked : false
          }}
          isActive={style.id === selectedStyleId}
          isHovered={hoveredSatellite === style.id}
          onClick={() => handleSatelliteClick(style)}
          onHover={(hovered) => handleSatelliteHover(style.id, hovered)}
        />
      ))}
    </group>
  );
};