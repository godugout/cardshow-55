import { useCallback, useRef, useMemo } from 'react';

interface PerformanceOptimizerResult {
  throttle: <T extends (...args: any[]) => any>(fn: T, delay: number) => T;
  debounce: <T extends (...args: any[]) => any>(fn: T, delay: number) => T;
  memoize: <T extends (...args: any[]) => any>(fn: T) => T;
}

export const usePerformanceOptimizer = (): PerformanceOptimizerResult => {
  const throttleRef = useRef<{ [key: string]: number }>({});
  const debounceRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const memoRef = useRef<{ [key: string]: { args: any[]; result: any } }>({});

  const throttle = useCallback(<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
  ): T => {
    const key = fn.toString();
    
    return ((...args: any[]) => {
      const now = Date.now();
      if (!throttleRef.current[key] || now - throttleRef.current[key] >= delay) {
        throttleRef.current[key] = now;
        return fn(...args);
      }
    }) as T;
  }, []);

  const debounce = useCallback(<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
  ): T => {
    const key = fn.toString();
    
    return ((...args: any[]) => {
      if (debounceRef.current[key]) {
        clearTimeout(debounceRef.current[key]);
      }
      
      debounceRef.current[key] = setTimeout(() => {
        fn(...args);
      }, delay);
    }) as T;
  }, []);

  const memoize = useCallback(<T extends (...args: any[]) => any>(fn: T): T => {
    const key = fn.toString();
    
    return ((...args: any[]) => {
      const cache = memoRef.current[key];
      
      if (cache && JSON.stringify(cache.args) === JSON.stringify(args)) {
        return cache.result;
      }
      
      const result = fn(...args);
      memoRef.current[key] = { args, result };
      return result;
    }) as T;
  }, []);

  return useMemo(() => ({
    throttle,
    debounce,
    memoize
  }), [throttle, debounce, memoize]);
};