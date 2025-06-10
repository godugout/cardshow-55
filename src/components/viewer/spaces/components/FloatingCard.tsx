
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCardPhysics } from '../../hooks/useCardPhysics';
import { useInteractiveCardRotation } from '../../hooks/useInteractiveCardRotation';

interface FloatingCardProps {
  card: any;
  floatIntensity?: number;
  autoRotate?: boolean;
  gravityEffect?: number;
  onClick?: () => void;
  environmentControls?: {
    depthOfField: number;
    parallaxIntensity: number;
    fieldOfView: number;
    atmosphericDensity: number;
  };
  onPhysicsRef?: (physics: any) => void;
  onRotationRef?: (rotation: any) => void;
}

export const FloatingCard: React.FC<FloatingCardProps> = ({
  card,
  floatIntensity = 1.0,
  autoRotate = false,
  gravityEffect = 0.0,
  onClick,
  environmentControls = {
    depthOfField: 1.0,
    parallaxIntensity: 1.0,
    fieldOfView: 75,
    atmosphericDensity: 1.0
  },
  onPhysicsRef,
  onRotationRef
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [textureError, setTextureError] = useState(false);
  
  // Card dimensions (standard trading card ratio)
  const cardWidth = 2.5;
  const cardHeight = 3.5;
  const cardDepth = 0.02;

  // Initialize physics system with bounded movement
  const physics = useCardPhysics({
    floatIntensity,
    autoRotate: autoRotate && !useInteractiveCardRotation().isUserControlled(), // Disable auto-rotate when user is controlling
    gravityEffect,
    centerPosition: new THREE.Vector3(0, 0, 0),
    maxDistance: 1.5,
    snapBackForce: 0.15,
    dampingFactor: 0.92
  });

  // Initialize interactive rotation system
  const interactiveRotation = useInteractiveCardRotation({
    sensitivity: 0.005,
    dampingFactor: 0.95,
    momentumDecay: 0.98,
    maxAngularVelocity: 0.15,
    snapToAngles: false
  });

  // Expose physics and rotation controls to parent
  useEffect(() => {
    if (onPhysicsRef) {
      onPhysicsRef(physics);
    }
  }, [physics, onPhysicsRef]);

  useEffect(() => {
    if (onRotationRef) {
      onRotationRef(interactiveRotation);
    }
  }, [interactiveRotation, onRotationRef]);

  console.log('🃏 FloatingCard with interactive rotation:', { 
    floatIntensity, 
    autoRotate, 
    gravityEffect,
    isInteracting: interactiveRotation.isInteracting 
  });

  // Load texture safely in useEffect to prevent re-render loops
  useEffect(() => {
    let isMounted = true;
    const imageUrl = card?.image_url || '/placeholder-card.jpg';
    
    if (!imageUrl) {
      setTextureError(true);
      return;
    }

    const textureLoader = new THREE.TextureLoader();
    
    textureLoader.load(
      imageUrl,
      (loadedTexture) => {
        if (isMounted) {
          console.log('✅ FloatingCard texture loaded successfully');
          setTexture(loadedTexture);
          setTextureError(false);
        }
      },
      undefined,
      (error) => {
        if (isMounted) {
          console.warn('❌ FloatingCard texture failed to load:', error);
          setTextureError(true);
          setTexture(null);
        }
      }
    );

    return () => {
      isMounted = false;
    };
  }, [card?.image_url]);

  // Memoize material to prevent re-creation on every render
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: texture,
      color: textureError ? '#666666' : '#ffffff',
      roughness: 0.3,
      metalness: 0.1,
      transparent: true,
      opacity: 0.9 + (environmentControls.atmosphericDensity * 0.1),
      side: THREE.DoubleSide
    });
  }, [texture, textureError, environmentControls.atmosphericDensity]);

  // Handle pointer events for rotation
  const handlePointerDown = (event: any) => {
    event.stopPropagation();
    interactiveRotation.startRotation(event);
  };

  const handlePointerMove = (event: any) => {
    interactiveRotation.updateRotation(event);
  };

  const handlePointerUp = () => {
    interactiveRotation.endRotation();
  };

  // Handle double-click for flip
  const handleDoubleClick = (event: any) => {
    event.stopPropagation();
    interactiveRotation.handleFlip('y'); // Flip around Y axis
    if (onClick) {
      onClick();
    }
  };

  useFrame((state) => {
    if (meshRef.current) {
      // Update physics with bounded, centered movement (only if not user controlled)
      if (!interactiveRotation.isUserControlled()) {
        const physicsResult = physics.updatePhysics(meshRef.current, state.clock.elapsedTime * 1000);
        
        // Visual feedback for snap-back state
        if (physicsResult?.isReturningToCenter) {
          const material = meshRef.current.material as THREE.MeshStandardMaterial;
          material.emissive.setHex(0x0033aa);
          material.emissiveIntensity = 0.2;
        } else {
          const material = meshRef.current.material as THREE.MeshStandardMaterial;
          material.emissive.setHex(0x000000);
          material.emissiveIntensity = 0;
        }
      }

      // Update interactive rotation
      const rotationState = interactiveRotation.updatePhysics();
      
      // Apply rotation (override physics rotation when user is controlling)
      if (interactiveRotation.isUserControlled() || rotationState.angularVelocity.length() > 0.001) {
        meshRef.current.rotation.copy(rotationState.rotation);
      }
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      castShadow 
      receiveShadow 
      position={[0, 0, 0]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={handleDoubleClick}
    >
      <boxGeometry args={[cardWidth, cardHeight, cardDepth]} />
      <primitive object={material} />
    </mesh>
  );
};
