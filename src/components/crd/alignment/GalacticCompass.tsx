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
        {/* Compass housing */}
        <div 
          className="relative w-20 h-20 cursor-pointer group transition-all duration-300 hover:scale-110"
          onClick={handleCompassClick}
        >
          {/* Outer ring with galactic markings */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-400/60 bg-black/80 backdrop-blur-sm">
            {/* Cardinal direction markers */}
            {[0, 90, 180, 270].map((angle) => (
              <div
                key={angle}
                className="absolute w-1 h-3 bg-blue-300/80"
                style={{
                  top: '2px',
                  left: '50%',
                  transformOrigin: '50% 38px',
                  transform: `translateX(-50%) rotate(${angle}deg)`
                }}
              />
            ))}
            
            {/* Minor direction markers */}
            {[45, 135, 225, 315].map((angle) => (
              <div
                key={angle}
                className="absolute w-0.5 h-2 bg-blue-400/60"
                style={{
                  top: '3px',
                  left: '50%',
                  transformOrigin: '50% 37px',
                  transform: `translateX(-50%) rotate(${angle}deg)`
                }}
              />
            ))}
          </div>

          {/* Inner compass face */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-slate-900 to-black border border-blue-500/30">
            {/* Galactic center indicator */}
            <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-yellow-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            
            {/* Compass needle pointing to galactic center */}
            <div
              className="absolute top-1/2 left-1/2 origin-bottom transition-transform duration-1000 ease-out"
              style={{
                transform: `translate(-50%, -100%) rotate(${compassAngle}deg)`,
                height: '24px',
                width: '2px'
              }}
            >
              {/* North end (pointing to galactic center) */}
              <div className="absolute top-0 left-1/2 w-0 h-0 transform -translate-x-1/2 border-l-[3px] border-r-[3px] border-b-[12px] border-l-transparent border-r-transparent border-b-red-400" />
              
              {/* South end */}
              <div className="absolute bottom-0 left-1/2 w-0 h-0 transform -translate-x-1/2 border-l-[2px] border-r-[2px] border-t-[8px] border-l-transparent border-r-transparent border-t-blue-400" />
            </div>
          </div>

          {/* Hover glow effect */}
          <div className="absolute inset-0 rounded-full bg-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />

          {/* Reset icon overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <RotateCcw className="w-5 h-5 text-blue-300" />
          </div>
        </div>

        {/* Compass label */}
        <div className="text-xs text-blue-300/80 font-mono text-center">
          <div>GALACTIC</div>
          <div>COMPASS</div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-1 text-xs text-blue-400/60 font-mono">
          <div 
            className={`w-1.5 h-1.5 rounded-full ${
              isTracking && !isResetting ? 'bg-green-400 animate-pulse' : 'bg-red-400'
            }`} 
          />
          <span>
            {isResetting ? 'RESETTING' : isTracking ? 'TRACKING' : 'OFFLINE'}
          </span>
        </div>

        {/* Coordinates display */}
        <div className="text-xs text-blue-300/60 font-mono text-center">
          <div>GC: {compassAngle.toFixed(1)}°</div>
        </div>
      </div>
    </div>
  );
};
