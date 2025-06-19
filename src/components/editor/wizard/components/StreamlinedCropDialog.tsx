
import React from 'react';
import { EnhancedCropDialog } from './EnhancedCropDialog';
import type { CropBounds } from '@/services/imageCropper';

interface StreamlinedCropDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPhoto: string;
  originalFile: File | null;
  onCropComplete: (croppedImageUrl: string) => void;
  initialFormat?: 'fullCard' | 'cropped';
}

export const StreamlinedCropDialog = (props: StreamlinedCropDialogProps) => {
  // Use the enhanced crop dialog instead
  return <EnhancedCropDialog {...props} />;
};
