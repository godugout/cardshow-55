
import { useEffect, useRef } from 'react';
import type { CardData } from '@/types/card';
import type { EffectValues } from './useEnhancedCardEffects';

interface RenderingMetrics {
  renderStart: number;
  renderEnd: number;
  imageLoadTime?: number;
  effectsApplied: string[];
  performanceScore: number;
}

export const useCardRenderingDebugger = (
  card: CardData,
  effectValues: EffectValues,
  isEnabled: boolean = process.env.NODE_ENV === 'development'
) => {
  const metricsRef = useRef<RenderingMetrics | null>(null);
  const imageLoadStartRef = useRef<number>(0);

  // Track rendering start
  useEffect(() => {
    if (!isEnabled) return;
    
    metricsRef.current = {
      renderStart: performance.now(),
      renderEnd: 0,
      effectsApplied: Object.keys(effectValues).filter(key => 
        effectValues[key]?.intensity && 
        typeof effectValues[key].intensity === 'number' && 
        effectValues[key].intensity > 5
      ),
      performanceScore: 0
    };

    console.log('🎨 Card rendering started:', {
      cardId: card.id,
      cardTitle: card.title,
      hasImage: !!card.image_url,
      activeEffects: metricsRef.current.effectsApplied
    });
  }, [card.id, effectValues, isEnabled]);

  // Track image loading
  const trackImageLoad = (startTime: number, endTime: number) => {
    if (!isEnabled || !metricsRef.current) return;
    
    metricsRef.current.imageLoadTime = endTime - startTime;
    console.log('🖼️ Image loaded in:', metricsRef.current.imageLoadTime, 'ms');
  };

  // Track rendering completion
  const trackRenderComplete = () => {
    if (!isEnabled || !metricsRef.current) return;
    
    metricsRef.current.renderEnd = performance.now();
    const totalTime = metricsRef.current.renderEnd - metricsRef.current.renderStart;
    metricsRef.current.performanceScore = totalTime < 100 ? 100 : Math.max(0, 100 - (totalTime - 100) / 10);

    console.log('✅ Card rendering complete:', {
      totalTime: totalTime.toFixed(2) + 'ms',
      performanceScore: metricsRef.current.performanceScore.toFixed(1),
      metrics: metricsRef.current
    });
  };

  return {
    trackImageLoad,
    trackRenderComplete,
    getMetrics: () => metricsRef.current
  };
};
