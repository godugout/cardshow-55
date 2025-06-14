import React from 'react';
import type { SimpleEffectValues } from '../hooks/useSimpleCardEffects';

interface SimpleCardEffectsLayerProps {
  effectValues: SimpleEffectValues;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  interactiveLighting?: boolean;
}

export const SimpleCardEffectsLayer: React.FC<SimpleCardEffectsLayerProps> = ({
  effectValues,
  mousePosition,
  isHovering,
  interactiveLighting = false
}) => {
  // Calculate total intensity for edge glow
  const totalIntensity = Object.values(effectValues).reduce((sum, value) => sum + value, 0);
  const normalizedIntensity = Math.min(totalIntensity / 1000, 1); // Normalize to 0-1

  return (
    <>
      {/* Holographic Effect */}
      {effectValues.holographic > 0 && (
        <div
          className="absolute inset-0 z-20"
          style={{
            background: `linear-gradient(
              ${45 + mousePosition.x * 90}deg,
              rgba(255, 0, 150, ${(effectValues.holographic / 100) * 0.3}) 0%,
              rgba(0, 255, 255, ${(effectValues.holographic / 100) * 0.2}) 25%,
              rgba(255, 255, 0, ${(effectValues.holographic / 100) * 0.3}) 50%,
              rgba(255, 0, 255, ${(effectValues.holographic / 100) * 0.2}) 75%,
              rgba(0, 255, 150, ${(effectValues.holographic / 100) * 0.3}) 100%
            )`,
            mixBlendMode: 'screen',
            transform: `rotate(${mousePosition.x * 5}deg)`,
            transition: 'transform 0.2s ease'
          }}
        />
      )}

      {/* Chrome Effect */}
      {effectValues.chrome > 0 && (
        <div
          className="absolute inset-0 z-19"
          style={{
            background: `linear-gradient(
              ${135 + mousePosition.x * 45}deg,
              rgba(192, 192, 192, ${(effectValues.chrome / 100) * 0.4}) 0%,
              rgba(255, 255, 255, ${(effectValues.chrome / 100) * 0.6}) 50%,
              rgba(160, 160, 160, ${(effectValues.chrome / 100) * 0.4}) 100%
            )`,
            mixBlendMode: 'overlay'
          }}
        />
      )}

      {/* Gold Effect */}
      {effectValues.gold > 0 && (
        <div
          className="absolute inset-0 z-18"
          style={{
            background: `radial-gradient(
              circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(255, 215, 0, ${(effectValues.gold / 100) * 0.5}) 0%,
              rgba(218, 165, 32, ${(effectValues.gold / 100) * 0.3}) 50%,
              transparent 70%
            )`,
            mixBlendMode: 'multiply'
          }}
        />
      )}

      {/* Aurora/Starlight Effect */}
      {effectValues.aurora > 0 && (
        <div
          className="absolute inset-0 z-17"
          style={{
            background: `
              radial-gradient(2px 2px at 20% 30%, rgba(255, 255, 255, ${(effectValues.aurora / 100) * 0.8}), transparent),
              radial-gradient(2px 2px at 40% 70%, rgba(135, 206, 235, ${(effectValues.aurora / 100) * 0.6}), transparent),
              radial-gradient(1px 1px at 90% 40%, rgba(255, 255, 255, ${(effectValues.aurora / 100) * 0.9}), transparent),
              radial-gradient(1px 1px at 60% 20%, rgba(173, 216, 230, ${(effectValues.aurora / 100) * 0.7}), transparent),
              radial-gradient(2px 2px at 80% 80%, rgba(255, 255, 255, ${(effectValues.aurora / 100) * 0.8}), transparent)
            `,
            backgroundSize: '200px 200px, 150px 150px, 100px 100px, 180px 180px, 120px 120px',
            animation: `twinkle 3s ease-in-out infinite`,
            mixBlendMode: 'screen'
          }}
        />
      )}

      {/* Crystal Effect */}
      {effectValues.crystal > 0 && (
        <div
          className="absolute inset-0 z-16"
          style={{
            background: `
              radial-gradient(circle at 25% 25%, rgba(255, 255, 255, ${(effectValues.crystal / 100) * 0.3}) 1px, transparent 2px),
              radial-gradient(circle at 75% 75%, rgba(200, 200, 255, ${(effectValues.crystal / 100) * 0.4}) 1px, transparent 2px),
              radial-gradient(circle at 50% 50%, rgba(255, 255, 255, ${(effectValues.crystal / 100) * 0.5}) 0.5px, transparent 1px)
            `,
            backgroundSize: '50px 50px, 60px 60px, 30px 30px',
            mixBlendMode: 'screen'
          }}
        />
      )}

      {/* Vintage Effect */}
      {effectValues.vintage > 0 && (
        <div
          className="absolute inset-0 z-15"
          style={{
            background: `
              radial-gradient(ellipse at center, transparent 40%, rgba(139, 69, 19, ${(effectValues.vintage / 100) * 0.2}) 100%),
              linear-gradient(45deg, rgba(160, 82, 45, ${(effectValues.vintage / 100) * 0.1}) 0%, transparent 50%)
            `,
            mixBlendMode: 'multiply'
          }}
        />
      )}

      {/* Foil Spray Effect */}
      {effectValues.foilspray > 0 && (
        <div
          className="absolute inset-0 z-14"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(192, 192, 192, ${(effectValues.foilspray / 100) * 0.2}) 1px, transparent 2px),
              radial-gradient(circle at 60% 70%, rgba(255, 255, 255, ${(effectValues.foilspray / 100) * 0.15}) 1px, transparent 2px),
              radial-gradient(circle at 80% 20%, rgba(176, 176, 176, ${(effectValues.foilspray / 100) * 0.2}) 1px, transparent 2px)
            `,
            backgroundSize: '40px 40px, 35px 35px, 45px 45px',
            mixBlendMode: 'screen'
          }}
        />
      )}

      {/* Other effects with similar simplified implementations */}
      {effectValues.prizm > 0 && (
        <div
          className="absolute inset-0 z-13"
          style={{
            background: `linear-gradient(
              ${90 + mousePosition.x * 180}deg,
              rgba(255, 0, 0, ${(effectValues.prizm / 100) * 0.15}) 0%,
              rgba(255, 127, 0, ${(effectValues.prizm / 100) * 0.15}) 16.66%,
              rgba(255, 255, 0, ${(effectValues.prizm / 100) * 0.15}) 33.33%,
              rgba(0, 255, 0, ${(effectValues.prizm / 100) * 0.15}) 50%,
              rgba(0, 0, 255, ${(effectValues.prizm / 100) * 0.15}) 66.66%,
              rgba(75, 0, 130, ${(effectValues.prizm / 100) * 0.15}) 83.33%,
              rgba(148, 0, 211, ${(effectValues.prizm / 100) * 0.15}) 100%
            )`,
            mixBlendMode: 'overlay'
          }}
        />
      )}

      {/* Edge Glow Enhancement */}
      {totalIntensity > 0 && (
        <div
          className="absolute inset-0 z-25 rounded-xl"
          style={{
            boxShadow: `
              inset 0 0 15px rgba(255, 255, 255, ${normalizedIntensity * (interactiveLighting && isHovering ? 0.15 : 0.05)}),
              inset 0 0 5px rgba(255, 255, 255, ${normalizedIntensity * (interactiveLighting && isHovering ? 0.25 : 0.1)})
            `,
            opacity: interactiveLighting && isHovering ? 0.8 : 0.5
          }}
        />
      )}

      {/* Twinkle Animation Keyframes */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
};
