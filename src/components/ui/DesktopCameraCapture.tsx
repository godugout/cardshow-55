
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, X, RotateCcw, Download } from 'lucide-react';
import { toast } from 'sonner';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Camera permission denied. Please allow camera access and try again.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera found on this device.');
        } else if (err.name === 'NotSupportedError') {
          setError('Camera not supported. Please ensure you\'re using HTTPS.');
        } else {
          setError('Failed to access camera. Please check your camera permissions.');
        }
      } else {
        setError('Unknown camera error occurred.');
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob and create file
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
            type: 'image/jpeg'
          });
          
          // Create preview URL
          const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
          setCapturedImage(imageUrl);
          
          // Stop camera stream
          stopCamera();
        }
      },
      'image/jpeg',
      0.9
    );
  }, [stopCamera]);

  const handleRetake = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const handleUsePhoto = useCallback(() => {
    if (!capturedImage || !canvasRef.current) return;

    canvasRef.current.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
            type: 'image/jpeg'
          });
          onCapture(file);
          onClose();
          setCapturedImage(null);
        }
      },
      'image/jpeg',
      0.9
    );
  }, [capturedImage, onCapture, onClose]);

  const handleClose = useCallback(() => {
    stopCamera();
    setCapturedImage(null);
    setError(null);
    onClose();
  }, [stopCamera, onClose]);

  // Start camera when dialog opens
  useEffect(() => {
    if (isOpen && !capturedImage && !error) {
      startCamera();
    }
    
    // Cleanup on unmount
    return () => {
      stopCamera();
    };
  }, [isOpen, capturedImage, error, startCamera, stopCamera]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-crd-darker border-crd-mediumGray">
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-red-400 mb-4">{error}</p>
              <Button
                onClick={startCamera}
                className="bg-crd-green hover:bg-crd-green/90 text-black"
              >
                Try Again
              </Button>
            </div>
          ) : capturedImage ? (
            <div className="text-center">
              <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                <img
                  src={capturedImage}
                  alt="Captured photo"
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={handleRetake}
                  variant="outline"
                  className="border-crd-mediumGray text-white"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake
                </Button>
                <Button
                  onClick={handleUsePhoto}
                  className="bg-crd-green hover:bg-crd-green/90 text-black"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Use Photo
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="bg-black rounded-lg overflow-hidden aspect-video">
                {isStreaming ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-crd-green/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Camera className="w-8 h-8 text-crd-green" />
                      </div>
                      <p className="text-crd-lightGray">Starting camera...</p>
                    </div>
                  </div>
                )}
              </div>
              
              {isStreaming && (
                <div className="flex justify-center mt-4">
                  <Button
                    onClick={capturePhoto}
                    size="lg"
                    className="bg-crd-green hover:bg-crd-green/90 text-black px-8"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Capture Photo
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Hidden canvas for photo capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </DialogContent>
    </Dialog>
  );
};
