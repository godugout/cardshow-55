
import React, { useState } from 'react';
import { StandardHero } from '@/components/shared/StandardHero';
import { Link } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system/Button';
import { PixelDigital } from '@/components/ui/PixelDigital';
import { FloatingCard3D } from '@/components/ui/FloatingCard3D';
import { StudioResetButton } from '@/components/studio/StudioResetButton';
import { StudioPauseButton } from '@/components/studio/StudioPauseButton';
import { StarsBackground } from '@/components/ui/stars';

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
  const [isPaused, setIsPaused] = useState(false);
  
  const handleResetCamera = () => {
    // Trigger a camera reset - this will be handled by the CRDViewer component
    window.dispatchEvent(new CustomEvent('crd-reset-camera'));
  };

  const handleTogglePause = () => {
    setIsPaused(prev => !prev);
  };

  return (
    <div className="relative w-full overflow-hidden bg-crd-darkest">
      {/* Hero Content Section - Reduced height */}
      <div className="relative z-10 min-h-[80vh] flex flex-col justify-center text-center px-4 sm:px-6 lg:px-8 pt-[calc(var(--navbar-height)+40px)] pb-16">
        {/* Label */}
        <div className="mb-4 gradient-text-green-blue-purple font-bold tracking-wider text-sm uppercase">
          CUT, CRAFT & CREATE DIGITALLY
        </div>
        
        {/* Main Heading */}
        <div className="mb-8">
          <h1 className="leading-tight text-crd-white drop-shadow-lg">
            <div className="flex justify-center items-center mb-2 text-4xl md:text-5xl lg:text-6xl">
              <span className="text-gray-400 font-light">From <span className="paper-scraps">paper scraps</span> and <span className="cardboard-text">cardboard</span> to</span>
            </div>
           <div className="flex justify-center items-center text-5xl md:text-6xl lg:text-7xl">
             <span className="font-bold">
               <PixelDigital className="inline">digital</PixelDigital>
               <span className="text-white"> art that comes alive!</span>
             </span>
           </div>
         </h1>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
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
      </div>

      {/* 3D Interactive Section */}
      <div className="relative h-[60vh] bg-gradient-to-b from-crd-darkest to-black">
        <StarsBackground className="absolute inset-0">
          <FloatingCard3D 
            isPaused={isPaused}
            onTogglePause={handleTogglePause}
            showPauseButton={false}
          />
        </StarsBackground>
        
        {/* Reset Button */}
        <StudioResetButton onReset={handleResetCamera} />
        
        {/* Pause Button */}
        <StudioPauseButton 
          isPaused={isPaused} 
          onTogglePause={handleTogglePause} 
        />
        
        {/* Optional overlay text for 3D section */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-crd-white/60">
            <p className="text-lg mb-2">Interactive 3D Card Preview</p>
            <p className="text-sm">Click and drag to explore • Single click card to pause • Double click to flip</p>
          </div>
        </div>
      </div>
    </div>
  );
};
