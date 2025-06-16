
import { toast } from 'sonner';

interface ImageDetails {
  dimensions: { width: number; height: number };
  aspectRatio: number;
  fileSize: string;
}

export const useImageProcessor = () => {
  const processImageForCard = (file: File): Promise<{ imageUrl: string; details: ImageDetails }> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = document.createElement('img');
      
      img.onload = () => {
        // Standard trading card aspect ratio is 2.5:3.5 (roughly 0.714)
        const targetAspectRatio = 2.5 / 3.5;
        const sourceAspectRatio = img.width / img.height;
        
        // Set canvas to optimal card dimensions (300x420 pixels for good quality)
        canvas.width = 300;
        canvas.height = 420;
        
        // Clear canvas with white background
        ctx!.fillStyle = '#ffffff';
        ctx!.fillRect(0, 0, canvas.width, canvas.height);
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (sourceAspectRatio > targetAspectRatio) {
          // Image is wider - fit to height and center horizontally
          drawHeight = canvas.height;
          drawWidth = drawHeight * sourceAspectRatio;
          offsetX = (canvas.width - drawWidth) / 2;
          offsetY = 0;
        } else {
          // Image is taller - fit to width and center vertically
          drawWidth = canvas.width;
          drawHeight = drawWidth / sourceAspectRatio;
          offsetX = 0;
          offsetY = (canvas.height - drawHeight) / 2;
        }
        
        // Draw the image centered and fitted
        ctx!.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        
        // Convert to data URL
        const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        // Store image details
        const details: ImageDetails = {
          dimensions: { width: img.width, height: img.height },
          aspectRatio: sourceAspectRatio,
          fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB'
        };
        
        resolve({ imageUrl, details });
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (
    file: File,
    onPhotoSelect: (photo: string) => void,
    onDetailsUpdate: (details: ImageDetails) => void,
    onAnalysisComplete?: (analysis: any) => void
  ) => {
    try {
      toast.info('Processing image for card format...');
      const { imageUrl, details } = await processImageForCard(file);
      onPhotoSelect(imageUrl);
      onDetailsUpdate(details);
      toast.success('Photo processed and ready for card!');
      
      // Trigger AI analysis if callback provided
      if (onAnalysisComplete) {
        // Import here to avoid circular dependencies
        const { analyzeCardImage } = await import('@/services/cardAnalyzer');
        try {
          toast.info('Analyzing image with AI...', { icon: '✨' });
          const analysis = await analyzeCardImage(imageUrl);
          onAnalysisComplete(analysis);
          toast.success('Image analyzed! Fields have been pre-filled.');
        } catch (error) {
          console.error('Analysis failed:', error);
          toast.error('Analysis failed, but you can still fill details manually.');
        }
      }
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image. Please try again.');
    }
  };

  return { handleFileUpload };
};
