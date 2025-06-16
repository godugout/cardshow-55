
import { useMemo } from 'react';
import type { CardData } from '@/hooks/useCardEditor';

export interface CardEffects {
  holographic: boolean;
  chrome: boolean;
  foil: boolean;
  intensity: number;
}

export const useCardEffects = (card: CardData) => {
  const effects = useMemo(() => {
    const metadata = card.metadata?.effects;
    return {
      holographic: metadata?.holographic || false,
      chrome: metadata?.chrome || false,
      foil: metadata?.foil || false,
      intensity: metadata?.intensity || 0.5
    };
  }, [card.metadata?.effects]);

  const effectClasses = useMemo(() => {
    const classes: string[] = [];
    
    if (effects.holographic) classes.push('card-holographic');
    if (effects.chrome) classes.push('card-chrome');
    if (effects.foil) classes.push('card-foil');
    
    return classes.join(' ');
  }, [effects]);

  const effectStyles = useMemo(() => {
    return {
      filter: `brightness(${1 + effects.intensity * 0.2}) contrast(${1 + effects.intensity * 0.1})`,
      transition: 'filter 0.3s ease'
    };
  }, [effects.intensity]);

  return {
    effects,
    effectClasses,
    effectStyles
  };
};
