
import { useCallback } from 'react';
import { useEnhancedMobileGestures } from './useEnhancedMobileGestures';
import { useMouseGestures } from './useMouseGestures';
import { useIsMobile } from '@/hooks/use-mobile';
import type { EnhancedGestureCallbacks } from './types';

export const useHybridGestures = (callbacks: EnhancedGestureCallbacks) => {
  const isMobile = useIsMobile();

  // Always call both hooks to follow Rules of Hooks
  const mobileGestures = useEnhancedMobileGestures(callbacks);
  const mouseGestures = useMouseGestures(callbacks);

  // Return appropriate handlers based on device type
  if (isMobile) {
    return {
      gestureHandlers: mobileGestures.touchHandlers,
      isActive: mobileGestures.isActive,
      hasMomentum: mobileGestures.hasMomentum
    };
  } else {
    return {
      gestureHandlers: mouseGestures.mouseHandlers,
      isActive: mouseGestures.isActive,
      hasMomentum: false
    };
  }
};
