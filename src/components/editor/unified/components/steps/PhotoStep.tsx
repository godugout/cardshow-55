
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Camera, Sparkles } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { toast } from 'sonner';
import { uploadCardImage } from '@/lib/cardImageUploader';
import { useCustomAuth } from '@/features/auth/hooks/useCustomAuth';
import type { CreationMode } from '../../types';
import type { CardData } from '@/hooks/useCardEditor';

interface PhotoStepProps {
  mode: CreationMode;
  selectedPhoto?: string;
  onPhotoSelect: (photo: string) => void;
  cardData?: CardData;
}

export const PhotoStep = ({ mode, selectedPhoto, onPhotoSelect, cardData }: PhotoStepProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { user } = useCustomAuth();

  const handleFileUpload = async (file: File) => {
    if (!user || !cardData?.id) {
      toast.error('Please ensure you are logged in and have a valid card session');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // First create a preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
      onPhotoSelect(previewUrl);

      // Start AI analysis if in quick mode
      if (mode === 'quick') {
        setIsAnalyzing(true);
        toast.success('Image uploaded! AI is analyzing...', {
          icon: <Sparkles className="w-4 h-4" />
        });
      }

      // Upload to storage
      const result = await uploadCardImage({
        file,
        cardId: cardData.id,
        userId: user.id,
        onProgress: setUploadProgress
      });

      if (result) {
        // Replace preview URL with actual storage URL
        onPhotoSelect(result.url);
        toast.success('Image uploaded successfully!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setIsAnalyzing(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      await handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true
  });

  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
    event.target.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-crd-white mb-2">Upload Your Image</h2>
        <p className="text-crd-lightGray">
          {mode === 'quick' 
            ? 'Upload an image and we\'ll handle the rest with AI assistance'
            : 'Upload an image to get started with your card creation'
          }
        </p>
      </div>

      {/* Upload Area */}
      {!selectedPhoto ? (
        <div 
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
            ${isDragActive 
              ? 'border-crd-green bg-crd-green/10' 
              : 'border-crd-mediumGray/30 hover:border-crd-green/50 hover:bg-crd-mediumGray/5'
            }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-16 h-16 text-crd-mediumGray mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-crd-white mb-2">
            {isDragActive ? 'Drop your image here' : 'Drag & drop your image'}
          </h3>
          <p className="text-crd-lightGray mb-6">
            Or click below to browse your files
          </p>
          <CRDButton
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById('photo-upload-input')?.click();
            }}
            variant="primary"
            disabled={isUploading}
          >
            <Camera className="w-4 h-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Choose Image'}
          </CRDButton>
        </div>
      ) : (
        // Preview Area
        <div className="bg-crd-darker rounded-xl border border-crd-mediumGray/20 p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Image Preview */}
            <div className="flex-1">
              <div className="aspect-[3/4] max-w-sm mx-auto lg:mx-0 relative rounded-lg overflow-hidden border border-crd-mediumGray/20">
                <img 
                  src={selectedPhoto} 
                  alt="Uploaded card image"
                  className="w-full h-full object-cover"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-12 h-12 border-4 border-crd-green border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-sm">Uploading... {uploadProgress}%</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Info & Actions */}
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-crd-white mb-2">Image Uploaded</h3>
                <p className="text-crd-lightGray">
                  Your image has been uploaded successfully. 
                  {mode === 'quick' && ' AI analysis will help generate card details automatically.'}
                </p>
              </div>

              {isAnalyzing && (
                <div className="bg-crd-mediumGray/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-crd-green mb-2">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span className="text-sm font-medium">AI Analysis in Progress</span>
                  </div>
                  <p className="text-sm text-crd-lightGray">
                    Analyzing your image to suggest card title, description, and optimal cropping...
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <CRDButton
                  onClick={() => document.getElementById('photo-upload-input')?.click()}
                  variant="outline"
                  className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
                  disabled={isUploading}
                >
                  Replace Image
                </CRDButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        id="photo-upload-input"
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {mode === 'quick' && selectedPhoto && (
        <div className="mt-6 text-center">
          <p className="text-crd-lightGray text-sm">
            💡 Ready to continue! AI will help fill in the card details in the next step.
          </p>
        </div>
      )}
    </div>
  );
};
