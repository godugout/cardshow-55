
import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { textureManager } from '../utils/TextureManager';

interface UseCardTexturesProps {
  cardImageUrl?: string;
}

export const useCardTextures = ({ cardImageUrl }: UseCardTexturesProps) => {
  const [frontTexture, setFrontTexture] = useState<THREE.Texture | null>(null);
  const [backTexture, setBackTexture] = useState<THREE.Texture | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTextures = async () => {
      setIsLoading(true);
      try {
        // Load front texture (card image)
        const front = cardImageUrl 
          ? await textureManager.loadTexture(cardImageUrl)
          : textureManager.createFallbackTexture(0x4444ff);
        setFrontTexture(front);

        // Load back texture (CRD logo)
        const back = await textureManager.loadTexture('/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png')
          .catch(() => textureManager.createFallbackTexture(0x222222));
        setBackTexture(back);
      } catch (error) {
        console.error('Error loading card textures:', error);
        setFrontTexture(textureManager.createFallbackTexture(0x4444ff));
        setBackTexture(textureManager.createFallbackTexture(0x222222));
      } finally {
        setIsLoading(false);
      }
    };

    loadTextures();
  }, [cardImageUrl]);

  return {
    frontTexture,
    backTexture,
    isLoading
  };
};
