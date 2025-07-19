
import React from 'react';
import { FloatingCard3D } from '@/components/ui/FloatingCard3D';
import { StarsBackground } from '@/components/ui/stars';
import { StudioPauseButton } from '@/components/studio/StudioPauseButton';
import { StudioResetButton } from '@/components/studio/StudioResetButton';

interface ResponsiveCreate3DLayoutProps {
  isPaused: boolean;
  onTogglePause: () => void;
  onReset: () => void;
  className?: string;
}

export const ResponsiveCreate3DLayout: React.FC<ResponsiveCreate3DLayoutProps> = ({
  isPaused,
  onTogglePause,
  onReset,
  className = ''
}) => {
  return (
    <div 
      className={`fixed inset-0 z-0 ${className}`}
      style={{ cursor: 'grab' }}
      onMouseDown={(e) => {
        e.currentTarget.style.cursor = 'grabbing';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.cursor = 'grab';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.cursor = 'grab';
      }}
    >
      {/* Full Screen Starry Background with 3D Animation */}
      <div className="absolute inset-0">
        <StarsBackground>
          <FloatingCard3D 
            isPaused={isPaused}
            onTogglePause={onTogglePause}
            onReset={onReset}
            showPauseButton={false}
          />
        </StarsBackground>
      </div>

      {/* Control Buttons - Ensure single button instance with proper z-index */}
      <div className="absolute bottom-6 right-6 z-[100] flex gap-3">
        <StudioResetButton 
          onReset={() => {
            console.log('🔄 Reset button clicked in ResponsiveCreate3DLayout');
            onReset();
          }} 
        />
        <StudioPauseButton 
          isPaused={isPaused} 
          onTogglePause={onTogglePause} 
        />
      </div>
    </div>
  );
};
