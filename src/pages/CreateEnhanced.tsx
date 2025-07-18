
import React from 'react';
import { CreatePageHero } from '@/components/create/CreatePageHero';
import { CreateOptionsSection } from '@/components/create/CreateOptionsSection';
import { useIsMobile } from '@/hooks/use-mobile';

const CreateEnhanced: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-space-odyssey overflow-hidden">
      <div className="h-full w-full overflow-y-auto">
        {/* Responsive Hero Section */}
        <CreatePageHero />
        
        {/* Combined Creation Options Section - Only show on desktop or after mobile studio */}
        {!isMobile && <CreateOptionsSection />}
      </div>
    </div>
  );
};

export default CreateEnhanced;
