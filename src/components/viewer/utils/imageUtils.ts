
import type { EnvironmentScene } from '../types';

// Local fallback gradients for when images fail
export const SCENE_FALLBACKS: Record<string, string> = {
  'cosmic-void': 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
  'neon-city': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'golden-hour': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'arctic-aurora': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'mystic-forest': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'volcanic-core': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'ocean-depths': 'linear-gradient(135deg, #209cff 0%, #68e0cf 100%)',
  'desert-mirage': 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)'
};

export const createFallbackBackground = (sceneId: string): string => {
  return SCENE_FALLBACKS[sceneId] || SCENE_FALLBACKS['cosmic-void'];
};

export const preloadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    const timeout = setTimeout(() => {
      console.warn('⏰ Image load timeout:', url);
      reject(new Error('Image load timeout'));
    }, 5000);
    
    img.onload = () => {
      clearTimeout(timeout);
      console.log('✅ Image preloaded:', url);
      resolve(img);
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      console.error('❌ Image preload failed:', url);
      reject(new Error(`Failed to load image: ${url}`));
    };
    
    img.src = url;
  });
};
