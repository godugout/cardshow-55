
// Wave calculation utilities for dynamic effects

export interface WaveData {
  time: number;
  frequency: number;
  amplitude: number;
  phase: number;
}

export const calculateWavePosition = (
  basePosition: number,
  waveData: WaveData,
  multiplier: number = 1
): number => {
  const { time, frequency, amplitude, phase } = waveData;
  return basePosition + Math.sin(time * frequency + phase) * amplitude * multiplier;
};

export const calculateInterferencePattern = (
  wave1: WaveData,
  wave2: WaveData,
  position: { x: number; y: number }
): number => {
  const wave1Value = Math.sin(wave1.time * wave1.frequency + position.x * Math.PI);
  const wave2Value = Math.cos(wave2.time * wave2.frequency + position.y * Math.PI);
  return (wave1Value + wave2Value) / 2;
};

export const createWaveGradient = (
  waveData: WaveData,
  mousePosition: { x: number; y: number },
  colors: string[]
): string => {
  const angle = waveData.time * 90 + mousePosition.x * 180;
  const positions = colors.map((color, index) => {
    const basePos = (index / (colors.length - 1)) * 100;
    const waveOffset = Math.sin(waveData.time * waveData.frequency + index) * waveData.amplitude;
    return `${color} ${Math.max(0, Math.min(100, basePos + waveOffset))}%`;
  });
  
  return `linear-gradient(${angle}deg, ${positions.join(', ')})`;
};

export const getWaveInfluencedOpacity = (
  baseOpacity: number,
  waveData: WaveData,
  mousePosition: { x: number; y: number }
): number => {
  const mouseInfluence = Math.sqrt(
    Math.pow(mousePosition.x - 0.5, 2) + Math.pow(mousePosition.y - 0.5, 2)
  );
  const waveInfluence = Math.sin(waveData.time * waveData.frequency) * 0.2;
  return Math.max(0, Math.min(1, baseOpacity + waveInfluence + mouseInfluence * 0.3));
};
