
import React from 'react';

interface RotationIndicatorProps {
  show: boolean;
  angle: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const RotationIndicator: React.FC<RotationIndicatorProps> = ({
  show,
  angle,
  position = 'top-right'
}) => {
  if (!show) return null;

  const normalizedAngle = ((angle % 360) + 360) % 360;
  const displayAngle = Math.round(normalizedAngle);

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  return (
    <div className={`absolute ${positionClasses[position]} z-50 pointer-events-none`}>
      <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
        <div className="flex items-center gap-2 text-white">
          {/* Rotation compass */}
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 border border-white/40 rounded-full"></div>
            <div 
              className="absolute top-0 left-1/2 w-0.5 h-3 bg-crd-primary transform -translate-x-0.5 origin-bottom"
              style={{ 
                transform: `translateX(-50%) rotate(${normalizedAngle}deg)`,
                transformOrigin: '50% 100%'
              }}
            ></div>
            {/* Cardinal direction markers */}
            <div className="absolute top-0 left-1/2 transform -translate-x-0.5 -translate-y-1">
              <div className="w-0.5 h-1 bg-white/60"></div>
            </div>
            <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-0.5">
              <div className="w-1 h-0.5 bg-white/60"></div>
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-0.5 translate-y-1">
              <div className="w-0.5 h-1 bg-white/60"></div>
            </div>
            <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-0.5">
              <div className="w-1 h-0.5 bg-white/60"></div>
            </div>
          </div>
          
          {/* Angle display */}
          <div className="text-sm font-mono">
            <span className="text-crd-primary">{displayAngle}°</span>
          </div>
        </div>
      </div>
    </div>
  );
};
