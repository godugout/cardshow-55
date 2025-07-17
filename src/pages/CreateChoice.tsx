
import React from 'react';
import { CreatePageHero } from '@/components/create/CreatePageHero';
import { CreateOptionsSection } from '@/components/create/CreateOptionsSection';

const CreateChoice: React.FC = () => {
  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="w-full">
        {/* Full Width Hero Section */}
        <CreatePageHero />
        
        {/* Combined Creation Options Section */}
        <CreateOptionsSection />
      </div>
    </div>
  );
};

export default CreateChoice;
