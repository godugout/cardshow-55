
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Camera, FileImage, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface UniversalDropZoneProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  disabled?: boolean;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
  showCameraButton?: boolean;
  title?: string;
  description?: string;
}

export const UniversalDropZone = ({
  onFileSelect,
  isLoading = false,
  disabled = false,
  accept = { 'image/*': [] },
  maxFiles = 1,
  maxSize = 10 * 1024 * 1024, // 10MB
  className,
  variant = 'default',
  showCameraButton = true,
  title,
  description
}: UniversalDropZoneProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
    disabled: disabled || isLoading,
    noClick: true,
    noKeyboard: true
  });

  const handleCameraClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) onFileSelect(file);
    };
    input.click();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return 'p-4 min-h-[120px]';
      case 'minimal':
        return 'p-3 min-h-[80px] border border-dashed';
      default:
        return 'p-8 min-h-[200px]';
    }
  };

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
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg text-center cursor-pointer transition-all',
        'hover:border-crd-green/50 hover:bg-crd-green/5',
        isDragActive && 'border-crd-green bg-crd-green/10',
        disabled && 'opacity-50 cursor-not-allowed',
        isLoading && 'pointer-events-none',
        variant === 'default' && 'border-crd-mediumGray',
        variant === 'compact' && 'border-crd-mediumGray/50',
        variant === 'minimal' && 'border-crd-lightGray',
        getVariantStyles(),
        className
      )}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center gap-3">
        {isLoading ? (
          <Loader2 className="w-8 h-8 animate-spin text-crd-green" />
        ) : (
          <div className={cn(
            'rounded-full flex items-center justify-center',
            variant === 'minimal' ? 'w-8 h-8 bg-crd-mediumGray/20' : 'w-12 h-12 bg-crd-mediumGray/30'
          )}>
            <Upload className={cn(
              'text-crd-lightGray',
              variant === 'minimal' ? 'w-4 h-4' : 'w-6 h-6'
            )} />
          </div>
        )}
        
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

        {!isLoading && variant !== 'minimal' && (
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              disabled={disabled}
              className="bg-crd-green hover:bg-crd-green/90 text-black"
              size={variant === 'compact' ? 'sm' : 'default'}
            >
              <FileImage className="w-4 h-4 mr-2" />
              Browse Files
            </Button>

            {showCameraButton && (
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCameraClick();
                }}
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
        )}

        {variant !== 'minimal' && (
          <p className="text-crd-lightGray text-xs">
            Supports JPG, PNG, WebP • Max {Math.round(maxSize / (1024 * 1024))}MB
          </p>
        )}
      </div>
    </div>
  );
};
