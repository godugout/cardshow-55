import React from 'react';
import { CreatePageHero } from '@/components/create/CreatePageHero';
import { CreateOptionsSection } from '@/components/create/CreateOptionsSection';

const CreateEnhanced: React.FC = () => {
  // Regular create page with space odyssey theme
  return (
    <div className="min-h-screen bg-space-odyssey overflow-hidden">
      <div className="h-full w-full overflow-y-auto">
        {/* Full Width Hero Section */}
        <CreatePageHero />
        
        {/* Combined Creation Options Section */}
        <CreateOptionsSection />
      </div>
    </div>
  );
};

export default CreateEnhanced;