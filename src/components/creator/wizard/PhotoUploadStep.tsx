
import React from 'react';
import { CheckCircle, Sparkles, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UniversalDropZone } from '@/components/ui/UniversalDropZone';
import { useImageUpload } from '@/hooks/useImageUpload';
import { ImageProcessor } from '@/lib/imageProcessor';
import type { DesignTemplate } from '@/hooks/useCardEditor';

interface PhotoUploadStepProps {
  selectedPhoto: string | null;
  onPhotoSelect: (photoUrl: string) => void;
  selectedTemplate: DesignTemplate | null;
  onAnalysisComplete?: (analysis: any) => void;
}

export const PhotoUploadStep = ({ 
  selectedPhoto, 
  onPhotoSelect, 
  selectedTemplate,
  onAnalysisComplete 
}: PhotoUploadStepProps) => {
  const imageUpload = useImageUpload({
    enableAnalysis: !!onAnalysisComplete,
    onSuccess: (result) => {
      onPhotoSelect(result.dataUrl);
    },
    onAnalysisComplete
  });

  const getTemplateRecommendation = () => {
    if (!selectedTemplate) return null;
    
    const recommendations = {
      'baseball-classic': 'Upload a clear action shot or portrait of the player in uniform',
      'basketball-modern': 'Best with dynamic action shots showing the player in motion',
      'football-pro': 'Professional headshot or game action photo works best',
      'soccer-international': 'Action shots during gameplay or celebration moments',
      'musician-spotlight': 'Stage performance or professional artist photos',
      'actor-premiere': 'Professional headshots or red carpet photos work great'
    };
    
    return recommendations[selectedTemplate.id as keyof typeof recommendations] || 
           'Upload a high-quality photo that represents your subject well';
  };

  const getAnalysisStatusIcon = () => {
    if (imageUpload.isAnalyzing) return <Loader2 className="w-5 h-5 animate-spin" />;
    if (imageUpload.analysis) return <CheckCircle className="w-5 h-5 text-crd-green" />;
    if (imageUpload.error) return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <Sparkles className="w-5 h-5" />;
  };

  const getAnalysisStatusMessage = () => {
    if (imageUpload.isAnalyzing) return 'AI is analyzing your image and generating card details...';
    if (imageUpload.analysis) return 'Analysis complete! Your card details have been pre-filled.';
    if (imageUpload.error) return 'Analysis encountered issues, but smart defaults are ready.';
    return 'Upload a photo to start AI analysis';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Upload Your Photo</h2>
        <p className="text-crd-lightGray">
          Add the main photo for your card - this will be the centerpiece of your design
        </p>
      </div>

      {selectedTemplate && (
        <div className="p-4 bg-crd-blue/10 rounded-lg border border-crd-blue/30">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-crd-blue mt-0.5" />
            <div>
              <p className="text-white font-medium mb-1">Photo Tip for {selectedTemplate.name}</p>
              <p className="text-crd-lightGray text-sm">
                {getTemplateRecommendation()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Status */}
      <div className={`p-4 rounded-lg border transition-all ${
        imageUpload.analysis 
          ? 'bg-crd-green/10 border-crd-green/20' 
          : imageUpload.isAnalyzing
          ? 'bg-blue-500/10 border-blue-500/20'
          : imageUpload.error
          ? 'bg-yellow-500/10 border-yellow-500/20'
          : 'bg-crd-mediumGray/10 border-crd-mediumGray/20'
      }`}>
        <div className="flex items-center gap-3">
          {getAnalysisStatusIcon()}
          <div>
            <p className="text-white font-medium">
              {imageUpload.isAnalyzing ? 'AI Analysis in Progress' : 
               imageUpload.analysis ? 'AI Analysis Complete' :
               imageUpload.error ? 'Analysis Complete (with fallbacks)' :
               'Ready for AI Analysis'}
            </p>
            <p className="text-sm text-crd-lightGray">
              {getAnalysisStatusMessage()}
            </p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      {selectedPhoto ? (
        <div className="space-y-4">
          <div className="relative bg-crd-darkGray rounded-lg p-4 border border-crd-mediumGray/30">
            <img
              src={selectedPhoto}
              alt="Uploaded photo"
              className="w-full max-h-64 object-contain rounded-lg"
            />
            <div className="absolute top-2 right-2 bg-crd-green text-black px-2 py-1 rounded-md text-xs font-medium">
              ✓ Uploaded
            </div>
            {imageUpload.processedImage && (
              <div className="absolute bottom-2 left-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                {imageUpload.processedImage.dimensions.width} × {imageUpload.processedImage.dimensions.height} • {ImageProcessor.formatFileSize(imageUpload.processedImage.fileSize)}
              </div>
            )}
            {imageUpload.isLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <div className="text-center text-white">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm">
                    {imageUpload.isProcessing ? 'Processing...' : 'Analyzing...'}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => document.getElementById('photo-upload')?.click()}
              className="bg-transparent border-crd-green text-crd-green hover:bg-crd-green hover:text-black"
              disabled={imageUpload.isLoading}
            >
              Upload Different Photo
            </Button>
          </div>
        </div>
      ) : (
        <UniversalDropZone
          onFileSelect={imageUpload.uploadImage}
          isLoading={imageUpload.isLoading}
          title="Drop your photo here, or click to browse"
          description="Supports JPG, PNG, WebP • Max 10MB • AI analysis included"
        />
      )}

      {/* Hidden file input for "Upload Different Photo" button */}
      <input
        id="photo-upload"
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            await imageUpload.uploadImage(file);
          }
          e.target.value = '';
        }}
        className="hidden"
      />
    </div>
  );
};
