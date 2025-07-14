
import React from 'react';

export const BaseballPatterns: React.FC = () => {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        {/* Baseball Jersey Texture Pattern */}
        <pattern
          id="jersey-texture"
          patternUnits="userSpaceOnUse"
          width="4"
          height="4"
        >
          <rect width="4" height="4" fill="transparent" />
          <path
            d="M0,0 L2,2 M2,0 L4,2 M0,2 L2,4"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="0.5"
          />
          <circle cx="1" cy="1" r="0.3" fill="rgba(255,255,255,0.01)" />
          <circle cx="3" cy="3" r="0.3" fill="rgba(255,255,255,0.01)" />
        </pattern>

        {/* Away Gray Jersey Pattern */}
        <pattern
          id="away-jersey-pattern"
          patternUnits="userSpaceOnUse"
          width="6"
          height="6"
        >
          <rect width="6" height="6" fill="#B8B8B8" />
          <rect width="6" height="6" fill="url(#jersey-texture)" />
          <path
            d="M0,3 L3,0 M3,6 L6,3"
            stroke="rgba(0,0,0,0.02)"
            strokeWidth="0.5"
          />
        </pattern>

        {/* Pinstripes Pattern - Dynamic team colors will be applied via CSS */}
        <pattern
          id="pinstripes-pattern"
          patternUnits="userSpaceOnUse"
          width="16"
          height="100%"
          patternTransform="rotate(0)"
        >
          <rect width="16" height="100%" fill="#FAFAFA" />
          <rect width="16" height="100%" fill="url(#jersey-texture)" />
          <rect x="0" y="0" width="2" height="100%" fill="var(--pinstripe-color, #3772FF)" opacity="0.15" />
          <rect x="8" y="0" width="2" height="100%" fill="var(--pinstripe-color, #3772FF)" opacity="0.12" />
        </pattern>

        {/* Fine pinstripes for subtle effect */}
        <pattern
          id="fine-pinstripes-pattern"
          patternUnits="userSpaceOnUse"
          width="12"
          height="100%"
        >
          <rect width="12" height="100%" fill="#F8F9FA" />
          <rect width="12" height="100%" fill="url(#jersey-texture)" />
          <rect x="0" y="0" width="1" height="100%" fill="var(--pinstripe-color, #3772FF)" opacity="0.08" />
          <rect x="6" y="0" width="1" height="100%" fill="var(--pinstripe-color, #3772FF)" opacity="0.06" />
        </pattern>
      </defs>
    </svg>
  );
};
