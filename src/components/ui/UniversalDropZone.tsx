
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { DesktopCameraCapture } from './DesktopCameraCapture';
import { toast } from 'sonner';
import { useDropzoneLogic } from './dropzone/useDropzoneLogic';
import { useCameraHandlers } from './dropzone/useCameraHandlers';
import { DropzoneContent } from './dropzone/DropzoneContent';
import { DropzoneActions } from './dropzone/DropzoneActions';
import { DropzoneFooter } from './dropzone/DropzoneFooter';

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
  const [showDesktopCamera, setShowDesktopCamera] = useState(false);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzoneLogic({
    onFileSelect,
    isLoading,
    disabled,
    accept,
    maxFiles,
    maxSize
  });

  const { capabilities, handleCameraClick } = useCameraHandlers({
    onFileSelect,
    onShowDesktopCamera: setShowDesktopCamera
  });

  const handleDesktopCameraCapture = (file: File) => {
    onFileSelect(file);
    setShowDesktopCamera(false);
    toast.success('Photo captured successfully!');
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

  const handleBrowseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    open();
  };

  const handleCameraButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleCameraClick();
  };

  return (
    <>
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
        
        <DropzoneContent
          isLoading={isLoading}
          isDragActive={isDragActive}
          variant={variant}
          title={title}
          description={description}
        />

        <DropzoneActions
          isLoading={isLoading}
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
