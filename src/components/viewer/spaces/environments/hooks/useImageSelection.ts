
import { getLocal360ImageById, getDefaultLocal360Image, type Local360Image } from '../LocalImageLibrary';

interface UseImageSelectionProps {
  panoramicPhotoId?: string;
}

export const useImageSelection = ({ panoramicPhotoId }: UseImageSelectionProps) => {
  console.log('🎪 Image selection for ID:', panoramicPhotoId);
  
  // Get image configuration
  let imageConfig: Local360Image | null = null;
  
  if (panoramicPhotoId) {
    imageConfig = getLocal360ImageById(panoramicPhotoId);
    if (imageConfig) {
      console.log('📸 Using configured image:', imageConfig.name);
    }
  }
  
  // Use default if no specific image found
  if (!imageConfig) {
    console.warn('⚠️ No specific image found, using default');
    imageConfig = getDefaultLocal360Image();
  }
  
  console.log('🖼️ Final image selection:', {
    name: imageConfig.name,
    localUrl: imageConfig.localUrl,
    fallbackUrl: imageConfig.fallbackUrl
  });

  return imageConfig;
};
