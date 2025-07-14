
import React from 'react';
import { NavbarAwareContainer } from '@/components/layout/NavbarAwareContainer';
import { CreatePageHero } from '@/components/create/CreatePageHero';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

const CreateChoice: React.FC = () => {
  const { isMobile } = useResponsiveLayout();

  return (
    <NavbarAwareContainer className="h-screen bg-crd-darkest overflow-hidden">
      <div className={`h-full max-w-7xl mx-auto ${isMobile ? 'pb-8' : 'pb-16'} overflow-y-auto`}>
        {/* New Hero Section */}
        <CreatePageHero />
        
        {/* Rest of the create page content would go here */}
      </div>
    </NavbarAwareContainer>
  );
};

export default CreateChoice;
