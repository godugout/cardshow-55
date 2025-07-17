
import React from 'react';
import { CreatePageHero } from '@/components/create/CreatePageHero';
import { CreationOptions } from '@/components/create/CreationOptions';

const CreateChoice: React.FC = () => {
  return (
    <div className="min-h-screen bg-crd-darkest overflow-hidden">
      <div className="h-full w-full overflow-y-auto">
        {/* Full Width Hero Section */}
        <CreatePageHero />
        
        {/* Short Transition Section */}
        <div className="relative z-10 h-[100px] flex items-center justify-center bg-crd-darkest">
          <h2 className="text-3xl font-bold text-center text-white">
            What do you feel like creating today?
          </h2>
        </div>
        
        {/* Creation Options Section */}
        <CreationOptions />
      </div>
    </div>
  );
};

export default CreateChoice;
