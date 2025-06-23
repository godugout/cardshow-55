
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { CardImageData } from '../types/cardTypes';

interface OptimizationOptions {
  generateThumbnail: boolean;
  generateWebP: boolean;
  generateAVIF: boolean;
  maxWidth: number;
  quality: number;
}

export const useCardImageOptimization = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [progress, setProgress] = useState(0);

  const optimizeImage = useCallback(async (
    file: File,
    cardId: string,
    options: Partial<OptimizationOptions> = {}
  ): Promise<CardImageData | null> => {
    const defaultOptions: OptimizationOptions = {
      generateThumbnail: true,
      generateWebP: true,
      generateAVIF: false,
      maxWidth: 2048,
      quality: 0.9,
      ...options
    };

    setIsOptimizing(true);
    setProgress(0);

    try {
      // Create canvas for image processing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      return new Promise((resolve, reject) => {
        img.onload = async () => {
          try {
            // Calculate dimensions maintaining aspect ratio
            const aspectRatio = img.width / img.height;
            let width = Math.min(img.width, defaultOptions.maxWidth);
            let height = width / aspectRatio;

            canvas.width = width;
            canvas.height = height;
            ctx?.drawImage(img, 0, 0, width, height);

            setProgress(25);

            // Generate original optimized version
            const optimizedBlob = await new Promise<Blob>((resolve) => {
              canvas.toBlob(resolve, 'image/jpeg', defaultOptions.quality);
            });

            const timestamp = Date.now();
            const fileExt = file.name.split('.').pop() || 'jpg';
            const basePath = `cards/${cardId}`;

            // Upload original
            const originalPath = `${basePath}/original_${timestamp}.${fileExt}`;
            const { error: originalError } = await supabase.storage
              .from('card-images')
              .upload(originalPath, optimizedBlob!);

            if (originalError) throw originalError;
            setProgress(50);

            let thumbnailUrl = '';
            if (defaultOptions.generateThumbnail) {
              // Generate thumbnail (300x420 for card aspect ratio)
              const thumbCanvas = document.createElement('canvas');
              const thumbCtx = thumbCanvas.getContext('2d');
              thumbCanvas.width = 300;
              thumbCanvas.height = 420;
              
              thumbCtx?.drawImage(img, 0, 0, 300, 420);
              
              const thumbnailBlob = await new Promise<Blob>((resolve) => {
                thumbCanvas.toBlob(resolve, 'image/jpeg', 0.8);
              });

              const thumbnailPath = `${basePath}/thumb_${timestamp}.jpg`;
              const { error: thumbError } = await supabase.storage
                .from('card-images')
                .upload(thumbnailPath, thumbnailBlob!);

              if (!thumbError) {
                const { data: thumbData } = supabase.storage
                  .from('card-images')
                  .getPublicUrl(thumbnailPath);
                thumbnailUrl = thumbData.publicUrl;
              }
            }

            setProgress(75);

            // Get public URLs
            const { data: originalData } = supabase.storage
              .from('card-images')
              .getPublicUrl(originalPath);

            setProgress(100);

            const imageData: CardImageData = {
              id: `img_${timestamp}`,
              original_url: originalData.publicUrl,
              thumbnail_url: thumbnailUrl || originalData.publicUrl,
              display_url: originalData.publicUrl,
              high_res_url: originalData.publicUrl,
              width: canvas.width,
              height: canvas.height,
              file_size: file.size,
              format: 'image/jpeg',
              alt_text: `Card image for ${cardId}`
            };

            resolve(imageData);
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
      });
    } catch (error) {
      console.error('Image optimization failed:', error);
      toast.error('Failed to optimize image');
      return null;
    } finally {
      setIsOptimizing(false);
      setProgress(0);
    }
  }, []);

  return {
    optimizeImage,
    isOptimizing,
    progress
  };
};
