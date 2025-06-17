
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Sparkles, Camera, Crop } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FloatingCropOverlay } from '@/components/bulk-upload/floating-editor/FloatingCropOverlay';
import { usePhotoUpload } from '@/components/editor/wizard/hooks/usePhotoUpload';

interface EnhancedPhotoUploadStepProps {
  mode: 'quick' | 'advanced';
  selectedPhoto: string;
  onPhotoSelect: (photo: string) => void;
  onAnalysisComplete?: (analysis: any) => void;
}

export const EnhancedPhotoUploadStep = ({
  mode,
  selectedPhoto,
  onPhotoSelect,
  onAnalysisComplete
}: EnhancedPhotoUploadStepProps) => {
  const [showCropEditor, setShowCropEditor] = useState(false);
  const [cropFile, setCropFile] = useState<any>(null);
  
  const { isAnalyzing, imageDetails, handleFileUpload } = usePhotoUpload(
    onPhotoSelect,
    onAnalysisComplete
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        await handleFileUpload(file);
      }
    }
  });

  const handleCropClick = () => {
    if (selectedPhoto) {
      // Create a mock file for the crop editor
      const mockFile = {
        id: 'crop-edit',
        file: new File([], 'image.jpg'),
        preview: selectedPhoto,
        status: 'editing' as const,
        editData: null
      };
      setCropFile(mockFile);
      setShowCropEditor(true);
    }
  };

  const handleCropApply = (editData: any) => {
    if (editData?.croppedImageUrl) {
      onPhotoSelect(editData.croppedImageUrl);
      toast.success('Crop applied successfully!');
    }
    setShowCropEditor(false);
    setCropFile(null);
  };

  const handleCropCancel = () => {
    setShowCropEditor(false);
    setCropFile(null);
  };

  if (showCropEditor && cropFile) {
    return (
      <FloatingCropOverlay
        file={cropFile}
        onApply={handleCropApply}
        onCancel={handleCropCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Mode-specific header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          {mode === 'quick' ? 'Upload Your Photo' : 'Upload & Enhance Your Photo'}
        </h2>
        <p className="text-crd-lightGray">
          {mode === 'quick' 
            ? 'Upload a photo and our AI will handle the rest automatically'
            : 'Upload a photo with advanced cropping and editing options'
          }
        </p>
      </div>

      {/* AI Analysis Status */}
      {isAnalyzing && (
        <div className="text-center p-4 bg-crd-green/10 rounded-lg border border-crd-green/20">
          <div className="flex items-center justify-center gap-2 text-crd-green mb-2">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="font-medium">AI is analyzing your image...</span>
          </div>
          <p className="text-sm text-crd-lightGray">
            Detecting subjects, analyzing composition, and suggesting templates
          </p>
        </div>
      )}

      {/* Photo Preview or Upload Area */}
      {selectedPhoto ? (
        <div className="space-y-4">
          <div className="relative bg-crd-darkGray rounded-lg p-4 border border-crd-mediumGray/30">
            <img
              src={selectedPhoto}
              alt="Selected photo"
              className="w-full max-h-96 object-contain rounded-lg"
            />
            {imageDetails && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {imageDetails.width} × {imageDetails.height}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => document.getElementById('photo-input')?.click()}
              className="text-crd-lightGray border-crd-lightGray hover:bg-crd-lightGray hover:text-black"
            >
              <Camera className="w-4 h-4 mr-2" />
              Choose Different Photo
            </Button>

            {mode === 'advanced' && (
              <Button
                variant="outline"
                onClick={handleCropClick}
                className="text-crd-blue border-crd-blue hover:bg-crd-blue hover:text-white"
              >
                <Crop className="w-4 h-4 mr-2" />
                Advanced Crop
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-crd-green bg-crd-green/10'
              : 'border-crd-mediumGray hover:border-crd-green/50'
          }`}
        >
          <input {...getInputProps()} />
          <Camera className="w-16 h-16 mx-auto mb-4 text-crd-lightGray" />
          <h3 className="text-white text-xl font-medium mb-2">
            {isDragActive ? 'Drop your photo here' : 'Upload Your Photo'}
          </h3>
          <p className="text-crd-lightGray mb-4">
            Drag and drop your image here, or click to browse
          </p>
          <Button className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold">
            Choose Photo
          </Button>
          <p className="text-crd-lightGray text-sm mt-3">
            Supports JPG, PNG, WebP • Max 10MB
          </p>
        </div>
      )}

      {/* Ready State */}
      {selectedPhoto && !isAnalyzing && (
        <div className="text-center p-4 bg-crd-green/10 rounded-lg border border-crd-green/20">
          <div className="text-crd-green font-medium mb-1">
            ✅ Photo ready for card creation
          </div>
          <p className="text-sm text-crd-lightGray">
            {mode === 'quick' 
              ? 'Click Next to proceed with AI-suggested templates'
              : 'Click Next to choose your template or continue with advanced options'
            }
          </p>
        </div>
      )}

      <input
        id="photo-input"
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            await handleFileUpload(file);
          }
          e.target.value = '';
        }}
        className="hidden"
      />
    </div>
  );
};
