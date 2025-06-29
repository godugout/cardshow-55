
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Camera, Image, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useWizardContext } from '../WizardContext';

export const PhotoUploadStep: React.FC = () => {
  const { state, dispatch } = useWizardContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(state.cardData.image_url || null);

  const processImageForCard = useCallback((file: File): Promise<string> => {
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
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        resolve(dataUrl);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const handleFileProcess = useCallback(async (file: File) => {
    console.log('📁 Processing file:', file.name);
    setIsProcessing(true);
    
    try {
      toast.info('Processing image for card format...');
      const processedImageUrl = await processImageForCard(file);
      
      setPreviewUrl(processedImageUrl);
      dispatch({
        type: 'UPDATE_CARD_DATA',
        payload: {
          image_url: processedImageUrl,
          thumbnail_url: processedImageUrl
        }
      });
      
      toast.success('Photo processed and ready for card!');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [processImageForCard, dispatch]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      console.log('📁 Files dropped:', file.name);
      await handleFileProcess(file);
    }
  }, [handleFileProcess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxFiles: 1,
    noClick: true, // Disable default click behavior
    noKeyboard: false
  });

  const handleBrowseClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    
    input.onchange = async (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        console.log('📁 File selected via browse:', files[0].name);
        await handleFileProcess(files[0]);
      }
    };
    
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  }, [handleFileProcess]);

  const handleCameraClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.style.display = 'none';
    
    input.onchange = async (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        console.log('📁 Photo taken:', files[0].name);
        await handleFileProcess(files[0]);
      }
    };
    
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  }, [handleFileProcess]);

  return (
    <div className="space-y-8 relative z-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-white">Upload Your Photo</h2>
        <p className="text-crd-lightGray text-lg max-w-2xl mx-auto">
          Add the main image for your trading card. We'll automatically format it for the perfect card layout.
        </p>
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-crd-green mb-4">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span>Processing your image...</span>
          </div>
        </div>
      )}

      {/* Preview */}
      {previewUrl && (
        <div className="flex justify-center mb-8">
          <div className="relative">
            <img
              src={previewUrl}
              alt="Card preview"
              className="w-64 h-80 object-cover rounded-xl border-2 border-crd-green shadow-lg"
            />
            <div className="absolute top-2 right-2 bg-crd-green text-black px-2 py-1 rounded-full text-xs font-medium">
              Ready!
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div className="max-w-2xl mx-auto">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer min-h-[350px] flex flex-col items-center justify-center relative z-20 ${
            isDragActive
              ? 'border-crd-green bg-crd-green/10'
              : 'border-crd-mediumGray/50 hover:border-crd-green/50 hover:bg-crd-darkGray/50'
          }`}
          onClick={handleBrowseClick}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-6">
            <div className="w-20 h-20 rounded-full bg-crd-darkGray flex items-center justify-center mx-auto">
              {isProcessing ? (
                <Sparkles className="w-10 h-10 text-crd-green animate-pulse" />
              ) : isDragActive ? (
                <Upload className="w-10 h-10 text-crd-green" />
              ) : (
                <Image className="w-10 h-10 text-crd-lightGray" />
              )}
            </div>
            
            <div>
              <h3 className="text-white font-medium text-xl mb-2">
                {isDragActive ? 'Drop your image here!' : 'Upload Card Image'}
              </h3>
              <p className="text-crd-lightGray">
                {isDragActive 
                  ? 'Release to upload your image'
                  : 'Drag and drop an image here, or click to browse'
                }
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBrowseClick();
                }}
                disabled={isProcessing}
                className="bg-crd-green hover:bg-crd-green/90 text-black font-medium z-30 relative"
              >
                <Upload className="w-4 h-4 mr-2" />
                Browse Files
              </Button>
              
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCameraClick();
                }}
                variant="outline"
                disabled={isProcessing}
                className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray hover:text-white z-30 relative"
              >
                <Camera className="w-4 h-4 mr-2" />
                Take Photo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* File Format Info */}
      <div className="text-center">
        <p className="text-crd-lightGray text-sm">
          Supported formats: JPG, PNG, WebP, GIF • Maximum size: 10MB
        </p>
      </div>
    </div>
  );
};
