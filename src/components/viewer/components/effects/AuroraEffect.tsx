
import React, { useEffect, useState } from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';
import { calculateWavePosition, createWaveGradient, type WaveData } from './waves/waveUtils';

interface AuroraEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const AuroraEffect: React.FC<AuroraEffectProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const auroraIntensity = getEffectParam('aurora', 'intensity', 0);
  const waveSpeed = getEffectParam('aurora', 'waveSpeed', 80);
  const colorShift = getEffectParam('aurora', 'colorShift', 120);
  
  // Check if waves effect is active for enhanced movement
  const wavesIntensity = getEffectParam('waves', 'intensity', 0);
  const waveFrequency = getEffectParam('waves', 'frequency', 5);
  const waveAmplitude = getEffectParam('waves', 'amplitude', 30);

  // Enhanced animation state with wave integration
  const [time, setTime] = useState(0);
  const [flarePosition, setFlarePosition] = useState({ x: Math.random(), y: Math.random() });
  const [flareActive, setFlareActive] = useState(false);
  const [flareOpacity, setFlareOpacity] = useState(0);

  // Create wave data for aurora movement
  const waveData: WaveData = {
    time,
    frequency: waveFrequency / 10,
    amplitude: (waveAmplitude / 100) * 0.3,
    phase: 0
  };

  // Enhanced time animation with wave influence
  useEffect(() => {
    if (auroraIntensity <= 0) return;
    
    const baseSpeed = (waveSpeed / 100) * 0.02;
    const waveInfluence = wavesIntensity > 0 ? 1 + (wavesIntensity / 100) * 0.5 : 1;
    const animationSpeed = baseSpeed * waveInfluence;
    
    const interval = setInterval(() => {
      setTime(prevTime => prevTime + animationSpeed);
    }, 16);
    
    return () => clearInterval(interval);
  }, [auroraIntensity, waveSpeed, wavesIntensity]);
  
  // Enhanced flare system with wave influence
  useEffect(() => {
    if (auroraIntensity <= 0) return;
    
    const baseInterval = 3000 + Math.random() * 4000;
    const waveInfluence = wavesIntensity > 0 ? 0.7 : 1; // More frequent flares with waves
    
    const flareTimer = setInterval(() => {
      if (Math.random() > 0.7) {
        const waveX = wavesIntensity > 0 ? calculateWavePosition(0.5, waveData, 0.3) : Math.random() * 0.8 + 0.1;
        const waveY = wavesIntensity > 0 ? calculateWavePosition(0.5, { ...waveData, phase: Math.PI / 2 }, 0.3) : Math.random() * 0.8 + 0.1;
        
        setFlarePosition({ 
          x: Math.max(0.1, Math.min(0.9, waveX)),
          y: Math.max(0.1, Math.min(0.9, waveY))
        });
        setFlareActive(true);
        setFlareOpacity(0.6 + Math.random() * 0.3);
        
        setTimeout(() => {
          setFlareActive(false);
        }, 1500 + Math.random() * 2000);
      }
    }, baseInterval * waveInfluence);
    
    return () => {
      clearInterval(flareTimer);
    };
  }, [auroraIntensity, wavesIntensity, time]);

  if (auroraIntensity <= 0) return null;

  const animationDuration = 10000 / (waveSpeed / 100);
  
  // Calculate wave-influenced positions
  const waveInfluencedX = wavesIntensity > 0 
    ? calculateWavePosition(mousePosition.x, waveData, 0.2)
    : mousePosition.x;
  const waveInfluencedY = wavesIntensity > 0 
    ? calculateWavePosition(mousePosition.y, { ...waveData, phase: Math.PI / 3 }, 0.2)
    : mousePosition.y;

  return (
    <>
      {/* Base Aurora Layer - Enhanced with wave movement */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            radial-gradient(
              ellipse at ${waveInfluencedX * 100}% ${waveInfluencedY * 100}%,
              rgba(30, 150, 255, ${(auroraIntensity / 100) * 0.3}) 0%,
              rgba(20, 180, 120, ${(auroraIntensity / 100) * 0.35}) 40%,
              rgba(80, 100, 200, ${(auroraIntensity / 100) * 0.25}) 70%,
              transparent 100%
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.8 + (wavesIntensity > 0 ? Math.sin(time * 2) * 0.1 : 0)
        }}
      />
      
      {/* Aurora Waves - Enhanced flowing colors with wave integration */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            linear-gradient(
              ${180 + waveInfluencedY * 40 + (wavesIntensity > 0 ? Math.sin(time) * 20 : 0)}deg,
              transparent 0%,
              rgba(20, 150, 240, ${(auroraIntensity / 100) * 0.2}) 15%,
              rgba(60, 200, 140, ${(auroraIntensity / 100) * 0.25}) 35%, 
              rgba(80, 120, 200, ${(auroraIntensity / 100) * 0.2}) 55%,
              rgba(120, 80, 180, ${(auroraIntensity / 100) * 0.18}) 75%,
              transparent 100%
            )
          `,
          backgroundSize: wavesIntensity > 0 ? '400% 400%' : '300% 300%',
          animation: `aurora-flow ${animationDuration * (wavesIntensity > 0 ? 1.5 : 2)}ms ease infinite`,
          mixBlendMode: 'screen',
          opacity: 0.9,
          transform: wavesIntensity > 0 ? `scale(${1 + Math.sin(time * 0.5) * 0.05})` : 'none'
        }}
      />

      {/* Aurora Flare - Enhanced with wave positioning */}
      <div
        className="absolute inset-0 z-22 transition-opacity duration-1000"
        style={{
          background: `
            radial-gradient(
              circle at ${flarePosition.x * 100}% ${flarePosition.y * 100}%,
              rgba(255, 80, 40, ${flareActive ? flareOpacity : 0}) 0%,
              rgba(255, 140, 60, ${flareActive ? flareOpacity * 0.8 : 0}) 30%,
              transparent 70%
            )
          `,
          mixBlendMode: 'screen',
          opacity: flareActive ? 1 : 0,
          transition: 'opacity 0.8s ease-in-out',
          transform: wavesIntensity > 0 && flareActive ? `scale(${1 + Math.sin(time * 3) * 0.1})` : 'none'
        }}
      />

      {/* Enhanced shimmer layer with wave-influenced color shift */}
      <div
        className="absolute inset-0 z-23 transition-opacity"
        style={{
          background: `
            linear-gradient(
              ${colorShift + waveInfluencedX * 90 + (wavesIntensity > 0 ? Math.cos(time * 0.8) * 30 : 0)}deg,
              transparent 0%,
              rgba(100, 220, 180, 0.2) 20%,
              rgba(60, 200, 150, 0.25) 50%,
              rgba(100, 220, 180, 0.2) 80%,
              transparent 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.6 + (wavesIntensity > 0 ? Math.sin(time * 1.2) * 0.1 : 0),
          animation: `aurora-shimmer ${animationDuration}ms infinite alternate`
        }}
      />

      {/* Wave-enhanced particle system */}
      {wavesIntensity > 0 && Array.from({ length: 8 }, (_, i) => {
        const particleWave = {
          ...waveData,
          phase: (i / 8) * Math.PI * 2,
          frequency: waveData.frequency * (1 + i * 0.1)
        };
        const x = calculateWavePosition(0.2 + (i / 8) * 0.6, particleWave, 0.4);
        const y = calculateWavePosition(0.3 + (i / 8) * 0.4, { ...particleWave, phase: particleWave.phase + Math.PI / 4 }, 0.3);
        
        return (
          <div
            key={`aurora-particle-${i}`}
            className="absolute z-24"
            style={{
              left: `${Math.max(0, Math.min(100, x * 100))}%`,
              top: `${Math.max(0, Math.min(100, y * 100))}%`,
              width: '4px',
              height: '4px',
              background: `rgba(${100 + i * 20}, ${180 + i * 10}, ${200 - i * 15}, ${(auroraIntensity / 100) * 0.8})`,
              borderRadius: '50%',
              filter: 'blur(1px)',
              transform: 'translate(-50%, -50%)',
              opacity: Math.sin(time * 2 + i) * 0.5 + 0.5
            }}
          />
        );
      })}

      {/* Style tag for animations */}
      <style>
        {`
          @keyframes aurora-flow {
            0% { background-position: 0% 0% }
            50% { background-position: 100% 100% }
            100% { background-position: 0% 0% }
          }
          @keyframes aurora-shimmer {
            0% { opacity: 0.4 }
            100% { opacity: 0.8 }
          }
        `}
      </style>
    </>
  );
};
