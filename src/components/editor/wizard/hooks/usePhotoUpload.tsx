
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
      // Basic validation
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      if (!file.type.startsWith('image/')) {
        reject(new Error('Invalid file type. Please upload an image.'));
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        reject(new Error('File too large. Please upload an image smaller than 10MB.'));
        return;
      }

      console.log('Processing image file:', file.name, file.type, file.size);

      const reader = new FileReader();
      
      reader.onerror = () => {
        console.error('FileReader error');
        reject(new Error('Failed to read file'));
      };

      reader.onload = (event) => {
        try {
          const result = event.target?.result as string;
          
          if (!result) {
            reject(new Error('Failed to read image data'));
            return;
          }

          console.log('File read successfully, creating image element');
          
          const img = new Image();
          
          img.onerror = () => {
            console.error('Image load error');
            reject(new Error('Failed to load image. Please try a different image.'));
          };
          
          img.onload = () => {
            try {
              console.log('Image loaded successfully:', img.width, 'x', img.height);
              
              // Create canvas for processing
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              if (!ctx) {
                reject(new Error('Browser does not support image processing'));
                return;
              }

              // Set optimal dimensions for card format
              const maxWidth = 800;
              const maxHeight = 1120; // 800 * (3.5/2.5) for card aspect ratio
              
              let { width, height } = img;
              
              // Scale down if too large while maintaining aspect ratio
              if (width > maxWidth || height > maxHeight) {
                const scale = Math.min(maxWidth / width, maxHeight / height);
                width = Math.round(width * scale);
                height = Math.round(height * scale);
              }
              
              canvas.width = width;
              canvas.height = height;
              
              // Draw image to canvas
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, width, height);
              ctx.drawImage(img, 0, 0, width, height);
              
              // Convert to data URL
              const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
              
              // Store image details
              setImageDetails({
                dimensions: { width: img.width, height: img.height },
                aspectRatio: img.width / img.height,
                fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                width: img.width,
                height: img.height
              });
              
              console.log('Image processed successfully');
              resolve(dataUrl);
              
            } catch (error) {
              console.error('Canvas processing error:', error);
              reject(new Error('Failed to process image'));
            }
          };
          
          img.src = result;
          
        } catch (error) {
          console.error('FileReader result processing error:', error);
          reject(new Error('Failed to process file'));
        }
      };
      
      reader.readAsDataURL(file);
    });
  }, []);

  const handlePhotoAnalysis = useCallback(async (imageDataUrl: string) => {
    if (!onAnalysisComplete) return;
    
    setIsAnalyzing(true);
    setAnalysisStatus('analyzing');
    
    try {
      toast.info('AI Analysis Starting', { 
        icon: <Sparkles className="w-4 h-4 animate-pulse" />,
        description: 'Analyzing image content and generating metadata...'
      });
      
      const analysis = await analyzeCardImage(imageDataUrl);
      
      setAnalysisStatus('complete');
      onAnalysisComplete(analysis);
      
      toast.success('Analysis Complete!', {
        icon: <CheckCircle className="w-4 h-4" />,
        description: `Generated content ready for your card`
      });
      
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisStatus('error');
      
      toast.error('Analysis had issues', {
        icon: <AlertCircle className="w-4 h-4" />,
        description: 'Using smart defaults. You can edit all details manually.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [onAnalysisComplete]);

  const handleFileUpload = useCallback(async (file: File) => {
    console.log('Starting file upload process for:', file.name);
    
    try {
      const processingToast = toast.loading('Processing image...', {
        description: 'Optimizing for card format'
      });
      
      const processedImageUrl = await processImageForCard(file);
      onPhotoSelect(processedImageUrl);
      
      toast.dismiss(processingToast);
      toast.success('Image processed successfully!', {
        description: 'Ready for AI analysis'
      });
      
      // Trigger AI analysis
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
