
import React from 'react';
import { Check } from 'lucide-react';

interface PhotoPreviewProps {
  imageUrl: string;
  onReplace: () => void;
}

export const PhotoPreview: React.FC<PhotoPreviewProps> = ({
  imageUrl,
  onReplace
}) => {
  return (
    <div 
      className="space-y-4 cursor-pointer" 
      onClick={onReplace}
    >
      <div className="w-32 h-40 mx-auto rounded-lg overflow-hidden border border-crd-mediumGray/30">
        <img 
          src={imageUrl} 
          alt="Uploaded" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2 text-crd-green">
          <Check className="w-5 h-5" />
          <span className="font-medium">Image Ready!</span>
        </div>
        <p className="text-crd-lightGray text-sm">Tap to upload a different image</p>
      </div>
    </div>
  );
};
