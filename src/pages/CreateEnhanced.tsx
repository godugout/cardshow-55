
import React from 'react';
import { CreatePageHero } from '@/components/create/CreatePageHero';
import { CreateOptionsSection } from '@/components/create/CreateOptionsSection';
import { useResponsiveBreakpoints } from '@/hooks/useResponsiveBreakpoints';

const CreateEnhanced: React.FC = () => {
  const { isMobile, isShortScreen } = useResponsiveBreakpoints();

  return (
    <div className="min-h-screen bg-space-odyssey overflow-hidden">
      <div className={`h-full w-full ${isMobile || isShortScreen ? '' : 'overflow-y-auto'}`}>
        {/* Responsive Hero Section */}
        <CreatePageHero />
        
        {/* Combined Creation Options Section - Only show on desktop with sufficient height */}
        {!isMobile && !isShortScreen && <CreateOptionsSection />}
      </div>
    </div>
  );
};

export default CreateEnhanced;
