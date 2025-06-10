
import { useMemo } from 'react';
import { getLocal360ImageById, getDefaultLocal360Image } from '../LocalImageLibrary';

interface UseImageSelectionProps {
  panoramicPhotoId?: string;
}

export const useImageSelection = ({ panoramicPhotoId }: UseImageSelectionProps) => {
  const imageConfig = useMemo(() => {
    if (panoramicPhotoId) {
      const image = getLocal360ImageById(panoramicPhotoId);
      if (image) {
        console.log('✅ Found image for ID:', panoramicPhotoId);
        return image;
      }
      console.warn('⚠️ Image not found for ID:', panoramicPhotoId, 'using default');
    }
    
    const defaultImage = getDefaultLocal360Image();
    console.log('🔄 Using default image:', defaultImage.name);
    return defaultImage;
  }, [panoramicPhotoId]);

  return imageConfig;
};
