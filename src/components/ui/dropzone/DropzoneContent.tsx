
import React from 'react';
import { cn } from '@/lib/utils';
import { DropzoneIcon } from './DropzoneIcon';

interface DropzoneContentProps {
  isLoading: boolean;
  isDragActive: boolean;
  variant: 'default' | 'compact' | 'minimal';
  title?: string;
  description?: string;
}

export const DropzoneContent = ({
  isLoading,
  isDragActive,
  variant,
  title,
  description
}: DropzoneContentProps) => {
  const getDefaultTitle = () => {
    if (variant === 'minimal') return 'Upload Image';
    return isDragActive ? 'Drop image here' : (title || 'Upload Your Image');
  };

  const getDefaultDescription = () => {
    if (variant === 'minimal') return 'Click to browse';
    return isDragActive 
      ? 'Release to upload' 
      : (description || 'Drag and drop your image here, or click to browse');
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <DropzoneIcon isLoading={isLoading} variant={variant} />
      
      <div className="space-y-1">
        <p className={cn(
          'text-white font-medium',
          variant === 'minimal' ? 'text-sm' : 'text-lg'
        )}>
          {getDefaultTitle()}
        </p>
        {variant !== 'minimal' && (
          <p className={cn(
            'text-crd-lightGray',
            variant === 'compact' ? 'text-xs' : 'text-sm'
          )}>
            {getDefaultDescription()}
          </p>
        )}
      </div>
    </div>
  );
};
