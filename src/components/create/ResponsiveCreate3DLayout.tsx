
import React, { useRef, useEffect, useState } from 'react';
import { FloatingCard3D } from '@/components/ui/FloatingCard3D';
import { StarsBackground } from '@/components/ui/stars';
import { StudioPauseButton } from '@/components/studio/StudioPauseButton';
import { StudioResetButton } from '@/components/studio/StudioResetButton';

interface ResponsiveCreate3DLayoutProps {
  taglineRef: React.RefObject<HTMLElement>;
  isPaused: boolean;
  onTogglePause: () => void;
  onReset: () => void;
  className?: string;
}

export const ResponsiveCreate3DLayout: React.FC<ResponsiveCreate3DLayoutProps> = ({
  taglineRef,
  isPaused,
  onTogglePause,
  onReset,
  className = ''
}) => {
  const [layoutMetrics, setLayoutMetrics] = useState({
    top: 0,
    height: 400,
    windowHeight: 0
  });

  const calculateLayout = () => {
    if (!taglineRef.current) return;

    const taglineRect = taglineRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Position 3D content below tagline with some margin
    const topPosition = taglineRect.bottom + 20;
    const availableHeight = windowHeight - topPosition - 20; // 20px bottom margin
    
    setLayoutMetrics({
      top: topPosition,
      height: Math.max(300, availableHeight), // Minimum 300px height
      windowHeight
    });
  };

  useEffect(() => {
    // Initial calculation
    const timer = setTimeout(calculateLayout, 100); // Small delay to ensure DOM is ready

    // Recalculate on window resize
    const handleResize = () => {
      calculateLayout();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [taglineRef]);

  // Recalculate when tagline content might have changed
  useEffect(() => {
    calculateLayout();
  }, [taglineRef.current]);

  if (layoutMetrics.height < 200) {
    // Not enough space, don't render 3D content
    return null;
  }

  return (
    <div 
      className={`fixed left-0 right-0 z-0 ${className}`}
      style={{
        top: `${layoutMetrics.top}px`,
        height: `${layoutMetrics.height}px`
      }}
    >
      {/* 3D Background */}
      <div className="absolute inset-0">
        <StarsBackground>
          <FloatingCard3D 
            isPaused={isPaused}
            onTogglePause={onTogglePause}
            showPauseButton={false}
          />
        </StarsBackground>
      </div>

      {/* Control Buttons */}
      <div className="absolute bottom-6 right-6 z-50 flex gap-3">
        <StudioResetButton onReset={onReset} />
        <StudioPauseButton 
          isPaused={isPaused} 
          onTogglePause={onTogglePause} 
        />
      </div>
    </div>
  );
};
