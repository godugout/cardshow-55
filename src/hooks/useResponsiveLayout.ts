
import { useState, useEffect } from 'react';

type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints: Record<BreakpointKey, number> = {
  xs: 0,
  sm: 640,
  md: 768, 
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const useResponsiveLayout = () => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<BreakpointKey>('lg');
  const [windowSize, setWindowSize] = useState({ width: 1024, height: 768 }); // Default fallback
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    const updateBreakpoint = () => {
      try {
        const width = window.innerWidth || 1024; // Fallback width
        const height = window.innerHeight || 768; // Fallback height
        
        setWindowSize({ width, height });
        
        if (width >= breakpoints['2xl']) setCurrentBreakpoint('2xl');
        else if (width >= breakpoints.xl) setCurrentBreakpoint('xl');
        else if (width >= breakpoints.lg) setCurrentBreakpoint('lg');
        else if (width >= breakpoints.md) setCurrentBreakpoint('md');
        else if (width >= breakpoints.sm) setCurrentBreakpoint('sm');
        else setCurrentBreakpoint('xs');
        
        if (!isInitialized) {
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error updating breakpoint:', error);
        // Use safe defaults if window is not available
        setCurrentBreakpoint('lg');
        setWindowSize({ width: 1024, height: 768 });
        setIsInitialized(true);
      }
    };
    
    // Initial call
    updateBreakpoint();
    
    // Add event listener with error handling
    const handleResize = () => {
      try {
        updateBreakpoint();
      } catch (error) {
        console.error('Error handling resize:', error);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      try {
        window.removeEventListener('resize', handleResize);
      } catch (error) {
        console.error('Error removing resize listener:', error);
      }
    };
  }, [isInitialized]);
  
  return {
    currentBreakpoint,
    windowSize,
    isInitialized,
    isMobile: ['xs', 'sm'].includes(currentBreakpoint),
    isTablet: currentBreakpoint === 'md',
    isDesktop: ['lg', 'xl', '2xl'].includes(currentBreakpoint),
    isSmallMobile: currentBreakpoint === 'xs',
    isMediumMobile: currentBreakpoint === 'sm',
    containerPadding: currentBreakpoint === 'xs' ? 'px-4' : 
                     currentBreakpoint === 'sm' ? 'px-5' : 'px-6',
    // Touch-friendly spacing for mobile
    touchSpacing: currentBreakpoint === 'xs' ? 'gap-3' :
                  currentBreakpoint === 'sm' ? 'gap-4' : 'gap-6',
    // Minimum touch target size (44px iOS, 48px Android)
    minTouchTarget: 'min-h-[44px] min-w-[44px]',
  };
};
