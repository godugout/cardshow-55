
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CRDButton } from '@/components/ui/design-system/Button';
import { PSDLayerManager } from './PSDLayerManager';
import { toast } from 'sonner';
import { Upload, FileImage, X } from 'lucide-react';

interface PSDUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onFrameGenerated: (frameData: any) => void;
  userImage?: string;
}

export const PSDUploadDialog: React.FC<PSDUploadDialogProps> = ({
  isOpen,
  onClose,
  onFrameGenerated,
  userImage
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showLayerManager, setShowLayerManager] = useState(false);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const fileName = file.name.toLowerCase();
    const isValidPSD = fileName.endsWith('.psd') || file.type.includes('photoshop');
    
    if (!isValidPSD) {
      toast.error('Please select a valid PSD file');
      return;
    }

    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast.error('File size too large. Please select a file under 100MB');
      return;
    }

    setSelectedFile(file);
    setShowLayerManager(true);
    toast.success(`PSD file selected: ${file.name}`);
  }, []);

  const handleFrameGenerated = useCallback((frameData: any) => {
    onFrameGenerated(frameData);
    handleClose();
  }, [onFrameGenerated]);

  const handleClose = useCallback(() => {
    setSelectedFile(null);
    setShowLayerManager(false);
    onClose();
  }, [onClose]);

  const triggerFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.psd,.psb';
    input.style.display = 'none';
    
    // Fix: Use proper event type casting
    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const syntheticEvent = {
        target,
        currentTarget: target,
        nativeEvent: event,
        isDefaultPrevented: () => false,
        isPropagationStopped: () => false,
        persist: () => {},
        preventDefault: () => event.preventDefault(),
        stopPropagation: () => event.stopPropagation()
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleFileSelect(syntheticEvent);
    };
    
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] bg-crd-darker border-crd-mediumGray/20 text-crd-white overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold text-crd-white">
            Create Frame from PSD
          </DialogTitle>
          <CRDButton
            variant="outline"
            size="sm"
            onClick={handleClose}
            className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
          >
            <X className="w-4 h-4" />
          </CRDButton>
        </DialogHeader>

        {!showLayerManager ? (
          // File Upload Interface
          <div className="py-8">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-crd-green/20 rounded-lg mx-auto flex items-center justify-center">
                <FileImage className="w-8 h-8 text-crd-green" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-crd-white mb-2">
                  Upload Your PSD File
                </h3>
                <p className="text-crd-lightGray max-w-md mx-auto">
                  Select a Photoshop PSD file to extract layers and create a custom card frame. 
                  We'll help you choose which layers to include in your frame.
                </p>
              </div>

              <div className="space-y-4">
                <CRDButton
                  onClick={triggerFileSelect}
                  className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold px-8 py-3"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Select PSD File
                </CRDButton>
                
                <div className="text-sm text-crd-mediumGray space-y-1">
                  <p>• Supported formats: .psd, .psb</p>
                  <p>• Maximum file size: 100MB</p>
                  <p>• Layers will be extracted automatically</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // PSD Layer Manager
          selectedFile && (
            <div className="overflow-auto max-h-[80vh]">
              <PSDLayerManager
                psdFile={selectedFile}
                userImage={userImage}
                onFrameGenerated={handleFrameGenerated}
                onCancel={handleClose}
              />
            </div>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};
