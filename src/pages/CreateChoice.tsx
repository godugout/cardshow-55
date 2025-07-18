
import React from 'react';
import { CreatePageHero } from '@/components/create/CreatePageHero';
import { CreateOptionsSection } from '@/components/create/CreateOptionsSection';
import { useScrollResistance } from '@/hooks/useScrollResistance';

const CreateChoice: React.FC = () => {
  // Enable scroll resistance for the 3D animation section
  useScrollResistance({
    resistanceThreshold: 150,
    resistanceMultiplier: 2.5
  });

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
