
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

const COLOR_MAP: Record<string, string> = {
  holographic: 'linear-gradient(90deg, rgba(255, 107, 107, 0.8), rgba(78, 205, 196, 0.8), rgba(69, 183, 209, 0.8), rgba(150, 206, 180, 0.8))',
  gold: 'rgba(255, 215, 0, 0.8)',
  chrome: 'rgba(174, 182, 191, 0.7)',
  crystal: 'rgba(255, 255, 255, 0.6)',
  prizm: 'linear-gradient(90deg, rgba(255, 60, 60, 0.7), rgba(255, 120, 40, 0.7), rgba(255, 200, 40, 0.7), rgba(120, 255, 60, 0.7))',
  vintage: 'rgba(188, 170, 164, 0.6)',
  ice: 'rgba(14, 165, 233, 0.7)',
  aurora: 'linear-gradient(90deg, rgba(138, 43, 226, 0.7), rgba(20, 184, 166, 0.7), rgba(59, 130, 246, 0.7))',
  interference: 'rgba(156, 163, 175, 0.6)',
  foilspray: 'rgba(243, 156, 18, 0.7)'
};

export const getGasColor = (effectValues: EffectValues): string => {
  const activeEffects = Object.entries(effectValues).filter(([_, effect]) => 
    effect.intensity && typeof effect.intensity === 'number' && effect.intensity > 10
  );
  
  if (activeEffects.length === 0) {
    return 'rgba(100, 150, 255, 0.6)'; // Default blue glow
  }
  
  // Use the dominant effect to determine gas color
  const dominantEffect = activeEffects.reduce((max, current) => 
    (current[1].intensity as number) > (max[1].intensity as number) ? current : max
  );
  
  return COLOR_MAP[dominantEffect[0]] || 'rgba(100, 150, 255, 0.6)';
};
