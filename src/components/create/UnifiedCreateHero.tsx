
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system/Button';
import { PixelDigital } from '@/components/ui/PixelDigital';
import { ResponsiveCreate3DLayout } from './ResponsiveCreate3DLayout';
import { useResponsiveBreakpoints } from '@/hooks/useResponsiveBreakpoints';

export const UnifiedCreateHero: React.FC = () => {
  const { isMobile, deviceType, isShortScreen } = useResponsiveBreakpoints();
  const [isPaused, setIsPaused] = useState(false);

  const handleTogglePause = () => {
    setIsPaused(prev => !prev);
  };

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div className="relative w-full">
      {/* For short screens, create a scrollable layout */}
      {isShortScreen ? (
        <>
          {/* Hero Section */}
          <div className="relative w-full min-h-screen">
            {/* Stars Background Only */}
            <div className="fixed inset-0 z-0 bg-crd-darkest">
              <div className="absolute inset-0 opacity-80 stars-background"></div>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 pt-[calc(var(--navbar-height)+3rem)] pb-8 min-h-screen flex flex-col justify-start">
              <div className="max-w-4xl mx-auto">
                {/* Label */}
                <div className="mb-4 gradient-text-green-blue-purple font-bold tracking-wider text-xs sm:text-sm uppercase">
                  CUT, CRAFT & CREATE DIGITALLY
                </div>
                
                {/* Main Heading */}
                <div className="mb-6">
                  <h1 className="leading-tight text-crd-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.6)' }}>
                    <div className={`flex justify-center items-center mb-2 ${
                      isMobile ? 'text-base' : 'text-3xl md:text-5xl lg:text-6xl'
                    }`}>
                      <span className="text-gray-400 font-light text-center">
                        From <span className="paper-scraps">paper scraps</span>
                        {isMobile ? <br /> : ' '}
                        and <span className="cardboard-text">cardboard</span> to
                      </span>
                    </div>
                    <div className={`flex justify-center items-center ${
                      isMobile ? 'text-xl mt-2' : 'text-4xl md:text-6xl lg:text-7xl'
                    }`}>
                      <span className="font-bold text-center">
                        <PixelDigital className="inline">digital</PixelDigital>
                        {isMobile ? <br /> : ' '}
                        <span className="text-white">art that comes alive!</span>
                      </span>
                    </div>
                  </h1>
                </div>
                
                {/* CTA Buttons */}
                <div className={`flex ${isMobile ? 'flex-col gap-2' : 'flex-col sm:flex-row gap-4'} justify-center my-6`}>
                  <Link to="/create/crd">
                    <CRDButton 
                      size={isMobile ? "default" : "lg"} 
                      variant="create"
                      className="min-w-[180px]"
                      style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}
                    >
                      Start Creating
                    </CRDButton>
                  </Link>
                  <Link to="/templates">
                    <CRDButton 
                      variant="outline" 
                      size={isMobile ? "default" : "lg"} 
                      className="min-w-[180px]"
                      style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}
                    >
                      Browse Templates
                    </CRDButton>
                  </Link>
                </div>
                
                {/* Animated Tagline */}
                <div className={`${isMobile ? 'mt-4 mb-6' : 'mt-8 mb-12'}`}>
                  <p 
                    className={`font-caveat italic text-center text-crd-orange animate-fade-in ${
                      isMobile ? 'text-lg' : 'text-2xl md:text-4xl'
                    }`}
                    style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
                  >
                    "No glue needed."
                  </p>
                </div>

                {/* Scroll indicator */}
                <div className="mt-8 flex justify-center">
                  <div className="animate-bounce">
                    <div className="w-6 h-10 border-2 border-crd-white rounded-full flex justify-center">
                      <div className="w-1 h-3 bg-crd-white rounded-full mt-2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3D Animation Section */}
          <div className="relative w-full min-h-screen">
            <ResponsiveCreate3DLayout
              isPaused={isPaused}
              onTogglePause={handleTogglePause}
              onReset={handleReset}
            />
          </div>
        </>
      ) : (
        /* Normal tall screen layout */
        <div className="relative w-full min-h-screen">
          {/* Full Screen 3D Background Layer */}
          <ResponsiveCreate3DLayout
            isPaused={isPaused}
            onTogglePause={handleTogglePause}
            onReset={handleReset}
          />

          {/* Hero Content Overlay - Transparent background to show stars */}
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 pt-[calc(var(--navbar-height)+3rem)] pb-32 min-h-screen flex flex-col justify-start">
            <div className="max-w-4xl mx-auto">
              {/* Label */}
              <div className="mb-4 gradient-text-green-blue-purple font-bold tracking-wider text-xs sm:text-sm uppercase">
                CUT, CRAFT & CREATE DIGITALLY
              </div>
              
              {/* Main Heading - Enhanced text shadows for readability over stars */}
              <div className="mb-6">
                <h1 className="leading-tight text-crd-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.6)' }}>
                  <div className={`flex justify-center items-center mb-2 ${
                    isMobile ? 'text-base' : 'text-3xl md:text-5xl lg:text-6xl'
                  }`}>
                    <span className="text-gray-400 font-light text-center">
                      From <span className="paper-scraps">paper scraps</span>
                      {isMobile ? <br /> : ' '}
                      and <span className="cardboard-text">cardboard</span> to
                    </span>
                  </div>
                  <div className={`flex justify-center items-center ${
                    isMobile ? 'text-xl mt-2' : 'text-4xl md:text-6xl lg:text-7xl'
                  }`}>
                    <span className="font-bold text-center">
                      <PixelDigital className="inline">digital</PixelDigital>
                      {isMobile ? <br /> : ' '}
                      <span className="text-white">art that comes alive!</span>
                    </span>
                  </div>
                </h1>
              </div>
              
              {/* CTA Buttons - Enhanced shadows for visibility */}
              <div className={`flex ${isMobile ? 'flex-col gap-2' : 'flex-col sm:flex-row gap-4'} justify-center my-6`}>
                <Link to="/create/crd">
                  <CRDButton 
                    size={isMobile ? "default" : "lg"} 
                    variant="create"
                    className="min-w-[180px]"
                    style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}
                  >
                    Start Creating
                  </CRDButton>
                </Link>
                <Link to="/templates">
                  <CRDButton 
                    variant="outline" 
                    size={isMobile ? "default" : "lg"} 
                    className="min-w-[180px]"
                    style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}
                  >
                    Browse Templates
                  </CRDButton>
                </Link>
              </div>
              
              {/* Animated Tagline - Enhanced shadow for readability */}
              <div className={`${isMobile ? 'mt-4 mb-6' : 'mt-8 mb-12'}`}>
                <p 
                  className={`font-caveat italic text-center text-crd-orange animate-fade-in ${
                    isMobile ? 'text-lg' : 'text-2xl md:text-4xl'
                  }`}
                  style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
                >
                  "No glue needed."
                </p>
              </div>
            </div>
          </div>

          {/* Device-specific UI hints */}
          {deviceType === 'desktop' && (
            <div className="fixed bottom-6 left-6 z-50 text-crd-lightGray text-sm" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
              <p>Interactive 3D Experience</p>
              <p className="text-xs">Drag to rotate • Scroll to zoom</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
