
import React, { useState } from 'react';
import { FloatingCard3D } from '@/components/ui/FloatingCard3D';
import { StarsBackground } from '@/components/ui/stars';
import { MobileStudioTaskbar } from './MobileStudioTaskbar';

export const MobileStudioSection: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);

  const handleTogglePause = () => {
    setIsPaused(prev => !prev);
  };

  const handleReset = () => {
    // Reset the 3D card to its initial position
    window.location.reload(); // Simple reset for now
  };

  return (
    <div id="mobile-studio-section" className="relative w-full h-screen bg-crd-darkest">
      {/* 3D Background covering entire section */}
      <div className="absolute inset-0 z-0 h-full">
        <StarsBackground>
          <FloatingCard3D 
            isPaused={isPaused}
            onTogglePause={handleTogglePause}
            showPauseButton={false}
          />
        </StarsBackground>
      </div>

      {/* Mobile Studio Taskbar */}
      <MobileStudioTaskbar
        isPaused={isPaused}
        onTogglePause={handleTogglePause}
        onReset={handleReset}
      />
    </div>
  );
};
