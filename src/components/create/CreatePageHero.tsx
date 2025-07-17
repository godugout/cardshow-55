
import React from 'react';
import { StandardHero } from '@/components/shared/StandardHero';
import { Link } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system/Button';
import { PixelDigital } from '@/components/ui/PixelDigital';
import { FloatingCard3D } from '@/components/ui/FloatingCard3D';
import { StudioResetButton } from '@/components/studio/StudioResetButton';

const AnimatedTagline: React.FC = () => {
  return (
    <div className="mt-12 mb-8">
      <p className="font-caveat text-4xl md:text-5xl italic text-center text-crd-orange animate-fade-in">
        "No glue needed."
      </p>
    </div>
  );
};

export const CreatePageHero: React.FC = () => {
  const handleResetCamera = () => {
    // Trigger a camera reset - this will be handled by the CRDViewer component
    window.dispatchEvent(new CustomEvent('crd-reset-camera'));
  };

  return (
    <div className="relative w-screen -mx-[50vw] left-1/2 overflow-hidden h-screen">
      {/* 3D Background covering entire hero section */}
      <div className="absolute inset-0 z-0 h-full">
        <FloatingCard3D />
      </div>
      
      {/* Reset Button */}
      <StudioResetButton onReset={handleResetCamera} />
      
      {/* Hero Content Overlay */}
      <div className="relative z-10 text-center pb-4 pt-[calc(var(--navbar-height)+100px)]">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Label */}
          <div className="mb-4 gradient-text-green-blue-purple font-bold tracking-wider text-sm uppercase">
            CUT, CRAFT & CREATE DIGITALLY
          </div>
          
          {/* Main Heading */}
          <div className="mb-4">
              <h1 className="leading-tight text-crd-white drop-shadow-lg">
                <div className="flex justify-center items-center mb-2 text-5xl md:text-6xl lg:text-7xl">
                  <span className="text-gray-400 font-light">From <span className="paper-scraps">paper scraps</span> and <span className="cardboard-text">cardboard</span> to</span>
                </div>
               <div className="flex justify-center items-center text-6xl md:text-7xl lg:text-8xl">
                 <span className="font-bold">
                   <PixelDigital className="inline">digital</PixelDigital>
                   <span className="text-white"> art that comes alive!</span>
                 </span>
               </div>
             </h1>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center my-12">
            <Link to="/create/crd">
              <CRDButton 
                size="lg" 
                variant="create"
                className="min-w-[200px]"
              >
                Start Creating
              </CRDButton>
            </Link>
            <Link to="/templates">
              <CRDButton 
                variant="outline" 
                size="lg" 
                className="min-w-[200px]"
              >
                Browse Templates
              </CRDButton>
            </Link>
          </div>
          
          {/* Animated Tagline */}
          <AnimatedTagline />
          
          {/* Extra spacing to position 3D card in visible area */}
          <div className="mt-32 mb-32"></div>
        </div>
      </div>
    </div>
  );
};
