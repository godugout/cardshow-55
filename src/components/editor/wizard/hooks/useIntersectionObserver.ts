
import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  rootMargin?: string;
}

export const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = '50px'
}: UseIntersectionObserverProps = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // PHASE 3: Single optimized intersection observer with proper cleanup
    let timeoutId: NodeJS.Timeout;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isCurrentlyIntersecting = entry.isIntersecting;
        
        // Clear any pending updates
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        // Debounced state updates with cleanup
        timeoutId = setTimeout(() => {
          setIsIntersecting(isCurrentlyIntersecting);
          
          if (isCurrentlyIntersecting && !hasIntersected) {
            setHasIntersected(true);
          }
        }, 150); // Slightly longer debounce for stability
      },
      {
        threshold,
        rootMargin
      }
    );

    const currentTarget = targetRef.current;
    if (currentTarget) {
      try {
        observer.observe(currentTarget);
      } catch (error) {
        console.warn('Intersection observer failed:', error);
      }
    }

    return () => {
      // Clear any pending timeouts
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      if (currentTarget) {
        try {
          observer.unobserve(currentTarget);
        } catch (error) {
          console.warn('Failed to unobserve:', error);
        }
      }
      
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return { targetRef, isIntersecting, hasIntersected };
};
