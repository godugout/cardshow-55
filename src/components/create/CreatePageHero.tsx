
import React from 'react';
import { StandardHero } from '@/components/shared/StandardHero';
import { Link } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system/Button';
import { PixelDigital } from '@/components/ui/PixelDigital';
import { FloatingCard3D } from '@/components/ui/FloatingCard3D';

const AnimatedTagline: React.FC = () => {
  return (
    <div className="mt-12 mb-8">
      <p className="font-caveat text-6xl md:text-8xl italic text-center text-crd-orange animate-fade-in">
        "No glue needed."
      </p>
    </div>
  );
};

export const CreatePageHero: React.FC = () => {
  return (
    <>
      {/* Hero Content Section - Full height on desktop, optimized for mobile */}
      <div className="relative w-screen -mx-[50vw] left-1/2 overflow-hidden min-h-screen lg:h-screen">
        {/* 3D Background - Hidden on medium and mobile, shown only on desktop */}
        <div className="absolute inset-0 z-0 h-full hidden lg:block">
          <FloatingCard3D />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center pb-8 pt-[calc(var(--navbar-height)+60px)] md:pt-[calc(var(--navbar-height)+100px)] lg:pt-[calc(var(--navbar-height)+100px)] min-h-screen lg:h-auto flex flex-col justify-center">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            {/* Label */}
            <div className="mb-6 gradient-text-green-blue-purple font-bold tracking-wider text-sm uppercase">
              CUT, CRAFT & CREATE DIGITALLY
            </div>
            
            {/* Main Heading - Responsive text sizes */}
            <div className="mb-8">
               <h1 className="leading-tight text-crd-white drop-shadow-lg">
                 <div className="flex justify-center items-center mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                   <span className="text-gray-400 font-light text-center">From paper scraps and cardboard to</span>
                 </div>
                 <div className="flex justify-center items-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                   <span className="font-bold text-center">
                     <PixelDigital className="inline">digital</PixelDigital>
                     <span className="text-white"> art that comes alive!</span>
                   </span>
                 </div>
               </h1>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 lg:my-12">
              <Link to="/create/new">
                <CRDButton 
                  size="lg" 
                  variant="primary"
                  className="min-w-[200px] w-full sm:w-auto"
                >
                  Start Creating
                </CRDButton>
              </Link>
              <Link to="/templates">
                <CRDButton 
                  variant="outline" 
                  size="lg" 
                  className="min-w-[200px] w-full sm:w-auto"
                >
                  Browse Templates
                </CRDButton>
              </Link>
            </div>
            
            {/* Animated Tagline */}
            <AnimatedTagline />
          </div>
        </div>
      </div>

      {/* 3D Interactive Section - Below the fold for medium and mobile */}
      <div className="relative w-screen -mx-[50vw] left-1/2 overflow-hidden h-screen lg:hidden">
        <FloatingCard3D />
      </div>
    </>
  );
};
