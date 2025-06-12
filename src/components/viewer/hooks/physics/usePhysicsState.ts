
import { useState } from 'react';
import type { PhysicsState } from './types';

export const usePhysicsState = () => {
  const [physicsState, setPhysicsState] = useState<PhysicsState>({
    velocity: { x: 0, y: 0 },
    angularVelocity: { x: 0, y: 0 },
    rotationalInertia: 1.0,
    lastPosition: { x: 0, y: 0 },
    gripPoint: null,
    isGripping: false,
    momentum: { x: 0, y: 0 },
    dragDistance: 0,
    dragStartTime: 0
  });

  return { physicsState, setPhysicsState };
};
