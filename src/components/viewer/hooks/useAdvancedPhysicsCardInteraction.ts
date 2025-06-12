
import { useRef } from 'react';
import { usePhysicsState } from './physics/usePhysicsState';
import { usePhysicsAnimation } from './physics/usePhysicsAnimation';
import { usePhysicsInteractionHandlers } from './physics/usePhysicsInteractionHandlers';
import type { PhysicsHookProps } from './physics/types';

export const useAdvancedPhysicsCardInteraction = (props: PhysicsHookProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { physicsState, setPhysicsState } = usePhysicsState();
  
  const { animatePhysics } = usePhysicsAnimation({
    isDragging: props.isDragging,
    physicsState,
    setPhysicsState,
    rotation: props.rotation,
    setRotation: props.setRotation
  });

  const {
    handleMouseMove,
    handleDragStart,
    handleDragEnd
  } = usePhysicsInteractionHandlers({
    ...props,
    physicsState,
    setPhysicsState,
    animatePhysics,
    containerRef
  });

  return {
    containerRef,
    physicsState,
    handleMouseMove,
    handleDragStart,
    handleDragEnd
  };
};
