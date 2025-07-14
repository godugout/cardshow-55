import React from 'react';
import { NavbarAwareContainer } from '@/components/layout/NavbarAwareContainer';
import { CreatePageHero } from '@/components/create/CreatePageHero';

const CreateChoice: React.FC = () => {
  return (
    <NavbarAwareContainer className="h-screen bg-crd-darkest overflow-hidden">
      <div className="h-full w-full overflow-y-auto">
        {/* Full Width Hero Section */}
        <CreatePageHero />
        
        {/* Rest of the create page content would go here */}
      </div>
    </NavbarAwareContainer>
  );
};

export default CreateChoice;
