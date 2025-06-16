
import React from 'react';
import { Check } from 'lucide-react';

interface PhotoPreviewProps {
  selectedPhoto: string | null;
  imageDetails: {
    dimensions: { width: number; height: number };
    aspectRatio: number;
    fileSize: string;
  } | null;
}

export const PhotoPreview = ({ selectedPhoto, imageDetails }: PhotoPreviewProps) => {
  return (
    <div className="flex justify-center">
      <div className="bg-crd-mediumGray rounded-lg p-8 border-2 border-dashed border-crd-lightGray/30 max-w-md">
        {selectedPhoto ? (
          <div className="space-y-4">
            <div className="relative bg-white p-2 rounded-lg shadow-lg" style={{ width: 200, height: 280 }}>
              <img 
                src={selectedPhoto} 
                alt="Card preview" 
                className="w-full h-full object-cover rounded"
              />
              <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1 rounded">
                Card Preview
              </div>
            </div>
            
            <div className="text-crd-green text-sm flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              Photo optimized for card format!
            </div>
            
            {imageDetails && (
              <div className="text-crd-lightGray text-xs space-y-1">
                <div>Original: {imageDetails.dimensions.width}×{imageDetails.dimensions.height}</div>
                <div>Size: {imageDetails.fileSize}</div>
                <div>Ratio: {imageDetails.aspectRatio.toFixed(2)}:1</div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center" style={{ width: 200, height: 280 }}>
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 text-crd-lightGray mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17,8 12,3 7,8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p className="text-white text-lg mb-2">Drop your image here</p>
              <p className="text-crd-lightGray text-sm">or click to browse</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
