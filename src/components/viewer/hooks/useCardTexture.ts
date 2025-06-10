
import { useState, useEffect } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface UseCardTextureOptions {
  imageUrl?: string;
  fallbackUrl?: string;
}

export const useCardTexture = ({ imageUrl, fallbackUrl }: UseCardTextureOptions) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('');

  // Determine the URL to use
  useEffect(() => {
    const url = imageUrl || fallbackUrl || '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png';
    setCurrentUrl(url);
    setIsLoading(true);
    setError(null);
  }, [imageUrl, fallbackUrl]);

  // Load texture with error handling
  let texture = null;
  let hasTexture = false;

  try {
    texture = useTexture(currentUrl);
    hasTexture = true;
    
    // Set loading to false when texture is available
    useEffect(() => {
      if (texture) {
        setIsLoading(false);
        setError(null);
      }
    }, [texture]);
  } catch (err) {
    console.warn('Texture loading failed:', err);
    setError(err instanceof Error ? err.message : 'Failed to load texture');
    setIsLoading(false);
    hasTexture = false;
    
    // Try fallback if original failed and we haven't tried fallback yet
    if (imageUrl && currentUrl === imageUrl && fallbackUrl) {
      setCurrentUrl(fallbackUrl);
    }
  }

  // Create fallback material for cases where all textures fail
  const fallbackMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#4F46E5'),
    roughness: 0.3,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });

  return {
    texture: error ? null : texture,
    fallbackMaterial,
    isLoading,
    error,
    hasTexture: !error && hasTexture
  };
};
