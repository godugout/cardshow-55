
export const easeOutBounce = (t: number, bounceCount: number, bounceDecay: number, physicsEnabled: boolean) => {
  if (!physicsEnabled || bounceCount === 0) {
    // Simple smooth transition
    return t * t * (3 - 2 * t); // Smoothstep
  }

  if (t < 0.8) {
    // Main flip motion with smooth deceleration
    return t * t * (3 - 2 * t); // Smoothstep
  } else {
    // Subtle bounce phase
    const bouncePhase = (t - 0.8) / 0.2;
    let bounce = 0;
    
    for (let i = 0; i < bounceCount; i++) {
      const bounceStart = i / bounceCount;
      const bounceEnd = (i + 1) / bounceCount;
      
      if (bouncePhase >= bounceStart && bouncePhase <= bounceEnd) {
        const localPhase = (bouncePhase - bounceStart) / (bounceEnd - bounceStart);
        const amplitude = Math.pow(bounceDecay, i);
        bounce = amplitude * Math.sin(localPhase * Math.PI * 2);
      }
    }
    
    return 1 + bounce * 0.02; // Very small oscillation
  }
};
