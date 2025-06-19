
import React from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropzoneIconProps {
  isLoading: boolean;
  variant: 'default' | 'compact' | 'minimal';
}

export const DropzoneIcon = ({ isLoading, variant }: DropzoneIconProps) => {
  if (isLoading) {
    return <Loader2 className="w-8 h-8 animate-spin text-crd-green" />;
  }

  return (
    <div className={cn(
      'rounded-full flex items-center justify-center',
      variant === 'minimal' ? 'w-8 h-8 bg-crd-mediumGray/20' : 'w-12 h-12 bg-crd-mediumGray/30'
    )}>
      <Upload className={cn(
        'text-crd-lightGray',
        variant === 'minimal' ? 'w-4 h-4' : 'w-6 h-6'
      )} />
    </div>
  );
};
