
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Image, Upload, Sparkles, Crop, RotateCw, Scissors, Check, Users } from 'lucide-react';
import { toast } from 'sonner';
import { analyzeCardImage } from '@/services/cardAnalyzer';
import { AdvancedCropper } from '../AdvancedCropper';
import { BulkUploadOption } from '../BulkUploadOption';

interface PhotoUploadStepProps {
  selectedPhoto: string;
  onPhotoSelect: (photo: string) => void;
  onAnalysisComplete?: (analysis: any) => void;
  onBulkUpload?: () => void;
}

export const PhotoUploadStep = ({ selectedPhoto, onPhotoSelect, onAnalysisComplete, onBulkUpload }: PhotoUploadStepProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAdvancedCrop, setShowAdvancedCrop] = useState(false);
  const [imageDetails, setImageDetails] = useState<{
    dimensions: { width: number; height: number };
    aspectRatio: number;
    fileSize: string;
  } | null>(null);

  const processImageForCard = (file: File): Promise<string> => {
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
        
        // Store image details
        setImageDetails({
          dimensions: { width: img.width, height: img.height },
          aspectRatio: sourceAspectRatio,
          fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB'
        });
        
        resolve(dataUrl);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handlePhotoAnalysis = async (imageDataUrl: string) => {
    if (!onAnalysisComplete) return;
    
    setIsAnalyzing(true);
    try {
      toast.info('Analyzing image with AI...', { icon: <Sparkles className="w-4 h-4" /> });
      const analysis = await analyzeCardImage(imageDataUrl);
      onAnalysisComplete(analysis);
      toast.success('Image analyzed! Fields have been pre-filled.');
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed, but you can still fill details manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      try {
        toast.info('Processing image for card format...');
        const processedImageUrl = await processImageForCard(file);
        onPhotoSelect(processedImageUrl);
        toast.success('Photo processed and ready for card!');
        
        // Trigger AI analysis
        await handlePhotoAnalysis(processedImageUrl);
      } catch (error) {
        console.error('Error processing image:', error);
        toast.error('Failed to process image. Please try again.');
      }
    }
  }, [onPhotoSelect]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true
  });

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        toast.info('Processing image for card format...');
        const processedImageUrl = await processImageForCard(file);
        onPhotoSelect(processedImageUrl);
        toast.success('Photo processed and ready for card!');
        
        // Trigger AI analysis
        await handlePhotoAnalysis(processedImageUrl);
      } catch (error) {
        console.error('Error processing image:', error);
        toast.error('Failed to process image. Please try again.');
      }
    }
    event.target.value = '';
  };

  const handleAdvancedCropComplete = (crops: { main?: string; frame?: string; elements?: string[] }) => {
    if (crops.main) {
      onPhotoSelect(crops.main);
      toast.success('Advanced crop applied to card!');
    }
    setShowAdvancedCrop(false);
  };

  // Show advanced cropper if active
  if (showAdvancedCrop && selectedPhoto) {
    return (
      <div className="h-[600px]">
        <AdvancedCropper
          imageUrl={selectedPhoto}
          onCropComplete={handleAdvancedCropComplete}
          onCancel={() => setShowAdvancedCrop(false)}
          aspectRatio={2.5 / 3.5}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Upload Your Photo</h2>
        <p className="text-crd-lightGray">
          Choose the image that will be featured on your card
        </p>
        {isAnalyzing && (
          <div className="mt-2 flex items-center justify-center gap-2 text-crd-green">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-sm">AI is analyzing your image...</span>
          </div>
        )}
      </div>
      
      {/* Card Preview Area */}
      <div className="flex justify-center mb-8">
        <div className="bg-crd-mediumGray rounded-lg p-8 border-2 border-dashed border-crd-lightGray/30 max-w-md">
          {selectedPhoto ? (
            <div className="space-y-4">
              <div className="relative bg-white p-2 rounded-lg shadow-lg" style={{ width: 200, height: 280 }}>
                <img 
                  src={selectedPhoto} 
                  alt="Card preview" 
                  className="w-full h-full object-cover rounded"
                />
                <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1 rounded">
                  Card Preview
                </div>
              </div>
              
              <div className="text-crd-green text-sm flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                Photo optimized for card format!
              </div>
              
              {imageDetails && (
                <div className="text-crd-lightGray text-xs space-y-1">
                  <div>Original: {imageDetails.dimensions.width}×{imageDetails.dimensions.height}</div>
                  <div>Size: {imageDetails.fileSize}</div>
                  <div>Ratio: {imageDetails.aspectRatio.toFixed(2)}:1</div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center" style={{ width: 200, height: 280 }}>
              <div className="flex flex-col items-center justify-center h-full">
                <Upload className="w-16 h-16 text-crd-lightGray mb-4" />
                <p className="text-white text-lg mb-2">Drop your image here</p>
                <p className="text-crd-lightGray text-sm">or click to browse</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Actions */}
      <div className="flex justify-center gap-4 mb-8">
        <Button
          onClick={() => document.getElementById('photo-input')?.click()}
          variant="outline"
          className="bg-transparent border-crd-lightGray text-crd-lightGray hover:bg-crd-lightGray hover:text-black"
          disabled={isAnalyzing}
        >
          Choose File
        </Button>
        {selectedPhoto && (
          <Button
            onClick={() => setShowAdvancedCrop(true)}
            className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
            disabled={isAnalyzing}
          >
            <Scissors className="w-4 h-4 mr-2" />
            Advanced Crop
          </Button>
        )}
      </div>

      {/* Bulk Upload Option - Secondary placement */}
      {onBulkUpload && (
        <div className="mb-8">
          <BulkUploadOption onSelectBulkUpload={onBulkUpload} />
        </div>
      )}

      {/* Ready Section */}
      {selectedPhoto && !isAnalyzing && (
        <div className="bg-crd-darkGray border border-crd-mediumGray/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Check className="w-5 h-5 text-crd-green" />
            <h3 className="text-white font-semibold">Ready for Card Creation</h3>
          </div>
          <p className="text-crd-lightGray text-sm mb-6">
            Your image has been processed and optimized for the standard trading card format. 
            Use "Advanced Crop" to extract multiple elements (frame, logos, etc.) or proceed with the simple workflow.
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-medium mb-2">Supported Formats & Features</h4>
              <div className="text-crd-lightGray text-sm space-y-1">
                <div>File Types:</div>
                <div>JPG, PNG, WebP, GIF</div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Advanced Features:</h4>
              <div className="text-crd-lightGray text-sm space-y-1">
                <div>Multi-element cropping, Frame extraction</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        id="photo-input"
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />
    </div>
  );
};
