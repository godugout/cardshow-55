
import React from 'react';
import { CreatePageHero } from '@/components/create/CreatePageHero';
import { CreateOptionsSection } from '@/components/create/CreateOptionsSection';
import { useResponsiveBreakpoints } from '@/hooks/useResponsiveBreakpoints';

const CreateEnhanced: React.FC = () => {
  const { isMobile, isShortScreen } = useResponsiveBreakpoints();

  return (
    <div className="min-h-screen bg-space-odyssey overflow-x-hidden">
      <div className="h-full w-full">
        {/* Unified Responsive Hero Section */}
        <CreatePageHero />
        
        {/* Creation Options Section - Only show on desktop with sufficient height */}
        {!isMobile && !isShortScreen && (
          <div className="hidden lg:block">
            <CreateOptionsSection />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateEnhanced;
