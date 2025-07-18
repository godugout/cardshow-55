
import React from 'react';
import { CreatePageHero } from '@/components/create/CreatePageHero';
import { CreateOptionsSection } from '@/components/create/CreateOptionsSection';

const CreateChoice: React.FC = () => {
  return (
    <div className="min-h-screen bg-crd-darkest overflow-x-hidden">
      <div className="w-full">
        {/* Unified Hero Section with Responsive 3D Positioning */}
        <CreatePageHero />
        
        {/* Creation Options Section - Hidden on small screens to prevent overlap */}
        <div className="hidden lg:block">
          <CreateOptionsSection />
        </div>
      </div>
    </div>
  );
};

export default CreateChoice;
