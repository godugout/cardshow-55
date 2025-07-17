
import React from 'react';
import { CreatePageHero } from '@/components/create/CreatePageHero';
import { CreateCardsSection } from '@/components/create/CreateCardsSection';
import { CreationOptions } from '@/components/create/CreationOptions';

const CreateChoice: React.FC = () => {
  return (
    <div className="min-h-screen bg-crd-darkest overflow-hidden">
      <div className="h-full w-full overflow-y-auto">
        {/* Full Width Hero Section */}
        <CreatePageHero />
        
        {/* Cards Section */}
        <CreateCardsSection />
        
        {/* Creation Options Section */}
        <CreationOptions />
      </div>
    </div>
  );
};

export default CreateChoice;
