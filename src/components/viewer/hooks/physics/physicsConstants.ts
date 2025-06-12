
// Physics constants for enhanced card interaction
export const PHYSICS_CONSTANTS = {
  // Enhanced physics constants for better responsiveness AND expanded vertical range
  DAMPING: 0.88, // Reduced for more immediate response
  ANGULAR_DAMPING: 0.90,
  SPRING_STRENGTH: 0.08, // Reduced from 0.15 for less aggressive spring-back
  VELOCITY_MULTIPLIER: 1.8, // Increased from 0.8 for much better sensitivity
  ANGULAR_VELOCITY_MULTIPLIER: 2.2, // Enhanced angular response
  MIN_VELOCITY: 0.008, // Slightly lower threshold
  GRIP_SENSITIVITY: 1.4,
  MAX_ROTATION_X: 75, // Increased from 35 for much more vertical movement
  MAX_ROTATION_Y: 180,
  CLICK_THRESHOLD: 5, // Pixels - movement below this is considered a click
  CLICK_TIME_THRESHOLD: 300, // ms - max time for a click
} as const;
