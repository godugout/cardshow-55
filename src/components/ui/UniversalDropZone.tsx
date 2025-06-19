
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { DesktopCameraCapture } from './DesktopCameraCapture';
import { toast } from 'sonner';
import { useDropzoneLogic } from './dropzone/useDropzoneLogic';
import { useCameraHandlers } from './dropzone/useCameraHandlers';
import { DropzoneContent } from './dropzone/DropzoneContent';
import { DropzoneActions } from './dropzone/DropzoneActions';
import { DropzoneFooter } from './dropzone/DropzoneFooter';
import { useFileUpload } from '@/hooks/useFileUpload';

export interface UniversalDropZoneProps {
  onFileSelect: (file: File) => void;
  onUploadComplete?: (result: { url: string; path: string }) => void;
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
  autoUpload?: boolean;
  bucket?: 'card-images' | 'user-uploads';
  folder?: string;
}

export const UniversalDropZone = ({
  onFileSelect,
  onUploadComplete,
  isLoading = false,
  disabled = false,
  accept = { 'image/*': [] },
  maxFiles = 1,
  maxSize = 10 * 1024 * 1024, // 10MB
  className,
  variant = 'default',
  showCameraButton = true,
  title,
  description,
  autoUpload = true,
  bucket = 'user-uploads',
  folder = 'general'
}: UniversalDropZoneProps) => {
  const [showDesktopCamera, setShowDesktopCamera] = useState(false);

  const fileUpload = useFileUpload({
    bucket,
    folder,
    generateThumbnail: true,
    onSuccess: (result) => {
      onUploadComplete?.(result);
      toast.success('Upload complete!');
    },
    onError: (error) => {
      toast.error(`Upload failed: ${error}`);
    }
  });

  const handleFileSelection = async (file: File) => {
    try {
      onFileSelect(file);
      
      if (autoUpload) {
        await fileUpload.uploadFile(file);
      }
    } catch (error) {
      console.error('File selection/upload error:', error);
    }
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzoneLogic({
    onFileSelect: handleFileSelection,
    isLoading: isLoading || fileUpload.isUploading,
    disabled,
    accept,
    maxFiles,
    maxSize
  });

  const { capabilities, handleCameraClick } = useCameraHandlers({
    onFileSelect: handleFileSelection,
    onShowDesktopCamera: setShowDesktopCamera
  });

  const handleDesktopCameraCapture = async (file: File) => {
    await handleFileSelection(file);
    setShowDesktopCamera(false);
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

  const shouldShowCameraButton = showCameraButton && (
    capabilities.hasCamera || capabilities.isMobile
  );

  const handleBrowseClick = () => {
    open();
  };

  const handleCameraButtonClick = () => {
    handleCameraClick();
  };

  const currentLoading = isLoading || fileUpload.isUploading;

  return (
    <>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg text-center cursor-pointer transition-all',
          'hover:border-crd-green/50 hover:bg-crd-green/5',
          isDragActive && 'border-crd-green bg-crd-green/10',
          disabled && 'opacity-50 cursor-not-allowed',
          currentLoading && 'pointer-events-none',
          variant === 'default' && 'border-crd-mediumGray',
          variant === 'compact' && 'border-crd-mediumGray/50',
          variant === 'minimal' && 'border-crd-lightGray',
          getVariantStyles(),
          className
        )}
      >
        <input {...getInputProps()} />
        
        <DropzoneContent
          isLoading={currentLoading}
          isDragActive={isDragActive}
          variant={variant}
          title={title}
          description={description}
        />

        <DropzoneActions
          isLoading={currentLoading}
          disabled={disabled}
          variant={variant}
          shouldShowCameraButton={shouldShowCameraButton}
          onBrowseClick={handleBrowseClick}
          onCameraClick={handleCameraButtonClick}
        />

        <DropzoneFooter
          variant={variant}
          maxSize={maxSize}
          requiresHTTPS={capabilities.requiresHTTPS}
        />

        {/* Upload Progress */}
        {fileUpload.isUploading && fileUpload.progress > 0 && (
          <div className="mt-4">
            <div className="w-full bg-crd-mediumGray/30 rounded-full h-2">
              <div 
                className="bg-crd-green h-2 rounded-full transition-all duration-300"
                style={{ width: `${fileUpload.progress}%` }}
              />
            </div>
            <p className="text-xs text-crd-lightGray mt-1">
              Uploading... {fileUpload.progress}%
            </p>
          </div>
        )}
      </div>

      {/* Desktop Camera Capture Dialog */}
      <DesktopCameraCapture
        isOpen={showDesktopCamera}
        onClose={() => setShowDesktopCamera(false)}
        onCapture={handleDesktopCameraCapture}
        title="Capture Photo"
      />
    </>
  );
};
