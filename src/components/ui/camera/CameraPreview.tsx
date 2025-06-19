
import React from 'react';
import { Camera } from 'lucide-react';

interface CameraPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isStreaming: boolean;
  isInitializing: boolean;
}

export const CameraPreview = ({ videoRef, isStreaming, isInitializing }: CameraPreviewProps) => {
  return (
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
            <p className="text-crd-lightGray">
              {isInitializing ? 'Starting camera...' : 'Initializing...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
