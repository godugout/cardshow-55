
// Physics constants for enhanced card interaction with improved sensitivity
export const PHYSICS_CONSTANTS = {
  // Dramatically increased sensitivity for much more responsive movement
  DAMPING: 0.85, // Reduced for more immediate response
  ANGULAR_DAMPING: 0.88,
  SPRING_STRENGTH: 0.06, // Reduced for less aggressive spring-back
  VELOCITY_MULTIPLIER: 3.2, // Dramatically increased from 1.8 for instant response
  ANGULAR_VELOCITY_MULTIPLIER: 3.8, // Much higher angular response
  MIN_VELOCITY: 0.005, // Lower threshold for better responsiveness
  GRIP_SENSITIVITY: 1.8, // Increased grip sensitivity
  MAX_ROTATION_X: 85, // Increased vertical range
  MAX_ROTATION_Y: 180,
  CLICK_THRESHOLD: 5, // Pixels - movement below this is considered a click
  CLICK_TIME_THRESHOLD: 300, // ms - max time for a click
  
  // New touch-specific constants
  TOUCH_SENSITIVITY_MULTIPLIER: 1.4, // Extra sensitivity for touch devices
  SWIPE_VELOCITY_THRESHOLD: 2.0, // Minimum velocity to trigger swipe momentum
  MOMENTUM_DECAY: 0.92, // How quickly swipe momentum decays
  SCROLL_SENSITIVITY: 0.8, // Sensitivity for trackpad scroll gestures
} as const;
