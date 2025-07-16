import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

interface AnimationState {
  id: string;
  priority: number;
  element: HTMLElement | null;
  type: 'text' | 'card' | 'background' | 'transition';
  isActive: boolean;
}

interface AnimationBudgetContextType {
  requestAnimation: (id: string, priority: number, element: HTMLElement | null, type: AnimationState['type']) => boolean;
  releaseAnimation: (id: string) => void;
  pauseAllAnimations: () => void;
  resumeAllAnimations: () => void;
  getActiveCount: () => number;
  isLowPerformanceMode: boolean;
  setLowPerformanceMode: (enabled: boolean) => void;
}

const AnimationBudgetContext = createContext<AnimationBudgetContextType | null>(null);

interface AnimationBudgetProviderProps {
  children: React.ReactNode;
  maxConcurrentAnimations?: number;
  respectReducedMotion?: boolean;
}

export const AnimationBudgetProvider: React.FC<AnimationBudgetProviderProps> = ({
  children,
  maxConcurrentAnimations = 3,
  respectReducedMotion = true
}) => {
  const [animations, setAnimations] = useState<Map<string, AnimationState>>(new Map());
  const [isLowPerformanceMode, setIsLowPerformanceMode] = useState(false);
  const [globalPaused, setGlobalPaused] = useState(false);
  const animationQueue = useRef<AnimationState[]>([]);
  
  // Check for reduced motion preference
  const prefersReducedMotion = respectReducedMotion && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Effective animation budget (reduced in low performance mode or reduced motion)
  const effectiveMaxAnimations = prefersReducedMotion ? 1 : 
    isLowPerformanceMode ? Math.max(1, Math.floor(maxConcurrentAnimations / 2)) : 
    maxConcurrentAnimations;

  const requestAnimation = useCallback((
    id: string, 
    priority: number, 
    element: HTMLElement | null, 
    type: AnimationState['type']
  ): boolean => {
    if (prefersReducedMotion && type !== 'transition') {
      return false; // Block non-essential animations
    }

    const newAnimation: AnimationState = { id, priority, element, type, isActive: false };
    
    setAnimations(prev => {
      const newMap = new Map(prev);
      newMap.set(id, newAnimation);
      
      // Sort by priority (higher priority first)
      const sorted = Array.from(newMap.values())
        .sort((a, b) => b.priority - a.priority);
      
      // Activate up to the budget limit
      let activeCount = 0;
      sorted.forEach(anim => {
        if (activeCount < effectiveMaxAnimations) {
          anim.isActive = true;
          activeCount++;
        } else {
          anim.isActive = false;
          // Add to queue if not active
          if (!animationQueue.current.find(q => q.id === anim.id)) {
            animationQueue.current.push(anim);
          }
        }
        newMap.set(anim.id, anim);
      });
      
      return newMap;
    });

    return true;
  }, [effectiveMaxAnimations, prefersReducedMotion]);

  const releaseAnimation = useCallback((id: string) => {
    setAnimations(prev => {
      const newMap = new Map(prev);
      newMap.delete(id);
      
      // Remove from queue
      animationQueue.current = animationQueue.current.filter(anim => anim.id !== id);
      
      // Try to activate next queued animation
      if (animationQueue.current.length > 0) {
        const nextAnimation = animationQueue.current.shift()!;
        if (newMap.has(nextAnimation.id)) {
          const anim = newMap.get(nextAnimation.id)!;
          anim.isActive = true;
          newMap.set(nextAnimation.id, anim);
        }
      }
      
      return newMap;
    });
  }, []);

  const pauseAllAnimations = useCallback(() => {
    setGlobalPaused(true);
    animations.forEach(anim => {
      if (anim.element) {
        anim.element.style.animationPlayState = 'paused';
      }
    });
  }, [animations]);

  const resumeAllAnimations = useCallback(() => {
    setGlobalPaused(false);
    animations.forEach(anim => {
      if (anim.element && anim.isActive) {
        anim.element.style.animationPlayState = 'running';
      }
    });
  }, [animations]);

  const getActiveCount = useCallback(() => {
    return Array.from(animations.values()).filter(anim => anim.isActive).length;
  }, [animations]);

  // Auto-detect performance issues
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const checkPerformance = () => {
      const currentTime = performance.now();
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        const fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        
        // Enable low performance mode if FPS drops below 45
        if (fps < 45 && !isLowPerformanceMode) {
          setIsLowPerformanceMode(true);
          console.log('Animation Budget: Enabling low performance mode due to low FPS');
        }
        // Disable if FPS is consistently good
        else if (fps > 55 && isLowPerformanceMode) {
          setIsLowPerformanceMode(false);
          console.log('Animation Budget: Disabling low performance mode due to good FPS');
        }
      }
      
      requestAnimationFrame(checkPerformance);
    };
    
    const rafId = requestAnimationFrame(checkPerformance);
    return () => cancelAnimationFrame(rafId);
  }, [isLowPerformanceMode]);

  const contextValue: AnimationBudgetContextType = {
    requestAnimation,
    releaseAnimation,
    pauseAllAnimations,
    resumeAllAnimations,
    getActiveCount,
    isLowPerformanceMode,
    setLowPerformanceMode: setIsLowPerformanceMode
  };

  return (
    <AnimationBudgetContext.Provider value={contextValue}>
      {children}
    </AnimationBudgetContext.Provider>
  );
};

export const useAnimationBudget = () => {
  const context = useContext(AnimationBudgetContext);
  if (!context) {
    throw new Error('useAnimationBudget must be used within AnimationBudgetProvider');
  }
  return context;
};

// Hook for individual animations
export const useControlledAnimation = (
  id: string,
  priority: number = 1,
  type: AnimationState['type'] = 'transition',
  dependencies: any[] = []
) => {
  const { requestAnimation, releaseAnimation } = useAnimationBudget();
  const elementRef = useRef<HTMLElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (elementRef.current) {
      const granted = requestAnimation(id, priority, elementRef.current, type);
      setIsActive(granted);
    }

    return () => {
      releaseAnimation(id);
    };
  }, [id, priority, type, requestAnimation, releaseAnimation, ...dependencies]);

  return { elementRef, isActive };
};