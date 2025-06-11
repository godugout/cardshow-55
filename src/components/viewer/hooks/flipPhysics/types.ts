
export interface FlipPhysicsState {
  isFlipping: boolean;
  progress: number; // 0 to 1
  rotationY: number;
  rotationX: number;
  rotationZ: number;
  scale: number;
  shadowIntensity: number;
  zOffset: number;
  showingFront: boolean; // Track which face should be visible
}

export interface FlipConfig {
  duration: number;
  direction: 1 | -1; // clockwise or counterclockwise
  randomTilt: number;
  bounceCount: number;
  bounceDecay: number;
}
