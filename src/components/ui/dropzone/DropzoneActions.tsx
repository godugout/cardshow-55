
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileImage, Camera } from 'lucide-react';

interface DropzoneActionsProps {
  isLoading: boolean;
  disabled: boolean;
  variant: 'default' | 'compact' | 'minimal';
  shouldShowCameraButton: boolean;
  onBrowseClick: () => void;
  onCameraClick: () => void;
}

export const DropzoneActions = ({
  isLoading,
  disabled,
  variant,
  shouldShowCameraButton,
  onBrowseClick,
  onCameraClick
}: DropzoneActionsProps) => {
  if (isLoading || variant === 'minimal') {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        onClick={onBrowseClick}
        disabled={disabled}
        className="bg-crd-green hover:bg-crd-green/90 text-black"
        size={variant === 'compact' ? 'sm' : 'default'}
      >
        <FileImage className="w-4 h-4 mr-2" />
        Browse Files
      </Button>

      {shouldShowCameraButton && (
        <Button
          type="button"
          onClick={onCameraClick}
          disabled={disabled}
          variant="outline"
          className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray hover:text-white"
          size={variant === 'compact' ? 'sm' : 'default'}
        >
          <Camera className="w-4 h-4 mr-2" />
          Camera
        </Button>
      )}
    </div>
  );
};
