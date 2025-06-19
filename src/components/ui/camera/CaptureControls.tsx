
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RotateCcw, Download } from 'lucide-react';

interface CaptureControlsProps {
  isStreaming: boolean;
  capturedImage: string | null;
  onCapture: () => void;
  onRetake: () => void;
  onUsePhoto: () => void;
}

export const CaptureControls = ({
  isStreaming,
  capturedImage,
  onCapture,
  onRetake,
  onUsePhoto
}: CaptureControlsProps) => {
  if (capturedImage) {
    return (
      <div className="flex gap-3 justify-center">
        <Button
          onClick={onRetake}
          variant="outline"
          className="border-crd-mediumGray text-white"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Retake
        </Button>
        <Button
          onClick={onUsePhoto}
          className="bg-crd-green hover:bg-crd-green/90 text-black"
        >
          <Download className="w-4 h-4 mr-2" />
          Use Photo
        </Button>
      </div>
    );
  }

  if (isStreaming) {
    return (
      <div className="flex justify-center mt-4">
        <Button
          onClick={onCapture}
          size="lg"
          className="bg-crd-green hover:bg-crd-green/90 text-black px-8"
        >
          <Camera className="w-5 h-5 mr-2" />
          Capture Photo
        </Button>
      </div>
    );
  }

  return null;
};
