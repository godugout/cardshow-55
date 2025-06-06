
// Enhanced wave calculation utilities for natural motion effects

export interface WaveData {
  time: number;
  frequency: number;
  amplitude: number;
  phase: number;
}

export interface NoiseData {
  time: number;
  scale: number;
  persistence: number;
  octaves: number;
}

// Simple noise function to replace predictable sine/cosine patterns
const simpleNoise = (x: number, y: number = 0): number => {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return (n - Math.floor(n)) * 2 - 1; // Return value between -1 and 1
};

// Multi-octave noise for more complex patterns - NOW EXPORTED
export const multiOctaveNoise = (x: number, y: number, octaves: number, persistence: number): number => {
  let total = 0;
  let frequency = 1;
  let amplitude = 1;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    total += simpleNoise(x * frequency, y * frequency) * amplitude;
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= 2;
  }

  return total / maxValue;
};

// Enhanced wave position with noise-based variation
export const calculateWavePosition = (
  basePosition: number,
  waveData: WaveData,
  multiplier: number = 1,
  noiseScale: number = 0.3
): number => {
  const { time, frequency, amplitude, phase } = waveData;
  
  // Primary wave with slight noise variation
  const primaryWave = Math.sin(time * frequency + phase);
  
  // Add noise-based variation to break up predictable patterns
  const noiseVariation = multiOctaveNoise(
    time * 0.1 + basePosition, 
    phase * 0.05, 
    3, 
    0.6
  ) * noiseScale;
  
  // Combine with temporal variance
  const temporalVariance = Math.sin(time * frequency * 0.3 + phase * 1.7) * 0.2;
  
  return basePosition + (primaryWave + noiseVariation + temporalVariance) * amplitude * multiplier;
};

// Enhanced interference pattern with multiple wave layers
export const calculateInterferencePattern = (
  wave1: WaveData,
  wave2: WaveData,
  position: { x: number; y: number }
): number => {
  // Multiple wave layers with different characteristics
  const wave1Primary = Math.sin(wave1.time * wave1.frequency + position.x * Math.PI);
  const wave1Secondary = Math.cos(wave1.time * wave1.frequency * 0.7 + position.y * Math.PI * 0.8);
  
  const wave2Primary = Math.cos(wave2.time * wave2.frequency + position.y * Math.PI);
  const wave2Secondary = Math.sin(wave2.time * wave2.frequency * 1.3 + position.x * Math.PI * 1.2);
  
  // Add noise-based complexity
  const noiseLayer = multiOctaveNoise(
    position.x * 5 + wave1.time * 0.2,
    position.y * 5 + wave2.time * 0.15,
    2,
    0.5
  ) * 0.3;
  
  // Combine all layers
  const combined = (wave1Primary + wave1Secondary + wave2Primary + wave2Secondary) / 4;
  return combined + noiseLayer;
};

// Enhanced gradient creation with smooth, organic transitions
export const createWaveGradient = (
  waveData: WaveData,
  mousePosition: { x: number; y: number },
  colors: string[],
  noiseIntensity: number = 0.2
): string => {
  const baseAngle = waveData.time * 45 + mousePosition.x * 90;
  
  // Add noise-based angle variation for more organic movement
  const angleNoise = multiOctaveNoise(
    waveData.time * 0.1,
    mousePosition.y * 2,
    2,
    0.4
  ) * 30 * noiseIntensity;
  
  const finalAngle = baseAngle + angleNoise;
  
  const positions = colors.map((color, index) => {
    const basePos = (index / (colors.length - 1)) * 100;
    
    // Multi-layer wave offset with different frequencies
    const primaryOffset = Math.sin(waveData.time * waveData.frequency + index) * waveData.amplitude;
    const secondaryOffset = Math.cos(waveData.time * waveData.frequency * 0.6 + index * 1.5) * waveData.amplitude * 0.5;
    
    // Noise-based variation
    const noiseOffset = multiOctaveNoise(
      waveData.time * 0.2 + index,
      mousePosition.x * 3,
      2,
      0.3
    ) * waveData.amplitude * 0.4 * noiseIntensity;
    
    const finalPos = basePos + primaryOffset + secondaryOffset + noiseOffset;
    return `${color} ${Math.max(0, Math.min(100, finalPos))}%`;
  });
  
  return `linear-gradient(${finalAngle}deg, ${positions.join(', ')})`;
};

// Enhanced opacity calculation with smooth, natural variation
export const getWaveInfluencedOpacity = (
  baseOpacity: number,
  waveData: WaveData,
  mousePosition: { x: number; y: number },
  naturalness: number = 0.5
): number => {
  const mouseInfluence = Math.sqrt(
    Math.pow(mousePosition.x - 0.5, 2) + Math.pow(mousePosition.y - 0.5, 2)
  );
  
  // Multi-frequency wave influence for more complex patterns
  const primaryWave = Math.sin(waveData.time * waveData.frequency) * 0.15;
  const secondaryWave = Math.cos(waveData.time * waveData.frequency * 0.8 + Math.PI * 0.3) * 0.1;
  
  // Add noise-based natural variation
  const noiseInfluence = multiOctaveNoise(
    waveData.time * 0.3,
    mousePosition.x * 4 + mousePosition.y * 3,
    2,
    0.6
  ) * 0.12 * naturalness;
  
  const totalInfluence = primaryWave + secondaryWave + noiseInfluence + mouseInfluence * 0.2;
  
  return Math.max(0, Math.min(1, baseOpacity + totalInfluence));
};

// Smooth easing function for temporal transitions
export const smoothEase = (t: number): number => {
  return t * t * (3 - 2 * t); // Smoothstep function
};

// Create phase-randomized wave data for breaking patterns
export const createRandomizedWaveData = (
  baseTime: number,
  baseFrequency: number,
  baseAmplitude: number,
  randomSeed: number = 1
): WaveData => {
  // Use the seed to create consistent but randomized parameters
  const phaseOffset = simpleNoise(randomSeed * 100) * Math.PI * 2;
  const frequencyVariation = 1 + simpleNoise(randomSeed * 200) * 0.3;
  const amplitudeVariation = 1 + simpleNoise(randomSeed * 300) * 0.2;
  
  return {
    time: baseTime,
    frequency: baseFrequency * frequencyVariation,
    amplitude: baseAmplitude * amplitudeVariation,
    phase: phaseOffset
  };
};
