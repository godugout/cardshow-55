
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system/Button';
import { PixelDigital } from '@/components/ui/PixelDigital';
import { ResponsiveCreate3DLayout } from './ResponsiveCreate3DLayout';
import { useResponsiveBreakpoints } from '@/hooks/useResponsiveBreakpoints';
import { ChevronDown } from 'lucide-react';

export const UnifiedCreateHero: React.FC = () => {
  const { isMobile, deviceType, isShortScreen } = useResponsiveBreakpoints();
  const [isPaused, setIsPaused] = useState(false);

  const handleTogglePause = () => {
    setIsPaused(prev => !prev);
  };

  const handleReset = () => {
    window.location.reload();
  };

  const scrollToAnimation = () => {
    const animationSection = document.getElementById('animation-section');
    if (animationSection) {
      animationSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="relative w-full">
      {/* For short screens, create a scrollable layout with snap points */}
      {isShortScreen ? (
        <div className="scroll-snap-container">
          {/* Hero Section - First snap point */}
          <div id="hero-section" className="relative w-full min-h-screen snap-start">
            {/* Pure Stars Background Only - No 3D */}
            <div className="fixed inset-0 z-0 bg-crd-darkest">
              <div className="absolute inset-0 opacity-80 stars-background"></div>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 pt-[calc(var(--navbar-height)+2rem)] pb-8 min-h-screen flex flex-col justify-start">
              <div className="max-w-6xl mx-auto">
                {/* Label */}
                <div className="mb-4 gradient-text-green-blue-purple font-bold tracking-wider text-xs sm:text-sm uppercase">
                  CUT, CRAFT & CREATE DIGITALLY
                </div>
                
                {/* Main Heading - Improved layout for 2 lines */}
                <div className="mb-6">
                  <h1 className="leading-tight text-crd-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.6)' }}>
                    <div className={`flex justify-center items-center mb-2 ${
                      isMobile ? 'text-lg' : 'text-3xl md:text-5xl lg:text-6xl'
                    }`}>
                      <span className="text-gray-400 font-light text-center max-w-4xl">
                        From <span className="paper-scraps">paper scraps</span>
                        {' '}and <span className="cardboard-text">cardboard</span> to
                      </span>
                    </div>
                    <div className={`flex justify-center items-center ${
                      isMobile ? 'text-xl mt-2' : 'text-4xl md:text-6xl lg:text-7xl'
                    }`}>
                      <span className="font-bold text-center max-w-5xl">
                        <PixelDigital className="inline">digital</PixelDigital>
                        {' '}<span className="text-white">art that comes alive!</span>
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
              </div>

              {/* Enhanced Scroll Indicator - Clickable and prominent */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                <button 
                  onClick={scrollToAnimation}
                  className="group flex flex-col items-center text-crd-white hover:text-crd-blue transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-crd-blue focus:ring-opacity-50 rounded-lg p-4"
                  aria-label="Scroll to 3D animation"
                >
                  <div className="text-sm mb-2 opacity-90 group-hover:opacity-100 transition-opacity">
                    See the magic
                  </div>
                  <div className="animate-bounce-gentle">
                    <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center relative">
                      <div className="w-1 h-3 bg-current rounded-full mt-2 animate-scroll-dot"></div>
                    </div>
                    <ChevronDown className="w-6 h-6 mt-1 animate-pulse" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* 3D Animation Section - Second snap point with scroll resistance */}
          <div id="animation-section" className="relative w-full min-h-screen snap-start scroll-resistance">
            <ResponsiveCreate3DLayout
              isPaused={isPaused}
              onTogglePause={handleTogglePause}
              onReset={handleReset}
            />
            
            {/* Overlay hint for scroll resistance */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 text-crd-white text-center">
              <p className="text-sm opacity-70 bg-black bg-opacity-30 rounded-lg px-3 py-1">
                Drag with extra force to continue scrolling
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Normal tall screen layout - No changes */}
        <div className="relative w-full min-h-screen">
          {/* Full Screen 3D Background Layer */}
          <ResponsiveCreate3DLayout
            isPaused={isPaused}
            onTogglePause={handleTogglePause}
            onReset={handleReset}
          />

          {/* Hero Content Overlay */}
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 pt-[calc(var(--navbar-height)+2rem)] pb-32 min-h-screen flex flex-col justify-start">
            <div className="max-w-6xl mx-auto">
              {/* Label */}
              <div className="mb-4 gradient-text-green-blue-purple font-bold tracking-wider text-xs sm:text-sm uppercase">
                CUT, CRAFT & CREATE DIGITALLY
              </div>
              
              {/* Main Heading - Enhanced for better line breaks */}
              <div className="mb-6">
                <h1 className="leading-tight text-crd-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.6)' }}>
                  <div className={`flex justify-center items-center mb-2 ${
                    isMobile ? 'text-lg' : 'text-3xl md:text-5xl lg:text-6xl'
                  }`}>
                    <span className="text-gray-400 font-light text-center max-w-4xl">
                      From <span className="paper-scraps">paper scraps</span>
                      {' '}and <span className="cardboard-text">cardboard</span> to
                    </span>
                  </div>
                  <div className={`flex justify-center items-center ${
                    isMobile ? 'text-xl mt-2' : 'text-4xl md:text-6xl lg:text-7xl'
                  }`}>
                    <span className="font-bold text-center max-w-5xl">
                      <PixelDigital className="inline">digital</PixelDigital>
                      {' '}<span className="text-white">art that comes alive!</span>
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
