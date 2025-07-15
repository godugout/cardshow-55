
import React from 'react';
import { CreatePageHero } from '@/components/create/CreatePageHero';
import { CreateChoiceSection } from '@/components/create/CreateChoiceSection';
import { NavbarAwareContainer } from '@/components/layout/NavbarAwareContainer';

const CreateChoice: React.FC = () => {
  return (
    <NavbarAwareContainer className="min-h-screen bg-crd-darkest overflow-hidden">
      <div className="h-full w-full overflow-y-auto">
        {/* Full Width Hero Section */}
        <CreatePageHero />
        
        {/* Choice Section */}
        <CreateChoiceSection />
      </div>
    </NavbarAwareContainer>
  );
};

export default CreateChoice;
