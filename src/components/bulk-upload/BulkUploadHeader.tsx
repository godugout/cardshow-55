
import React from 'react';
import { Button } from '@/components/ui/button';

interface BulkUploadHeaderProps {
  onViewGallery: () => void;
}

export const BulkUploadHeader = ({ onViewGallery }: BulkUploadHeaderProps) => {
  return (
    <div className="bg-crd-darker border-b border-crd-mediumGray/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Bulk Card Upload</h1>
        <Button
          onClick={onViewGallery}
          variant="outline"
          className="border-crd-mediumGray/20 text-white"
        >
          View Gallery
        </Button>
      </div>
    </div>
  );
};
