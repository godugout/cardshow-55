
import { useRef, useEffect, useMemo } from 'react';
import type { CardData } from '@/hooks/useCardEditor';

interface TextureCacheEntry {
  url: string;
  image: HTMLImageElement;
  loaded: boolean;
}

export const useTextureCache = (card: CardData) => {
  const cache = useRef<Map<string, TextureCacheEntry>>(new Map());
  
  // Pre-load card image
  useEffect(() => {
    if (card.image_url && !cache.current.has(card.image_url)) {
      const img = new Image();
      const entry: TextureCacheEntry = {
        url: card.image_url,
        image: img,
        loaded: false
      };
      
      img.onload = () => {
        entry.loaded = true;
      };
      
      img.onerror = () => {
        console.warn('Failed to load card image:', card.image_url);
      };
      
      cache.current.set(card.image_url, entry);
      img.src = card.image_url;
    }
  }, [card.image_url]);

  // Get cached image
  const getCachedImage = useMemo(() => {
    return (url: string) => {
      const entry = cache.current.get(url);
      return entry?.loaded ? entry.image : null;
    };
  }, []);

  // Check if image is loaded
  const isImageLoaded = useMemo(() => {
    if (!card.image_url) return true;
    const entry = cache.current.get(card.image_url);
    return entry?.loaded || false;
  }, [card.image_url]);

  return {
    getCachedImage,
    isImageLoaded,
    cache: cache.current
  };
};
