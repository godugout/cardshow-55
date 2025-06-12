
export interface PhysicsState {
  velocity: { x: number; y: number };
  angularVelocity: { x: number; y: number };
  rotationalInertia: number;
  lastPosition: { x: number; y: number };
  gripPoint: { x: number; y: number } | null;
  isGripping: boolean;
  momentum: { x: number; y: number };
  dragDistance: number;
  dragStartTime: number;
}

export interface PhysicsHookProps {
  allowRotation: boolean;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  setRotation: (rotation: { x: number; y: number }) => void;
  setAutoRotate: (rotate: boolean) => void;
  rotation: { x: number; y: number };
  onGripPointChange?: (point: { x: number; y: number } | null) => void;
  effectIntensity?: number;
}
