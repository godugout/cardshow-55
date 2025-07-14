
import React from 'react';
import { StandardHero } from '@/components/shared/StandardHero';
import { CreateOptionsGrid } from '@/components/create/CreateOptionsGrid';
import { NavbarAwareContainer } from '@/components/layout/NavbarAwareContainer';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

const CreateChoice = () => {
  const { isMobile } = useResponsiveLayout();

  return (
    <NavbarAwareContainer className="h-screen bg-crd-darkest overflow-hidden">
      <div className={`h-full max-w-7xl mx-auto ${isMobile ? 'px-5 pb-8' : 'px-12 pb-16'} overflow-y-auto`}>
        <StandardHero
          label="CREATOR STUDIO"
          title={
            <>
              CUT, CRAFT & CREATE
              <br />
              <span className="gradient-text-green-blue-purple">DIGITALLY</span>
            </>
          }
          description="Choose your creative path and bring your vision to life with professional-grade tools designed for the modern creator."
          primaryCta={{
            text: "Start Creating",
            link: "/create/crd",
            variant: "primary"
          }}
          secondaryCta={{
            text: "View Gallery",
            link: "/gallery",
            variant: "outline"
          }}
          showDecorations={true}
        />
        
        <CreateOptionsGrid />
      </div>
    </NavbarAwareContainer>
  );
};

export default CreateChoice;
