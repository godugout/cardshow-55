import React, { useCallback, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MaterialSatellite } from './MaterialSatellite';
import { ParticleFlowRing } from './ParticleFlowRing';
import { CRDVisualStyles, type CRDVisualStyle } from '../styles/StyleRegistry';
import { useRingRotation } from '../hooks/useRingRotation';
import { useDragControl } from '../hooks/useDragControl';
import { calculateSatellitePositions, findClosestSatellite } from '../utils/rotationUtils';

interface OrbitalRingProps {
  radius?: number;
  cardRotation: THREE.Euler;
  onStyleChange: (style: CRDVisualStyle) => void;
  selectedStyleId: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
  showRing?: boolean;
  showLockIndicators?: boolean;
  isPaused?: boolean;
}

export const OrbitalRing: React.FC<OrbitalRingProps> = ({
  radius = 4,
  cardRotation,
  onStyleChange,
  selectedStyleId,
  autoRotate = true,
  rotationSpeed = 1,
  showRing = true,
  showLockIndicators = true,
  isPaused = false
}) => {
  const [hoveredSatellite, setHoveredSatellite] = React.useState<string | null>(null);
  const ringRef = useRef<THREE.Group>(null);
  const { gl } = useThree();
  const lastInteractionTime = useRef(0);

  // Setup rotation and drag controls
  const {
    currentRotation,
    setCurrentRotation,
    rotationVelocity,
    setRotationVelocity,
    isMouseOverRing,
    setIsMouseOverRing,
    updateRotation,
    applyRotation
  } = useRingRotation({ autoRotate, rotationSpeed, isPaused });

  const {
    isDragging,
    handleDragStart,
    handleDragMove,
    handleDragEnd
  } = useDragControl(setCurrentRotation);

  // Calculate satellite positions
  const satellitePositions = React.useMemo(() => 
    calculateSatellitePositions(CRDVisualStyles, radius),
    [radius]
  );

  // Animation frame updates
  useFrame((_, delta) => {
    if (!ringRef.current) return;

    const newRotation = updateRotation(delta, isDragging);
    setCurrentRotation(newRotation);
    applyRotation(ringRef.current, newRotation);

    // Clear momentum when it gets very small
    if (Math.abs(rotationVelocity) <= 0.001) {
      setRotationVelocity(0);
    }
  });

  // Event handlers
  const handlePointerDown = useCallback((event: any) => {
    handleDragStart(event, currentRotation);
    gl.domElement.style.cursor = 'grabbing';
  }, [currentRotation, gl.domElement, handleDragStart]);

  const handlePointerMove = useCallback((event: any) => {
    const newRotation = handleDragMove(event);
    if (newRotation !== null) {
      setCurrentRotation(newRotation);
    }
  }, [handleDragMove]);

  const handlePointerUp = useCallback(() => {
    const momentum = handleDragEnd();
    setRotationVelocity(momentum);
    gl.domElement.style.cursor = 'auto';
    lastInteractionTime.current = Date.now();
  }, [gl.domElement, handleDragEnd]);

  const handlePointerEnter = useCallback(() => {
    setIsMouseOverRing(true);
    lastInteractionTime.current = Date.now();
  }, []);

  const handlePointerLeave = useCallback(() => {
    // Use a shorter delay and more predictable behavior
    const checkDelay = setTimeout(() => {
      if (!isDragging) {
        setIsMouseOverRing(false);
      }
    }, 100);
    
    return () => clearTimeout(checkDelay);
  }, [isDragging, setIsMouseOverRing]);

  // Satellite interaction handlers
  const handleSatelliteClick = useCallback((style: CRDVisualStyle) => {
    onStyleChange(style);
  }, [onStyleChange]);

  const handleSatelliteHover = useCallback((styleId: string, hovered: boolean) => {
    setHoveredSatellite(hovered ? styleId : null);
  }, []);

  return (
    <group 
      ref={ringRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {showRing && (
        <ParticleFlowRing
          radius={radius}
          selectedStyleId={selectedStyleId}
          hoveredSatellite={hoveredSatellite}
          satellitePositions={satellitePositions}
          isPaused={isPaused}
        />
      )}

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