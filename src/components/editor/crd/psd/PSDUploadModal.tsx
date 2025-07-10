import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileImage, X, Check } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { PSDLayer } from '@/types/psd';
import { processPSDFile } from '../import/CRDPSDProcessor';

interface PSDUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPSDProcessed: (layers: PSDLayer[], thumbnail: string) => void;
}

export const PSDUploadModal: React.FC<PSDUploadModalProps> = ({
  isOpen,
  onClose,
  onPSDProcessed
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const simulateProgress = (step: string, duration: number) => {
    setCurrentStep(step);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 100 / (duration / 50);
      setProgress(Math.min(currentProgress, 95));
      
      if (currentProgress >= 95) {
        clearInterval(interval);
      }
    }, 50);
    
    return interval;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file || !file.name.toLowerCase().endsWith('.psd')) {
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Step 1: File parsing
      const interval1 = simulateProgress('Parsing PSD file...', 1000);
      await new Promise(resolve => setTimeout(resolve, 1000));
      clearInterval(interval1);

      // Step 2: Layer extraction
      const interval2 = simulateProgress('Extracting layers...', 1500);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const layers = await processPSDFile(file);
      clearInterval(interval2);

      // Step 3: Generating preview
      const interval3 = simulateProgress('Generating preview...', 800);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate thumbnail
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 300;
      canvas.height = 420; // Card aspect ratio
      
      if (ctx) {
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PSD Preview', canvas.width / 2, canvas.height / 2);
      }
      
      const thumbnailUrl = canvas.toDataURL();
      setThumbnail(thumbnailUrl);
      clearInterval(interval3);

      setProgress(100);
      setCurrentStep('Complete!');
      
      // Wait a moment to show completion
      setTimeout(() => {
        onPSDProcessed(layers, thumbnailUrl);
        onClose();
      }, 800);

    } catch (error) {
      console.error('Error processing PSD:', error);
      setCurrentStep('Error processing file');
      setProgress(0);
      setIsProcessing(false);
    }
  }, [onPSDProcessed, onClose]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'image/vnd.adobe.photoshop': ['.psd']
    },
    maxFiles: 1,
    disabled: isProcessing
  });

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
      setProgress(0);
      setCurrentStep('');
      setThumbnail(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-crd-darker border-crd-mediumGray/20">
        <DialogHeader>
          <DialogTitle className="text-crd-white flex items-center gap-2">
            <FileImage className="w-5 h-5 text-crd-blue" />
            Import PSD File
          </DialogTitle>
          {!isProcessing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="absolute right-4 top-4 text-crd-lightGray hover:text-crd-white"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {!isProcessing ? (
            <>
              {/* Upload Area */}
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${isDragActive 
                    ? 'border-crd-blue bg-crd-blue/5' 
                    : 'border-crd-mediumGray/40 hover:border-crd-blue/60 bg-crd-darkest/50'
                  }
                `}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-crd-lightGray mx-auto mb-4" />
                <h3 className="text-lg font-medium text-crd-white mb-2">
                  {isDragActive ? 'Drop your PSD file here' : 'Upload PSD File'}
                </h3>
                <p className="text-crd-lightGray text-sm mb-4">
                  Drag and drop your Photoshop file or click to browse
                </p>
                <p className="text-xs text-crd-lightGray">
                  Supports .psd files up to 50MB
                </p>
              </div>

              {/* File Info */}
              {acceptedFiles.length > 0 && (
                <div className="bg-crd-darkest/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileImage className="w-8 h-8 text-crd-blue" />
                    <div>
                      <p className="font-medium text-crd-white">{acceptedFiles[0].name}</p>
                      <p className="text-sm text-crd-lightGray">
                        {(acceptedFiles[0].size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* What happens next */}
              <div className="bg-crd-blue/10 p-4 rounded-lg">
                <h4 className="font-medium text-crd-white mb-2">What happens next:</h4>
                <ul className="text-sm text-crd-lightGray space-y-1">
                  <li>• Layers will be extracted and made interactive</li>
                  <li>• You can control visibility and properties</li>
                  <li>• Generate smart frame suggestions</li>
                  <li>• Apply directly to your card canvas</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              {/* Processing */}
              <div className="text-center">
                {thumbnail && (
                  <div className="mb-6">
                    <img 
                      src={thumbnail} 
                      alt="PSD Preview" 
                      className="w-32 h-44 mx-auto rounded-lg border border-crd-mediumGray/20"
                    />
                  </div>
                )}
                
                <div className="mb-4">
                  <Progress value={progress} className="w-full" />
                </div>
                
                <div className="flex items-center justify-center gap-2 mb-2">
                  {progress >= 100 ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-crd-blue border-t-transparent rounded-full animate-spin" />
                  )}
                  <span className="text-crd-white font-medium">{currentStep}</span>
                </div>
                
                <p className="text-sm text-crd-lightGray">
                  {progress < 100 ? 'Please wait while we process your PSD file...' : 'Opening layer editor...'}
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};