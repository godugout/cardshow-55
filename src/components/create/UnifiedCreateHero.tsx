
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useResponsiveBreakpoints } from '@/hooks/useResponsiveBreakpoints';
import { ResponsiveCreate3DLayout } from './ResponsiveCreate3DLayout';
import { CRDButton } from '@/components/ui/design-system';
import { PixelDigital } from '@/components/ui/PixelDigital';

export const UnifiedCreateHero: React.FC = () => {
  const { isShortScreen, isMobile, isTablet } = useResponsiveBreakpoints();
  const [isPaused, setIsPaused] = useState(false);

  const handleTogglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsPaused(false);
    console.log('Reset 3D animation');
  };

  // Render tablet-specific hero text with line breaks
  const renderTabletHeroText = () => (
    <div className="text-center space-y-4">
      {/* Intro Line */}
      <p className="text-sm md:text-base lg:text-lg gradient-text-green-blue-purple font-medium tracking-wider uppercase">
        CUT, CRAFT & CREATE DIGITALLY
      </p>
      
      {/* Main Title */}
      <h1 className="text-3xl md:text-5xl lg:text-6xl leading-tight mb-6 text-center max-w-4xl mx-auto text-gray-400 font-light">
        <span>From <span className="paper-scraps">paper scraps</span></span>
        <br />
        <span>and <span className="cardboard-text">cardboard</span> to</span>
        <br />
        <span className="font-bold">
          <PixelDigital className="inline">digital</PixelDigital> <PixelDigital className="inline">art</PixelDigital> that comes alive!
        </span>
      </h1>
    </div>
  );

  // Render standard hero text (desktop and mobile)
  const renderStandardHeroText = () => (
    <div className="text-center space-y-4">
      {/* Intro Line */}
      <p className="text-sm md:text-base lg:text-lg gradient-text-green-blue-purple font-medium tracking-wider uppercase">
        CUT, CRAFT & CREATE DIGITALLY
      </p>
      
      {/* Main Title */}
      <h1 className="text-3xl md:text-5xl lg:text-6xl leading-tight mb-6 text-center max-w-4xl mx-auto text-gray-400 font-light">
        <span>From <span className="paper-scraps">paper scraps</span> and <span className="cardboard-text">cardboard</span> to</span>
        <br />
        <span className="font-bold">
          <PixelDigital className="inline">digital</PixelDigital> <PixelDigital className="inline">art</PixelDigital> that comes alive!
        </span>
      </h1>
    </div>
  );

  return (
    <>
      {isShortScreen ? (
        // Short screen layout - Positioned below sun with compact spacing
        <div className="relative w-full h-screen overflow-hidden">
          {/* Full Screen 3D Background Layer */}
          <ResponsiveCreate3DLayout
            isPaused={isPaused}
            onTogglePause={handleTogglePause}
            onReset={handleReset}
            className="fixed inset-0 z-0"
          />

          {/* Overlay Content Layer - Positioned below sun for short screens */}
          <div className="relative z-10 h-full flex flex-col pointer-events-none">
            {/* Top Section - Hero Content positioned below sun */}
            <div className="pt-20 px-6 pointer-events-none">
              <div className="text-center space-y-4 max-w-4xl mx-auto">
                {/* Hero Text */}
                {isTablet ? renderTabletHeroText() : renderStandardHeroText()}
                
                {/* Subtitle */}
                <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Transform your creative vision into stunning digital trading cards with our advanced AI-powered design tools.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pointer-events-auto">
                  {/* Primary CTA - Updated to use create variant */}
                  <Link to="/create/editor" className="w-full sm:w-auto">
                    <CRDButton 
                      variant="create" 
                      size="lg"
                      className="w-full sm:w-auto px-8 py-4 text-lg font-semibold"
                    >
                      Start Creating
                    </CRDButton>
                  </Link>

                  {/* Secondary CTA - Updated to use glass variant */}
                  <Link to="/templates" className="w-full sm:w-auto">
                    <CRDButton 
                      variant="glass" 
                      size="lg"
                      className="w-full sm:w-auto px-8 py-4 text-lg font-semibold"
                    >
                      Browse Templates
                    </CRDButton>
                  </Link>
                </div>
                
                {/* Animated Tagline */}
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-400 animate-pulse">
                    ✨ Where imagination meets technology
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Normal tall screen layout - Positioned below sun instead of centered
        <div className="relative w-full min-h-screen">
          {/* Full Screen 3D Background Layer */}
          <ResponsiveCreate3DLayout
            isPaused={isPaused}
            onTogglePause={handleTogglePause}
            onReset={handleReset}
            className="fixed inset-0 z-0"
          />

          {/* Overlay Content Layer - Positioned below sun */}
          <div className="relative z-10 min-h-screen pt-20 md:pt-24 lg:pt-28 px-6 pointer-events-none">
            <div className="text-center space-y-8 max-w-6xl mx-auto">
              {/* Hero Text */}
              {isTablet ? renderTabletHeroText() : renderStandardHeroText()}
              
              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Transform your creative vision into stunning digital trading cards with our advanced AI-powered design tools.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pointer-events-auto">
                {/* Primary CTA - Updated to use create variant */}
                <Link to="/create/editor">
                  <CRDButton 
                    variant="create" 
                    size="xl"
                    className="px-12 py-6 text-xl font-bold"
                  >
                    Start Creating
                  </CRDButton>
                </Link>

                {/* Secondary CTA - Updated to use glass variant */}
                <Link to="/templates">
                  <CRDButton 
                    variant="glass" 
                    size="xl"
                    className="px-12 py-6 text-xl font-semibold"
                  >
                    Browse Templates
                  </CRDButton>
                </Link>
              </div>
              
              {/* Animated Tagline */}
              <div className="mt-12">
                <p className="text-lg text-gray-400 animate-pulse">
                  ✨ Where imagination meets technology
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
