import React, { createContext, useContext, ReactNode } from 'react';
import { usePerformanceOptimizer } from '@/hooks/usePerformanceOptimizer';

interface AnimationContextType {
  shouldAnimate: boolean;
  shouldUse3D: boolean;
  shouldUseParticles: boolean;
  animationDuration: number;
  imageQuality: 'low' | 'medium' | 'high';
  maxConcurrentAnimations: number;
}

const AnimationContext = createContext<AnimationContextType>({
  shouldAnimate: true,
  shouldUse3D: true,
  shouldUseParticles: true,
  animationDuration: 1,
  imageQuality: 'high',
  maxConcurrentAnimations: 10
});

export const useAdaptiveAnimations = () => useContext(AnimationContext);

interface Props {
  children: ReactNode;
}

export const AdaptiveAnimationProvider: React.FC<Props> = ({ children }) => {
  const { settings, metrics } = usePerformanceOptimizer();

  // Calculate animation duration based on performance
  const getAnimationDuration = () => {
    if (metrics.fps < 30) return 0.5; // Very fast animations
    if (metrics.fps < 45) return 0.7; // Fast animations
    if (metrics.fps < 55) return 0.85; // Slightly fast
    return 1; // Normal speed
  };

  const contextValue: AnimationContextType = {
    shouldAnimate: settings.animationsEnabled,
    shouldUse3D: settings.enable3DEffects,
    shouldUseParticles: settings.enableParticleEffects,
    animationDuration: getAnimationDuration(),
    imageQuality: settings.imageQuality,
    maxConcurrentAnimations: settings.maxConcurrentAnimations
  };

  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  );
};

// Higher-order component for conditional animations
export const withPerformanceOptimization = <P extends object>(
  Component: React.ComponentType<P>,
  FallbackComponent?: React.ComponentType<P>
) => {
  return (props: P) => {
    const { shouldAnimate } = useAdaptiveAnimations();
    
    if (!shouldAnimate && FallbackComponent) {
      return <FallbackComponent {...props} />;
    }
    
    return <Component {...props} />;
  };
};

// Adaptive Image component
interface AdaptiveImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export const AdaptiveImage: React.FC<AdaptiveImageProps> = ({ 
  src, 
  alt, 
  className, 
  fallbackSrc 
}) => {
  const { imageQuality } = useAdaptiveAnimations();
  
  // Generate different quality URLs based on performance
  const getOptimizedSrc = () => {
    if (imageQuality === 'low' && fallbackSrc) {
      return fallbackSrc;
    }
    
    // Add quality parameters if your CDN supports them
    if (src.includes('supabase')) {
      const separator = src.includes('?') ? '&' : '?';
      const quality = imageQuality === 'high' ? 90 : imageQuality === 'medium' ? 70 : 50;
      return `${src}${separator}quality=${quality}&format=webp`;
    }
    
    return src;
  };

  return (
    <img 
      src={getOptimizedSrc()}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
};