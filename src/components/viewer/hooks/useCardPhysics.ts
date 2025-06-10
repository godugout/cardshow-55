import { useRef, useCallback, useEffect } from 'react';
import * as THREE from 'three';

interface CardPhysicsProps {
  floatIntensity: number;
  autoRotate: boolean;
  gravityEffect: number;
  centerPosition?: THREE.Vector3;
  maxDistance?: number;
  snapBackForce?: number;
  dampingFactor?: number;
}

interface CardPhysicsState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  angularVelocity: THREE.Vector3;
  isReturningToCenter: boolean;
}

export const useCardPhysics = ({
  floatIntensity = 1.0,
  autoRotate = false,
  gravityEffect = 0.0,
  centerPosition = new THREE.Vector3(0, 0, 0),
  maxDistance = 2.0,
  snapBackForce = 0.1,
  dampingFactor = 0.95
}: CardPhysicsProps) => {
  const stateRef = useRef<CardPhysicsState>({
    position: centerPosition.clone(),
    velocity: new THREE.Vector3(),
    angularVelocity: new THREE.Vector3(),
    isReturningToCenter: false
  });

  const lastUpdateTime = useRef(0);
  const isMotionStopped = useRef(false);

  // Stop all motion immediately
  const stopAllMotion = useCallback(() => {
    const state = stateRef.current;
    state.velocity.set(0, 0, 0);
    state.angularVelocity.set(0, 0, 0);
    state.isReturningToCenter = false;
    isMotionStopped.current = true;
    console.log('🛑 All motion stopped');
  }, []);

  // Snap back to center with smooth animation
  const snapToCenter = useCallback(() => {
    const state = stateRef.current;
    state.isReturningToCenter = true;
    isMotionStopped.current = false;
    console.log('🎯 Snapping back to center');
  }, []);

  // Resume normal physics
  const resumeMotion = useCallback(() => {
    isMotionStopped.current = false;
    stateRef.current.isReturningToCenter = false;
    console.log('▶️ Motion resumed');
  }, []);

  // Update physics simulation
  const updatePhysics = useCallback((mesh: THREE.Mesh, time: number) => {
    if (!mesh || isMotionStopped.current) return;

    const state = stateRef.current;
    const deltaTime = time - lastUpdateTime.current;
    lastUpdateTime.current = time;

    // Clamp delta time to prevent large jumps
    const clampedDelta = Math.min(deltaTime * 0.001, 0.016);

    // Calculate distance from center
    const distanceFromCenter = state.position.distanceTo(centerPosition);

    // Spring force toward center (stronger when further away)
    const springForce = new THREE.Vector3()
      .subVectors(centerPosition, state.position)
      .multiplyScalar(snapBackForce * Math.max(1, distanceFromCenter));

    // Snap-back behavior
    if (state.isReturningToCenter) {
      const snapForce = new THREE.Vector3()
        .subVectors(centerPosition, state.position)
        .multiplyScalar(0.3); // Stronger force for snapping

      state.velocity.add(snapForce);
      
      // Stop snapping when close enough
      if (distanceFromCenter < 0.1) {
        state.position.copy(centerPosition);
        state.velocity.set(0, 0, 0);
        state.isReturningToCenter = false;
      }
    } else {
      // Normal floating physics (only if within bounds)
      if (floatIntensity > 0 && distanceFromCenter < maxDistance) {
        const floatForce = new THREE.Vector3(
          Math.sin(time * 0.8) * 0.1 * floatIntensity,
          Math.cos(time * 0.6) * 0.15 * floatIntensity,
          Math.sin(time * 0.4) * 0.05 * floatIntensity
        );
        state.velocity.add(floatForce.multiplyScalar(clampedDelta));
      }

      // Apply spring force to keep card centered
      state.velocity.add(springForce.multiplyScalar(clampedDelta));
    }

    // Apply gravity effect
    if (gravityEffect > 0) {
      state.velocity.y -= gravityEffect * 0.1 * clampedDelta;
    }

    // Boundary enforcement - hard limit
    if (distanceFromCenter > maxDistance) {
      const direction = new THREE.Vector3()
        .subVectors(centerPosition, state.position)
        .normalize();
      state.position.copy(centerPosition).add(direction.multiplyScalar(-maxDistance));
      
      // Reflect velocity if hitting boundary
      const velocityDirection = state.velocity.clone().normalize();
      const reflection = velocityDirection.reflect(direction);
      state.velocity.copy(reflection.multiplyScalar(state.velocity.length() * 0.5));
    }

    // Apply damping
    state.velocity.multiplyScalar(dampingFactor);

    // Update position
    state.position.add(state.velocity.clone().multiplyScalar(clampedDelta));

    // Apply to mesh
    mesh.position.copy(state.position);

    // Handle rotation
    if (autoRotate && !state.isReturningToCenter) {
      mesh.rotation.y += 0.005;
      const wobble = Math.sin(time * 2) * 0.02;
      mesh.rotation.x = wobble;
    } else if (state.isReturningToCenter) {
      // Smoothly return rotation to neutral
      mesh.rotation.x *= 0.9;
      mesh.rotation.z *= 0.9;
    }

    return {
      position: state.position.clone(),
      distanceFromCenter,
      isReturningToCenter: state.isReturningToCenter
    };
  }, [floatIntensity, autoRotate, gravityEffect, centerPosition, maxDistance, snapBackForce, dampingFactor]);

  return {
    updatePhysics,
    stopAllMotion,
    snapToCenter,
    resumeMotion,
    getPosition: () => stateRef.current.position.clone(),
    getDistanceFromCenter: () => stateRef.current.position.distanceTo(centerPosition),
    isReturningToCenter: () => stateRef.current.isReturningToCenter
  };
};
