
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileImage, Layers, Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner';
import { CRDElementsInterface } from '@/components/crdElements/CRDElementsInterface';
import type { CardData } from '@/hooks/useCardEditor';

interface UploadPhaseProps {
  cardEditor: {
    cardData: CardData;
    updateCardField: (field: keyof CardData, value: any) => void;
  };
  onComplete: () => void;
}

type UploadMode = 'simple' | 'psd' | 'batch';

export const UploadPhase = ({ cardEditor, onComplete }: UploadPhaseProps) => {
  const [selectedMode, setSelectedMode] = useState<UploadMode | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      cardEditor.updateCardField('image_url', url);
      cardEditor.updateCardField('thumbnail_url', url);
      toast.success('Image uploaded successfully!');
    }
  }, [cardEditor]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
      'application/photoshop': ['.psd']
    },
    maxFiles: 1
  });

  const handleModeSelect = (mode: UploadMode) => {
    setSelectedMode(mode);
  };

  const handleContinue = () => {
    if (uploadedFile || cardEditor.cardData.image_url) {
      onComplete();
    } else {
      toast.error('Please upload an image first');
    }
  };

  const uploadModes = [
    {
      id: 'simple' as const,
      title: 'Simple Upload',
      description: 'Upload any image file (JPG, PNG, GIF, WebP)',
      icon: Upload,
      features: ['Quick upload', 'Auto-optimization', 'Instant preview'],
      recommended: true
    },
    {
      id: 'psd' as const,
      title: 'PSD Processing',
      description: 'Advanced Photoshop file processing with layer extraction',
      icon: Layers,
      features: ['Layer extraction', 'Smart regions', 'Professional workflow'],
      premium: true
    },
    {
      id: 'batch' as const,
      title: 'Batch Upload',
      description: 'Upload multiple images for batch processing',
      icon: Sparkles,
      features: ['Multiple files', 'Consistent styling', 'Bulk operations'],
      advanced: true
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-crd-white mb-4">Upload Your Content</h2>
        <p className="text-crd-lightGray text-lg max-w-2xl mx-auto">
          Choose your upload method and add your creative content to begin the card creation process
        </p>
      </div>

      {/* Upload Mode Selection */}
      {!selectedMode && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {uploadModes.map((mode) => {
            const Icon = mode.icon;
            
            return (
              <Card
                key={mode.id}
                className="cursor-pointer transition-all hover:scale-105 bg-crd-darker border-crd-mediumGray/20 hover:border-crd-green/50"
                onClick={() => handleModeSelect(mode.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      mode.recommended ? 'bg-crd-green/20' : 'bg-crd-mediumGray/20'
                    }`}>
                      <Icon className={`w-8 h-8 ${
                        mode.recommended ? 'text-crd-green' : 'text-crd-lightGray'
                      }`} />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h3 className="font-semibold text-crd-white">{mode.title}</h3>
                    {mode.recommended && (
                      <span className="bg-crd-green/20 text-crd-green text-xs px-2 py-1 rounded-full">
                        Recommended
                      </span>
                    )}
                    {mode.premium && (
                      <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-full">
                        Premium
                      </span>
                    )}
                    {mode.advanced && (
                      <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                        Advanced
                      </span>
                    )}
                  </div>
                  
                  <p className="text-crd-lightGray text-sm mb-4">{mode.description}</p>
                  
                  <div className="space-y-1">
                    {mode.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-crd-lightGray">
                        <div className="w-1 h-1 bg-crd-green rounded-full" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Upload Interface */}
      {selectedMode === 'simple' && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <CRDButton
              variant="outline"
              onClick={() => setSelectedMode(null)}
              className="border-crd-mediumGray/30 text-crd-lightGray"
            >
              ← Back to Modes
            </CRDButton>
            <h3 className="text-xl font-semibold text-crd-white">Simple Image Upload</h3>
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center transition-colors cursor-pointer ${
              isDragActive
                ? 'border-crd-green bg-crd-green/10'
                : 'border-crd-mediumGray/30 hover:border-crd-green/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-16 h-16 text-crd-mediumGray mb-4" />
            <p className="text-crd-white font-medium mb-2">
              {isDragActive ? 'Drop your image here' : 'Drag & drop your image here'}
            </p>
            <p className="text-crd-lightGray text-sm mb-4">
              or click to browse your files
            </p>
            <CRDButton className="bg-crd-green text-black">
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </CRDButton>
          </div>

          {previewUrl && (
            <div className="flex items-center justify-center">
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-sm max-h-64 rounded-lg border border-crd-mediumGray/20"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                  <Check className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedMode === 'psd' && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <CRDButton
              variant="outline"
              onClick={() => setSelectedMode(null)}
              className="border-crd-mediumGray/30 text-crd-lightGray"
            >
              ← Back to Modes
            </CRDButton>
            <h3 className="text-xl font-semibold text-crd-white">PSD Processing Workflow</h3>
          </div>

          <CRDElementsInterface onProcessComplete={handleContinue} />
        </div>
      )}

      {selectedMode === 'batch' && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <CRDButton
              variant="outline"
              onClick={() => setSelectedMode(null)}
              className="border-crd-mediumGray/30 text-crd-lightGray"
            >
              ← Back to Modes
            </CRDButton>
            <h3 className="text-xl font-semibold text-crd-white">Batch Upload Processing</h3>
          </div>

          <div className="bg-crd-darker rounded-xl p-8 text-center">
            <Sparkles className="w-16 h-16 text-crd-blue mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-crd-white mb-2">Batch Processing</h4>
            <p className="text-crd-lightGray mb-6">
              Upload multiple images and apply consistent styling across all cards
            </p>
            <CRDButton className="bg-crd-blue text-white">
              Coming Soon
            </CRDButton>
          </div>
        </div>
      )}

      {/* Continue Button */}
      {(uploadedFile || cardEditor.cardData.image_url) && selectedMode === 'simple' && (
        <div className="flex justify-center">
          <CRDButton
            onClick={handleContinue}
            className="bg-crd-green text-black hover:bg-crd-green/90 px-8 py-3"
          >
            Continue to Frame Selection
            <FileImage className="w-4 h-4 ml-2" />
          </CRDButton>
        </div>
      )}
    </div>
  );
};
