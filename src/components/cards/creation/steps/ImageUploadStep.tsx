
import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Camera, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/types/card';
import { useCardImageOptimization } from '../../hooks/useCardImageOptimization';
import { OptimizedImage } from '../../shared/OptimizedImage';
import { toast } from 'sonner';

interface ImageUploadStepProps {
  cardData: Partial<Card>;
  onUpdate: (updates: Partial<Card>) => void;
  onValidationChange: (isValid: boolean) => void;
}

export const ImageUploadStep: React.FC<ImageUploadStepProps> = ({
  cardData,
  onUpdate,
  onValidationChange
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const { optimizeImage, isOptimizing, progress } = useCardImageOptimization();

  // Validate step
  useEffect(() => {
    const isValid = Boolean(cardData.image_url || previewUrl);
    onValidationChange(isValid);
  }, [cardData.image_url, previewUrl, onValidationChange]);

  const handleFileSelect = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Optimize and upload image
    try {
      const cardId = cardData.id || `card_${Date.now()}`;
      const imageData = await optimizeImage(file, cardId);
      
      if (imageData) {
        onUpdate({
          image_url: imageData.original_url,
          thumbnail_url: imageData.thumbnail_url,
          id: cardId
        });
        toast.success('Image uploaded and optimized successfully!');
      }
    } catch (error) {
      console.error('Image optimization failed:', error);
      toast.error('Failed to optimize image');
    }
  }, [cardData.id, optimizeImage, onUpdate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileSelect,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.avif']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    onUpdate({
      image_url: undefined,
      thumbnail_url: undefined
    });
  };

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      if (files.length > 0) {
        handleFileSelect(files);
      }
    };
    input.click();
  };

  const displayImage = cardData.image_url || previewUrl;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-2">Upload Card Image</h2>
        <p className="text-crd-lightGray">
          Add high-quality artwork for your trading card. We'll automatically optimize it for different display sizes.
        </p>
      </div>

      {displayImage ? (
        // Image Preview
        <div className="space-y-4">
          <div className="relative bg-crd-mediumGray rounded-lg overflow-hidden max-w-sm mx-auto">
            <OptimizedImage
              src={displayImage}
              alt="Card preview"
              className="w-full aspect-[2.5/3.5]"
            />
            
            {/* Optimization Progress */}
            {isOptimizing && (
              <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-12 h-12 border-4 border-crd-green border-t-transparent rounded-full animate-spin mb-2 mx-auto" />
                  <p className="text-sm">Optimizing...</p>
                  <p className="text-xs text-crd-lightGray">{progress}%</p>
                </div>
              </div>
            )}

            {/* Remove Button */}
            <Button
              size="sm"
              variant="destructive"
              className="absolute top-2 right-2"
              onClick={handleRemoveImage}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => document.querySelector('input[type="file"]')?.click()}
              className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray hover:text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Different Image
            </Button>
          </div>
        </div>
      ) : (
        // Upload Interface
        <div className="space-y-4">
          {/* Main Drop Zone */}
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
              ${isDragActive 
                ? 'border-crd-green bg-crd-green/10' 
                : 'border-crd-mediumGray hover:border-crd-green/50'
              }
            `}
          >
            <input {...getInputProps()} />
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-crd-lightGray" />
            <h3 className="text-white text-lg font-medium mb-2">
              {isDragActive ? 'Drop your image here' : 'Upload Card Image'}
            </h3>
            <p className="text-crd-lightGray mb-4">
              Drag and drop your image here, or click to browse
            </p>
            <Button
              type="button"
              className="bg-crd-green hover:bg-crd-green/90 text-black font-medium"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
            <p className="text-crd-lightGray text-sm mt-3">
              Supports JPG, PNG, WebP, AVIF • Max 10MB • Recommended: 1080×1350 or higher
            </p>
          </div>

          {/* Alternative Upload Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-20 border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray hover:text-white"
              onClick={handleCameraCapture}
            >
              <div className="text-center">
                <Camera className="w-6 h-6 mx-auto mb-1" />
                <span className="text-sm">Take Photo</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-20 border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray hover:text-white"
              onClick={() => toast.info('Stock photo library coming soon!')}
            >
              <div className="text-center">
                <ImageIcon className="w-6 h-6 mx-auto mb-1" />
                <span className="text-sm">Stock Photos</span>
              </div>
            </Button>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-crd-mediumGray/20 rounded-lg p-4">
        <h4 className="text-white font-medium mb-2">Image Tips</h4>
        <ul className="text-crd-lightGray text-sm space-y-1">
          <li>• Use high-resolution images for best quality</li>
          <li>• Portrait orientation (2.5:3.5 ratio) works best</li>
          <li>• Ensure good lighting and sharp focus</li>
          <li>• Avoid heavily compressed images</li>
          <li>• We'll automatically create optimized versions</li>
        </ul>
      </div>
    </div>
  );
};
