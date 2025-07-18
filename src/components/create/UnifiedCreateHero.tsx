
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useResponsiveBreakpoints } from '@/hooks/useResponsiveBreakpoints';
import { ResponsiveCreate3DLayout } from './ResponsiveCreate3DLayout';
import { CRDButton } from '@/components/ui/CRDButton';

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
    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 text-center max-w-4xl mx-auto">
      <span className="text-white">From paper scraps</span>
      <br />
      <span className="text-white">and cardboard to</span>
      <br />
      <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        digital art that
      </span>
      <br />
      <span className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
        comes alive
      </span>
    </h1>
  );

  // Render standard hero text (desktop and mobile)
  const renderStandardHeroText = () => (
    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 text-center max-w-4xl mx-auto">
      <span className="text-white">From paper scraps and cardboard to </span>
      <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        digital art that 
      </span>
      <span className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
        comes alive
      </span>
    </h1>
  );

  return (
    <>
      {isShortScreen ? (
        // Short screen layout - Compact design for limited vertical space
        <div className="relative w-full h-screen overflow-hidden">
          {/* Full Screen 3D Background Layer */}
          <ResponsiveCreate3DLayout
            isPaused={isPaused}
            onTogglePause={handleTogglePause}
            onReset={handleReset}
            className="fixed inset-0 z-0"
          />

          {/* Overlay Content Layer - Positioned for short screens */}
          <div className="relative z-10 h-full flex flex-col">
            {/* Top Section - Hero Content */}
            <div className="flex-1 flex items-center justify-center px-6">
              <div className="text-center space-y-4 max-w-4xl mx-auto">
                {/* Hero Text */}
                {isTablet ? renderTabletHeroText() : renderStandardHeroText()}
                
                {/* Subtitle */}
                <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
                  Transform your creative vision into stunning digital trading cards with our advanced AI-powered design tools.
                </p>
              </div>
            </div>

            {/* Bottom Section - Action Buttons */}
            <div className="flex-shrink-0 pb-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-6">
                {/* Primary CTA */}
                <Link to="/create/editor" className="w-full sm:w-auto">
                  <CRDButton 
                    variant="primary" 
                    size="lg"
                    className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-2xl"
                    style={{ boxShadow: '0 8px 32px rgba(59, 130, 246, 0.5)' }}
                  >
                    Start Creating
                  </CRDButton>
                </Link>

                {/* Secondary CTA */}
                <Link to="/templates" className="w-full sm:w-auto">
                  <CRDButton 
                    variant="secondary" 
                    size="lg"
                    className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all duration-200 transform hover:scale-105"
                    style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}
                  >
                    Browse Templates
                  </CRDButton>
                </Link>
              </div>
              
              {/* Animated Tagline */}
              <div className="text-center mt-6 px-6">
                <p className="text-sm text-gray-400 animate-pulse">
                  ✨ Where imagination meets technology
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Normal tall screen layout - No changes
        <div className="relative w-full min-h-screen">
          {/* Full Screen 3D Background Layer */}
          <ResponsiveCreate3DLayout
            isPaused={isPaused}
            onTogglePause={handleTogglePause}
            onReset={handleReset}
            className="fixed inset-0 z-0"
          />

          {/* Overlay Content Layer - Centered for normal screens */}
          <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
            <div className="text-center space-y-8 max-w-6xl mx-auto">
              {/* Hero Text */}
              {isTablet ? renderTabletHeroText() : renderStandardHeroText()}
              
              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Transform your creative vision into stunning digital trading cards with our advanced AI-powered design tools.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                {/* Primary CTA */}
                <Link to="/create/editor">
                  <CRDButton 
                    variant="primary" 
                    size="lg"
                    className="px-12 py-6 text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-110 transition-all duration-300 shadow-2xl"
                    style={{ boxShadow: '0 12px 48px rgba(59, 130, 246, 0.6)' }}
                  >
                    Start Creating
                  </CRDButton>
                </Link>

                {/* Secondary CTA */}
                <Link to="/templates">
                  <CRDButton 
                    variant="secondary" 
                    size="lg"
                    className="px-12 py-6 text-xl font-semibold bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all duration-300 transform hover:scale-110"
                    style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}
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
