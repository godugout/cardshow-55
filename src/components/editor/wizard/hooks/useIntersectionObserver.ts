
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
    // SIMPLIFIED INTERSECTION OBSERVER - prevent over-triggering
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isCurrentlyIntersecting = entry.isIntersecting;
        
        // Add debouncing to prevent rapid state changes
        setTimeout(() => {
          setIsIntersecting(isCurrentlyIntersecting);
          
          if (isCurrentlyIntersecting && !hasIntersected) {
            setHasIntersected(true);
          }
        }, 100);
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
      if (currentTarget) {
        try {
          observer.unobserve(currentTarget);
        } catch (error) {
          console.warn('Failed to unobserve:', error);
        }
      }
    };
  }, [threshold, rootMargin]);

  return { targetRef, isIntersecting, hasIntersected };
};
