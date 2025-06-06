
import React, { useEffect, useState } from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

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

  // Animate waves over time
  useEffect(() => {
    if (wavesIntensity <= 0) return;
    
    const animationSpeed = (speed / 100) * 0.02;
    const interval = setInterval(() => {
      setTime(prevTime => prevTime + animationSpeed);
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [wavesIntensity, speed]);

  if (wavesIntensity <= 0) return null;

  // Calculate wave patterns
  const waveIntensity = wavesIntensity / 100;
  const mouseInfluence = Math.sqrt(
    Math.pow(mousePosition.x - 0.5, 2) + Math.pow(mousePosition.y - 0.5, 2)
  );

  return (
    <>
      {/* Primary Wave Layer */}
      <div
        className="absolute inset-0 z-15"
        style={{
          background: `
            radial-gradient(
              ellipse at ${50 + Math.sin(time) * amplitude}% ${50 + Math.cos(time * 0.7) * amplitude}%,
              rgba(255, 255, 255, ${waveIntensity * 0.1}) 0%,
              rgba(255, 255, 255, ${waveIntensity * 0.05}) 40%,
              transparent 70%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.6 + mouseInfluence * 0.4
        }}
      />

      {/* Secondary Wave Layer */}
      <div
        className="absolute inset-0 z-16"
        style={{
          background: `
            linear-gradient(
              ${time * 90 + mousePosition.x * 180}deg,
              transparent 0%,
              rgba(255, 255, 255, ${waveIntensity * 0.08}) ${20 + Math.sin(time * frequency) * 10}%,
              transparent ${40 + Math.cos(time * frequency) * 15}%,
              rgba(255, 255, 255, ${waveIntensity * 0.06}) ${60 + Math.sin(time * frequency * 1.3) * 12}%,
              transparent 100%
            )
          `,
          mixBlendMode: 'soft-light',
          opacity: 0.7
        }}
      />

      {/* Interference Pattern */}
      {interference && (
        <div
          className="absolute inset-0 z-17"
          style={{
            background: `
              conic-gradient(
                from ${time * 180}deg at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%,
                transparent 0deg,
                rgba(255, 255, 255, ${waveIntensity * 0.04}) ${45 + Math.sin(time * frequency) * 20}deg,
                transparent ${90 + Math.cos(time * frequency) * 25}deg,
                rgba(255, 255, 255, ${waveIntensity * 0.03}) ${180 + Math.sin(time * frequency * 0.8) * 30}deg,
                transparent ${270 + Math.cos(time * frequency * 1.2) * 20}deg,
                rgba(255, 255, 255, ${waveIntensity * 0.05}) 360deg
              )
            `,
            mixBlendMode: 'overlay',
            opacity: 0.5
          }}
        />
      )}

      {/* Wave Distortion Effect */}
      <div
        className="absolute inset-0 z-18"
        style={{
          background: `
            repeating-linear-gradient(
              ${time * 45 + mousePosition.y * 90}deg,
              transparent 0px,
              rgba(255, 255, 255, ${waveIntensity * 0.02}) ${2 + Math.sin(time * frequency) * 2}px,
              transparent ${8 + Math.cos(time * frequency) * 4}px
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.4,
          filter: `blur(${1 + Math.sin(time) * 0.5}px)`
        }}
      />
    </>
  );
};
