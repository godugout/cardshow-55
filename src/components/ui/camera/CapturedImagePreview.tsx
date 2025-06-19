
import React from 'react';

interface CapturedImagePreviewProps {
  capturedImage: string;
}

export const CapturedImagePreview = ({ capturedImage }: CapturedImagePreviewProps) => {
  return (
    <div className="text-center">
      <div className="relative bg-black rounded-lg overflow-hidden mb-4">
        <img
          src={capturedImage}
          alt="Captured photo"
          className="w-full h-auto max-h-96 object-contain"
        />
      </div>
    </div>
  );
};
