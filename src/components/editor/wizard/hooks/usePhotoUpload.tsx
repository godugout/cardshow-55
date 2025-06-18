
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { analyzeCardImage } from '@/services/cardAnalyzer';

interface ImageDetails {
  dimensions: { width: number; height: number };
  aspectRatio: number;
  fileSize: string;
  width: number;
  height: number;
}

export const usePhotoUpload = (
  onPhotoSelect: (photo: string) => void,
  onAnalysisComplete?: (analysis: any) => void
) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imageDetails, setImageDetails] = useState<ImageDetails | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'analyzing' | 'complete' | 'error'>('idle');

  const processImageForCard = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Validate file first
      if (!file.type.startsWith('image/')) {
        reject(new Error('Invalid file type. Please upload an image.'));
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        reject(new Error('File too large. Please upload an image smaller than 10MB.'));
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Browser does not support image processing'));
        return;
      }

      const img = new Image();
      
      // Set up error handler first
      img.onerror = (error) => {
        console.error('Image load error:', error);
        URL.revokeObjectURL(img.src); // Clean up object URL
        reject(new Error('Failed to load image. Please try a different image.'));
      };
      
      img.onload = () => {
        try {
          // Clean up object URL immediately after loading
          URL.revokeObjectURL(img.src);
          
          // Standard trading card aspect ratio is 2.5:3.5 (roughly 0.714)
          const targetAspectRatio = 2.5 / 3.5;
          const sourceAspectRatio = img.width / img.height;
          
          // Set canvas to optimal card dimensions (400x560 pixels for better quality)
          canvas.width = 400;
          canvas.height = 560;
          
          // Clear canvas with white background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
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
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
          
          // Convert to data URL with high quality
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          
          // Store enhanced image details
          setImageDetails({
            dimensions: { width: img.width, height: img.height },
            aspectRatio: sourceAspectRatio,
            fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            width: img.width,
            height: img.height
          });
          
          resolve(dataUrl);
        } catch (error) {
          console.error('Image processing error:', error);
          reject(new Error('Failed to process image'));
        }
      };
      
      // Create object URL and set as image source
      try {
        const objectUrl = URL.createObjectURL(file);
        img.src = objectUrl;
      } catch (error) {
        console.error('Failed to create object URL:', error);
        reject(new Error('Failed to read image file'));
      }
    });
  }, []);

  const handlePhotoAnalysis = useCallback(async (imageDataUrl: string) => {
    if (!onAnalysisComplete) return;
    
    setIsAnalyzing(true);
    setAnalysisStatus('analyzing');
    
    try {
      // Show enhanced progress feedback
      toast.info('AI Analysis Starting', { 
        icon: <Sparkles className="w-4 h-4 animate-pulse" />,
        description: 'Analyzing image content, style, and generating metadata...'
      });
      
      const analysis = await analyzeCardImage(imageDataUrl);
      
      // Update analysis status
      setAnalysisStatus('complete');
      onAnalysisComplete(analysis);
      
      // Show detailed success feedback
      toast.success('Analysis Complete!', {
        icon: <CheckCircle className="w-4 h-4" />,
        description: `Generated title: "${analysis.title}" • ${analysis.tags.length} tags • ${analysis.rarity} rarity`
      });
      
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisStatus('error');
      
      toast.error('Analysis had issues', {
        icon: <AlertCircle className="w-4 h-4" />,
        description: 'Using smart defaults. You can still edit all details manually.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [onAnalysisComplete]);

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      // Show processing feedback
      const processingToast = toast.loading('Processing image...', {
        description: 'Optimizing for card format'
      });
      
      const processedImageUrl = await processImageForCard(file);
      onPhotoSelect(processedImageUrl);
      
      toast.dismiss(processingToast);
      toast.success('Image processed successfully!', {
        description: 'Ready for AI analysis'
      });
      
      // Trigger AI analysis after a short delay
      setTimeout(() => {
        handlePhotoAnalysis(processedImageUrl);
      }, 500);
      
    } catch (error) {
      console.error('Error processing image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process image';
      toast.error('Failed to process image', {
        description: errorMessage
      });
    }
  }, [processImageForCard, onPhotoSelect, handlePhotoAnalysis]);

  return {
    isAnalyzing,
    imageDetails,
    analysisStatus,
    handleFileUpload,
  };
};
