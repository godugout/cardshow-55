import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X, Image, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface UploadPhaseProps {
  uploadedImages: File[];
  onImagesUploaded: (images: File[]) => void;
  onNext: () => void;
}

export const UploadPhase: React.FC<UploadPhaseProps> = ({
  uploadedImages,
  onImagesUploaded,
  onNext,
}) => {
  const [images, setImages] = useState<File[]>(uploadedImages);
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== acceptedFiles.length) {
      toast.error('Only image files are allowed');
    }

    const newImages = [...images, ...imageFiles];
    setImages(newImages);
    onImagesUploaded(newImages);

    // Generate previews
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    if (imageFiles.length > 0) {
      toast.success(`Added ${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''}`);
    }
  }, [images, onImagesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true,
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newPreviews);
    onImagesUploaded(newImages);
  };

  const canProceed = images.length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Upload Your Images</h2>
        <p className="text-gray-400">
          Upload images to create your card. Supports JPEG, PNG, GIF, and WebP formats.
        </p>
      </div>

      {/* Upload Area */}
      <Card
        {...getRootProps()}
        className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-crd-green bg-crd-green/10'
            : 'border-crd-border hover:border-crd-green/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <Upload className="w-12 h-12 text-gray-400" />
          <div>
            <p className="text-lg font-medium text-white">
              {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
            </p>
            <p className="text-gray-400 mt-1">or click to browse</p>
          </div>
        </div>
      </Card>

      {/* Uploaded Images Grid */}
      {images.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-white mb-4">
            Uploaded Images ({images.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <Card key={index} className="relative group overflow-hidden">
                <img
                  src={preview}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 truncate">
                  {images[index]?.name}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-4">
        <div className="flex items-center space-x-2">
          {!canProceed && (
            <>
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span className="text-amber-500 text-sm">Upload at least one image to continue</span>
            </>
          )}
        </div>
        
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="bg-crd-green text-black hover:bg-crd-green/90"
        >
          Continue to Frame Selection
        </Button>
      </div>
    </div>
  );
};