
import React from 'react';

interface MetallicChromeLayerProps {
  intensity: number;
  mousePosition: { x: number; y: number };
  blur: number;
}

export const MetallicChromeLayer: React.FC<MetallicChromeLayerProps> = ({
  intensity,
  mousePosition,
  blur
}) => {
  return (
    <div
      className="absolute inset-0 z-20"
      style={{
        background: `
          radial-gradient(
            ellipse at ${40 + mousePosition.x * 20}% ${40 + mousePosition.y * 20}%,
            rgba(240, 248, 255, ${(intensity / 100) * 0.6}) 0%,
            rgba(220, 230, 245, ${(intensity / 100) * 0.45}) 25%,
            rgba(200, 215, 235, ${(intensity / 100) * 0.3}) 50%,
            rgba(180, 195, 220, ${(intensity / 100) * 0.15}) 75%,
            transparent 100%
          )
        `,
        mixBlendMode: 'screen',
        opacity: 0.8,
        filter: `blur(${blur * 0.3}px)`
      }}
    />
  );
};
