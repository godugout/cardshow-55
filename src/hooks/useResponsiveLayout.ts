
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
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({ width, height });
      
      if (width >= breakpoints['2xl']) setCurrentBreakpoint('2xl');
      else if (width >= breakpoints.xl) setCurrentBreakpoint('xl');
      else if (width >= breakpoints.lg) setCurrentBreakpoint('lg');
      else if (width >= breakpoints.md) setCurrentBreakpoint('md');
      else if (width >= breakpoints.sm) setCurrentBreakpoint('sm');
      else setCurrentBreakpoint('xs');
    };
    
    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);
  
  return {
    currentBreakpoint,
    windowSize,
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
