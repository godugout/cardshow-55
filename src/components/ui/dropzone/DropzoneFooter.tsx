
import React from 'react';

interface DropzoneFooterProps {
  variant: 'default' | 'compact' | 'minimal';
  maxSize: number;
  requiresHTTPS: boolean;
}

export const DropzoneFooter = ({ variant, maxSize, requiresHTTPS }: DropzoneFooterProps) => {
  if (variant === 'minimal') {
    return null;
  }

  return (
    <p className="text-crd-lightGray text-xs">
      Supports JPG, PNG, WebP • Max {Math.round(maxSize / (1024 * 1024))}MB
      {requiresHTTPS && (
        <span className="block text-yellow-400 mt-1">
          HTTPS required for camera access
        </span>
      )}
    </p>
  );
};
