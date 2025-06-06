
import React, { useEffect, useState } from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';
import { 
  createWaveGradient, 
  getWaveInfluencedOpacity, 
  createRandomizedWaveData,
  calculateInterferencePattern,
  multiOctaveNoise
} from './waves/waveUtils';

interface WavesEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const WavesEffect: React.FC<WavesEffectProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const wavesIntensity = getEffectParam('waves', 'intensity', 0);
  const frequency = getEffectParam('waves', 'frequency', 5);
  const amplitude = getEffectParam('waves', 'amplitude', 30);
  const speed = getEffectParam('waves', 'speed', 100);
  const interference = getEffectParam('waves', 'interference', true);

  const [time, setTime] = useState(0);

  // Animate waves over time with variable speed
  useEffect(() => {
    if (wavesIntensity <= 0) return;
    
    const animationSpeed = (speed / 100) * 0.015; // Slightly slower base speed
    const interval = setInterval(() => {
      setTime(prevTime => prevTime + animationSpeed);
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [wavesIntensity, speed]);

  if (wavesIntensity <= 0) return null;

  // Calculate enhanced wave patterns
  const waveIntensity = wavesIntensity / 100;
  const mouseInfluence = Math.sqrt(
    Math.pow(mousePosition.x - 0.5, 2) + Math.pow(mousePosition.y - 0.5, 2)
  );

  // Create multiple randomized wave data sets for natural variation
  const primaryWave = createRandomizedWaveData(time, frequency * 0.01, amplitude, 1);
  const secondaryWave = createRandomizedWaveData(time, frequency * 0.007, amplitude * 0.6, 2);
  const tertiaryWave = createRandomizedWaveData(time, frequency * 0.013, amplitude * 0.8, 3);

  return (
    <>
      {/* Primary Wave Layer - Enhanced with noise */}
      <div
        className="absolute inset-0 z-15"
        style={{
          background: createWaveGradient(
            primaryWave,
            mousePosition,
            [
              'rgba(255, 255, 255, 0)',
              `rgba(255, 255, 255, ${waveIntensity * 0.08})`,
              'rgba(255, 255, 255, 0)',
              `rgba(255, 255, 255, ${waveIntensity * 0.05})`,
              'rgba(255, 255, 255, 0)'
            ],
            0.4
          ),
          mixBlendMode: 'overlay',
          opacity: getWaveInfluencedOpacity(0.5, primaryWave, mousePosition, 0.6)
        }}
      />

      {/* Secondary Wave Layer - Organic motion */}
      <div
        className="absolute inset-0 z-16"
        style={{
          background: createWaveGradient(
            secondaryWave,
            mousePosition,
            [
              'rgba(255, 255, 255, 0)',
              `rgba(255, 255, 255, ${waveIntensity * 0.06})`,
              'rgba(255, 255, 255, 0)',
              `rgba(255, 255, 255, ${waveIntensity * 0.04})`,
              'rgba(255, 255, 255, 0)'
            ],
            0.6
          ),
          mixBlendMode: 'soft-light',
          opacity: getWaveInfluencedOpacity(0.6, secondaryWave, mousePosition, 0.8),
          transform: `translateX(${Math.sin(time * 0.8) * 2}px) translateY(${Math.cos(time * 0.6) * 1.5}px)`
        }}
      />

      {/* Tertiary Wave Layer - Subtle complexity */}
      <div
        className="absolute inset-0 z-17"
        style={{
          background: createWaveGradient(
            tertiaryWave,
            mousePosition,
            [
              'rgba(255, 255, 255, 0)',
              `rgba(255, 255, 255, ${waveIntensity * 0.04})`,
              'rgba(255, 255, 255, 0)'
            ],
            0.3
          ),
          mixBlendMode: 'screen',
          opacity: getWaveInfluencedOpacity(0.4, tertiaryWave, mousePosition, 0.4)
        }}
      />

      {/* Enhanced Interference Pattern */}
      {interference && (
        <div
          className="absolute inset-0 z-18"
          style={{
            background: `
              radial-gradient(
                ellipse at ${50 + Math.sin(time * 0.9) * 15}% ${50 + Math.cos(time * 0.7) * 12}%,
                rgba(255, 255, 255, ${waveIntensity * 0.03}) 0%,
                rgba(255, 255, 255, 0) 45%
              ),
              conic-gradient(
                from ${time * 120 + mousePosition.x * 60}deg at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%,
                transparent 0deg,
                rgba(255, 255, 255, ${waveIntensity * 0.025}) ${30 + Math.sin(time * 0.8) * 15}deg,
                transparent ${120 + Math.cos(time * 0.6) * 20}deg,
                rgba(255, 255, 255, ${waveIntensity * 0.02}) ${210 + Math.sin(time * 1.1) * 25}deg,
                transparent 360deg
              )
            `,
            mixBlendMode: 'overlay',
            opacity: 0.7,
            filter: `blur(${0.5 + Math.sin(time * 0.5) * 0.3}px)`
          }}
        />
      )}

      {/* Subtle Distortion Layer - Barely perceptible but adds life */}
      <div
        className="absolute inset-0 z-19"
        style={{
          background: `
            linear-gradient(
              ${time * 25 + mousePosition.y * 45}deg,
              transparent 0%,
              rgba(255, 255, 255, ${waveIntensity * 0.015}) 40%,
              transparent 60%,
              rgba(255, 255, 255, ${waveIntensity * 0.01}) 80%,
              transparent 100%
            )
          `,
          mixBlendMode: 'soft-light',
          opacity: 0.3,
          transform: `scale(${1 + Math.sin(time * 0.4) * 0.002})`
        }}
      />
    </>
  );
};
