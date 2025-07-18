
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system/Button';
import { PixelDigital } from '@/components/ui/PixelDigital';
import { FloatingCard3D } from '@/components/ui/FloatingCard3D';
import { StudioPauseButton } from '@/components/studio/StudioPauseButton';
import { StudioResetButton } from '@/components/studio/StudioResetButton';
import { StarsBackground } from '@/components/ui/stars';

const DesktopAnimatedTagline: React.FC = () => {
  return (
    <div className="mt-12 mb-8">
      <p className="font-caveat text-4xl md:text-5xl italic text-center text-crd-orange animate-fade-in">
        "No glue needed."
      </p>
    </div>
  );
};

export const DesktopCreateHero: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [cardPosition, setCardPosition] = useState({ top: '50%' });

  useEffect(() => {
    const calculateCardPosition = () => {
      const viewportHeight = window.innerHeight;
      const navbarHeight = 80; // Approximate navbar height
      const taglineElement = document.querySelector('.font-caveat');
      
      if (taglineElement) {
        const taglineRect = taglineElement.getBoundingClientRect();
        const taglineBottom = taglineRect.bottom;
        const availableSpace = viewportHeight - taglineBottom;
        const cardTop = taglineBottom + (availableSpace / 2);
        
        setCardPosition({ 
          top: `${Math.max(cardTop, taglineBottom + 100)}px` 
        });
      } else {
        // Fallback positioning
        setCardPosition({ top: `${viewportHeight * 0.65}px` });
      }
    };

    // Calculate position on mount and resize
    calculateCardPosition();
    window.addEventListener('resize', calculateCardPosition);
    
    // Recalculate after a short delay to ensure DOM is ready
    setTimeout(calculateCardPosition, 100);

    return () => window.removeEventListener('resize', calculateCardPosition);
  }, []);

  const handleTogglePause = () => {
    setIsPaused(prev => !prev);
  };

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div className="relative w-full overflow-hidden h-screen bg-crd-darkest">
      {/* 3D Background with Dynamic Positioning */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          '--card-top': cardPosition.top,
        } as React.CSSProperties}
      >
        <StarsBackground>
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 transition-all duration-500"
            style={{ top: cardPosition.top, transform: 'translateX(-50%) translateY(-50%)' }}
          >
            <FloatingCard3D 
              isPaused={isPaused}
              onTogglePause={handleTogglePause}
              showPauseButton={false}
            />
          </div>
        </StarsBackground>
      </div>

      {/* Control Buttons - Lower Right */}
      <div className="fixed bottom-6 right-6 z-50 flex gap-3">
        <StudioResetButton onReset={handleReset} />
        <StudioPauseButton 
          isPaused={isPaused} 
          onTogglePause={handleTogglePause} 
        />
      </div>
      
      {/* Hero Content Overlay */}
      <div className="relative z-10 text-center pb-4 pt-[calc(var(--navbar-height)+100px)] pointer-events-none">
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center my-12 pointer-events-auto">
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
          <DesktopAnimatedTagline />
        </div>
      </div>
    </div>
  );
};
