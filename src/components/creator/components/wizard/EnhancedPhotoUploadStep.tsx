
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Sparkles, Camera, Crop, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
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
  
  const { isAnalyzing, imageDetails, analysisStatus, handleFileUpload } = usePhotoUpload(
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

  const getAnalysisStatusIcon = () => {
    switch (analysisStatus) {
      case 'analyzing':
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-crd-green" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getAnalysisStatusMessage = () => {
    switch (analysisStatus) {
      case 'analyzing':
        return 'AI is analyzing your image and generating card details...';
      case 'complete':
        return 'Analysis complete! Your card details have been pre-filled.';
      case 'error':
        return 'Analysis encountered issues, but smart defaults are ready.';
      default:
        return 'Upload a photo to start AI analysis';
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode-specific header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          {mode === 'quick' ? 'Upload Your Photo' : 'Upload & Enhance Your Photo'}
        </h2>
        <p className="text-crd-lightGray">
          {mode === 'quick' 
            ? 'Upload a photo and our AI will analyze it to create your card'
            : 'Upload a photo with advanced AI analysis and editing options'
          }
        </p>
      </div>

      {/* AI Analysis Status */}
      <div className={`p-4 rounded-lg border transition-all ${
        analysisStatus === 'complete' 
          ? 'bg-crd-green/10 border-crd-green/20' 
          : analysisStatus === 'analyzing'
          ? 'bg-blue-500/10 border-blue-500/20'
          : analysisStatus === 'error'
          ? 'bg-yellow-500/10 border-yellow-500/20'
          : 'bg-crd-mediumGray/10 border-crd-mediumGray/20'
      }`}>
        <div className="flex items-center gap-3">
          {getAnalysisStatusIcon()}
          <div>
            <p className="text-white font-medium">
              {analysisStatus === 'analyzing' ? 'AI Analysis in Progress' : 
               analysisStatus === 'complete' ? 'AI Analysis Complete' :
               analysisStatus === 'error' ? 'Analysis Complete (with fallbacks)' :
               'Ready for AI Analysis'}
            </p>
            <p className="text-sm text-crd-lightGray">
              {getAnalysisStatusMessage()}
            </p>
          </div>
        </div>
      </div>

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
              <div className="absolute bottom-2 right-2 bg-black/80 text-white px-3 py-1 rounded text-sm">
                {imageDetails.width} × {imageDetails.height} • {imageDetails.fileSize}
              </div>
            )}
            {analysisStatus === 'analyzing' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <div className="text-center text-white">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm">Analyzing image...</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => document.getElementById('photo-input')?.click()}
              className="text-crd-lightGray border-crd-lightGray hover:bg-crd-lightGray hover:text-black"
              disabled={isAnalyzing}
            >
              <Camera className="w-4 h-4 mr-2" />
              Choose Different Photo
            </Button>

            {mode === 'advanced' && (
              <Button
                variant="outline"
                onClick={handleCropClick}
                className="text-crd-blue border-crd-blue hover:bg-crd-blue hover:text-white"
                disabled={isAnalyzing}
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
            Supports JPG, PNG, WebP • Max 10MB • AI analysis included
          </p>
        </div>
      )}

      {/* Ready State */}
      {selectedPhoto && analysisStatus === 'complete' && (
        <div className="text-center p-4 bg-crd-green/10 rounded-lg border border-crd-green/20">
          <div className="text-crd-green font-medium mb-1 flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Photo ready & analyzed
          </div>
          <p className="text-sm text-crd-lightGray">
            Your card details have been pre-filled with AI-generated content. Click Next to review and customize them.
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
