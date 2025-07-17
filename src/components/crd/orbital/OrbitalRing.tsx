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
  const [currentRotation, setCurrentRotation] = useState(0);
  const [userDirection, setUserDirection] = useState<'clockwise' | 'counterclockwise' | null>(null);
  const [rotationVelocity, setRotationVelocity] = useState(0);
  const [lastFrameRotation, setLastFrameRotation] = useState(0);
  
  // Drag tracking
  const dragState = useRef({
    startX: 0,
    startRotation: 0,
    lastX: 0,
    lastTime: 0,
    velocityHistory: [] as number[]
  });
  
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

  // Enhanced rotation system with momentum
  useFrame((state, delta) => {
    if (!ringRef.current) return;

    if (!isDragging) {
      if (userDirection && Math.abs(rotationVelocity) > 0.001) {
        // Continue rotation in user's preferred direction with momentum
        const dampingFactor = 0.98; // Gradual slowdown
        const newVelocity = rotationVelocity * dampingFactor;
        setRotationVelocity(newVelocity);
        setCurrentRotation(prev => prev + newVelocity * delta);
      } else if (autoRotate && !userDirection) {
        // Default auto-rotation only when user hasn't set a direction
        const baseSpeed = rotationSpeed * 0.5 * delta;
        setCurrentRotation(prev => prev + baseSpeed);
      } else if (Math.abs(rotationVelocity) <= 0.001) {
        // Reset to gentle auto-rotation after momentum stops
        setRotationVelocity(0);
        if (autoRotate) {
          const gentleSpeed = rotationSpeed * 0.2 * delta;
          setCurrentRotation(prev => prev + gentleSpeed);
        }
      }
    }

    // Apply rotation smoothly
    const targetRotation = currentRotation;
    const currentRingRotation = ringRef.current.rotation.y;
    const rotationDiff = targetRotation - currentRingRotation;
    
    // Smooth interpolation for better performance
    ringRef.current.rotation.y += rotationDiff * 0.1;
    
    setLastFrameRotation(ringRef.current.rotation.y);
  });

  // Enhanced drag handlers with momentum tracking
  const handlePointerDown = useCallback((event: any) => {
    if (!ringRef.current) return;
    
    const clientX = event.nativeEvent?.clientX || event.clientX || 0;
    
    setIsDragging(true);
    setRotationVelocity(0); // Stop current momentum
    
    // Initialize drag state
    dragState.current = {
      startX: clientX,
      startRotation: currentRotation,
      lastX: clientX,
      lastTime: Date.now(),
      velocityHistory: []
    };
    
    gl.domElement.style.cursor = 'grabbing';
  }, [currentRotation, gl.domElement]);

  const handlePointerMove = useCallback((event: any) => {
    if (!isDragging) return;
    
    const clientX = event.nativeEvent?.clientX || event.clientX || 0;
    const currentTime = Date.now();
    const deltaX = clientX - dragState.current.lastX;
    const deltaTime = currentTime - dragState.current.lastTime;
    
    // Improved sensitivity for smoother interaction
    const sensitivity = 0.005;
    const rotationDelta = deltaX * sensitivity;
    
    // Calculate instantaneous velocity
    const instantVelocity = deltaTime > 0 ? rotationDelta / (deltaTime / 1000) : 0;
    
    // Track velocity history for momentum calculation
    dragState.current.velocityHistory.push(instantVelocity);
    if (dragState.current.velocityHistory.length > 5) {
      dragState.current.velocityHistory.shift();
    }
    
    // Update rotation
    setCurrentRotation(dragState.current.startRotation + (clientX - dragState.current.startX) * sensitivity);
    
    // Determine and set user direction based on drag
    if (Math.abs(deltaX) > 2) {
      const newDirection = deltaX > 0 ? 'clockwise' : 'counterclockwise';
      setUserDirection(newDirection);
    }
    
    dragState.current.lastX = clientX;
    dragState.current.lastTime = currentTime;
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Calculate momentum from velocity history
    const validVelocities = dragState.current.velocityHistory.filter(v => !isNaN(v) && isFinite(v));
    if (validVelocities.length > 0) {
      const avgVelocity = validVelocities.reduce((sum, v) => sum + v, 0) / validVelocities.length;
      const momentum = Math.max(-2, Math.min(2, avgVelocity * 0.3)); // Clamp momentum
      setRotationVelocity(momentum);
    }
    
    gl.domElement.style.cursor = 'auto';
  }, [isDragging, gl.domElement]);

  // Enhanced global mouse listeners
  React.useEffect(() => {
    const handleGlobalMove = (e: MouseEvent) => {
      if (isDragging) {
        const currentTime = Date.now();
        const deltaX = e.clientX - dragState.current.lastX;
        const deltaTime = currentTime - dragState.current.lastTime;
        
        const sensitivity = 0.005;
        const rotationDelta = deltaX * sensitivity;
        const instantVelocity = deltaTime > 0 ? rotationDelta / (deltaTime / 1000) : 0;
        
        // Update velocity history
        dragState.current.velocityHistory.push(instantVelocity);
        if (dragState.current.velocityHistory.length > 5) {
          dragState.current.velocityHistory.shift();
        }
        
        // Update rotation
        setCurrentRotation(dragState.current.startRotation + (e.clientX - dragState.current.startX) * sensitivity);
        
        // Set direction based on movement
        if (Math.abs(deltaX) > 1) {
          const newDirection = deltaX > 0 ? 'clockwise' : 'counterclockwise';
          setUserDirection(newDirection);
        }
        
        dragState.current.lastX = e.clientX;
        dragState.current.lastTime = currentTime;
      }
    };

    const handleGlobalUp = () => {
      if (isDragging) {
        // Calculate final momentum
        const validVelocities = dragState.current.velocityHistory.filter(v => !isNaN(v) && isFinite(v));
        if (validVelocities.length > 0) {
          const avgVelocity = validVelocities.reduce((sum, v) => sum + v, 0) / validVelocities.length;
          const momentum = Math.max(-2, Math.min(2, avgVelocity * 0.3));
          setRotationVelocity(momentum);
        }
        
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
  }, [isDragging, gl.domElement]);

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