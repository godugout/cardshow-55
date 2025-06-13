
import React from 'react';

export const EdgeAnimations: React.FC = () => (
  <style>
    {`
      @keyframes gas-pulse {
        0% { opacity: 0.6; transform: scaleY(1); }
        100% { opacity: 0.9; transform: scaleY(1.05); }
      }
      
      @keyframes gas-gentle {
        0% { opacity: 0.4; transform: scaleY(0.98); }
        100% { opacity: 0.7; transform: scaleY(1.02); }
      }
      
      @keyframes sparkle-dance {
        0% { opacity: 0.3; }
        50% { opacity: 0.8; }
        100% { opacity: 0.3; }
      }
    `}
  </style>
);
