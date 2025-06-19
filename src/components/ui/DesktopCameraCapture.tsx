
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCameraStream } from './camera/useCameraStream';
import { CameraPreview } from './camera/CameraPreview';
import { CaptureControls } from './camera/CaptureControls';
import { CameraError } from './camera/CameraError';
import { CapturedImagePreview } from './camera/CapturedImagePreview';

interface DesktopCameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
  title?: string;
}

export const DesktopCameraCapture = ({
  isOpen,
  onClose,
  onCapture,
  title = "Capture Photo"
}: DesktopCameraCaptureProps) => {
  const {
    isInitializing,
    isStreaming,
    error,
    capturedImage,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    capturePhoto,
    handleRetake,
    reset
  } = useCameraStream();

  const handleUsePhoto = () => {
    if (!capturedImage || !canvasRef.current) return;

    canvasRef.current.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
            type: 'image/jpeg'
          });
          onCapture(file);
          onClose();
          reset();
        }
      },
      'image/jpeg',
      0.9
    );
  };

  const handleClose = () => {
    stopCamera();
    reset();
    onClose();
  };

  // Initialize camera when dialog opens
  useEffect(() => {
    if (isOpen && !capturedImage && !error && !isStreaming && !isInitializing) {
      console.log('🚀 Dialog opened, starting camera...');
      startCamera();
    }
    
    // Cleanup on unmount or close
    return () => {
      if (!isOpen) {
        stopCamera();
      }
    };
  }, [isOpen, capturedImage, error, isStreaming, isInitializing, startCamera, stopCamera]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-crd-darker border-crd-mediumGray">
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error ? (
            <CameraError error={error} onRetry={startCamera} />
          ) : capturedImage ? (
            <>
              <CapturedImagePreview capturedImage={capturedImage} />
              <CaptureControls
                isStreaming={false}
                capturedImage={capturedImage}
                onCapture={capturePhoto}
                onRetake={handleRetake}
                onUsePhoto={handleUsePhoto}
              />
            </>
          ) : (
            <div className="relative">
              <CameraPreview
                videoRef={videoRef}
                isStreaming={isStreaming}
                isInitializing={isInitializing}
              />
              
              <CaptureControls
                isStreaming={isStreaming}
                capturedImage={null}
                onCapture={capturePhoto}
                onRetake={handleRetake}
                onUsePhoto={handleUsePhoto}
              />
            </div>
          )}

          {/* Hidden canvas for photo capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </DialogContent>
    </Dialog>
  );
};
