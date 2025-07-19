import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';

interface GalacticCompassProps {
  onReset: () => void;
  isResetting?: boolean;
}

export const GalacticCompass: React.FC<GalacticCompassProps> = ({
  onReset,
  isResetting = false
}) => {
  const [compassAngle, setCompassAngle] = useState(0); // 0 = pointing up
  const [isTracking, setIsTracking] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Simulate galactic tracking with random movements
  useEffect(() => {
    if (!isTracking || isResetting) return;

    const updateGalacticDirection = () => {
      // Random drift simulating galactic movement
      const drift = (Math.random() - 0.5) * 15; // ±7.5 degrees
      setCompassAngle(prev => {
        let newAngle = prev + drift;
        // Keep angle between -180 and 180 for natural movement
        if (newAngle > 180) newAngle -= 360;
        if (newAngle < -180) newAngle += 360;
        return newAngle;
      });
    };

    intervalRef.current = setInterval(updateGalacticDirection, 2000 + Math.random() * 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTracking, isResetting]);

  // Reset animation
  useEffect(() => {
    if (isResetting) {
      setIsTracking(false);
      setCompassAngle(0); // Point straight up
      
      // Resume tracking after reset animation
      setTimeout(() => {
        setIsTracking(true);
      }, 1500);
    }
  }, [isResetting]);

  const handleCompassClick = () => {
    console.log('🧭 Galactic compass reset triggered');
    onReset();
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex flex-col items-center gap-2">
        {/* Compass housing - smaller design */}
        <div 
          className="relative w-12 h-12 cursor-pointer group transition-all duration-300 hover:scale-110"
          onClick={handleCompassClick}
        >
          {/* Outer ring with minimal markings */}
          <div className="absolute inset-0 rounded-full border border-blue-400/40 bg-black/60 backdrop-blur-sm">
            {/* Cardinal direction markers - smaller */}
            {[0, 90, 180, 270].map((angle) => (
              <div
                key={angle}
                className="absolute w-0.5 h-2 bg-blue-300/60"
                style={{
                  top: '1px',
                  left: '50%',
                  transformOrigin: '50% 23px',
                  transform: `translateX(-50%) rotate(${angle}deg)`
                }}
              />
            ))}
          </div>

          {/* Inner compass face */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-slate-800 to-black border border-blue-500/20">
            {/* Central dot */}
            <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
            
            {/* Modern straight line needle */}
            <div
              className="absolute top-1/2 left-1/2 origin-bottom transition-transform duration-1000 ease-out"
              style={{
                transform: `translate(-50%, -100%) rotate(${compassAngle}deg)`,
                height: '16px',
                width: '1px'
              }}
            >
              {/* Simple straight line needle */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-blue-600 to-blue-300" />
              
              {/* Needle tip */}
              <div className="absolute -top-0.5 left-1/2 w-1 h-1 bg-blue-300 rounded-full transform -translate-x-1/2" />
            </div>
          </div>

          {/* Hover glow effect - slower animation */}
          <div className="absolute inset-0 rounded-full bg-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
               style={{ animation: isTracking ? 'pulse 3s ease-in-out infinite' : 'none' }} />

          {/* Reset icon overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <RotateCcw className="w-3 h-3 text-blue-300" />
          </div>
        </div>

        {/* Status and coordinates only */}
        <div className="flex flex-col items-center gap-1">
          {/* Status indicator */}
          <div className="flex items-center gap-1 text-xs text-blue-400/70 font-mono">
            <div 
              className={`w-1 h-1 rounded-full ${
                isTracking && !isResetting ? 'bg-green-400' : 'bg-red-400'
              }`} 
              style={{ 
                animation: isTracking && !isResetting ? 'pulse 2s ease-in-out infinite' : 'none' 
              }}
            />
            <span>
              {isResetting ? 'RESET' : isTracking ? 'TRACK' : 'OFF'}
            </span>
          </div>

          {/* Coordinates display */}
          <div className="text-xs text-blue-300/50 font-mono">
            {compassAngle.toFixed(1)}°
          </div>
        </div>
      </div>
    </div>
  );
};
