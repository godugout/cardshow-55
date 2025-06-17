
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface BulkUploadControlsProps {
  uploadedFilesCount: number;
  completedCount: number;
  pendingCount: number;
  errorCount: number;
  isProcessing: boolean;
  onProcessFiles: () => void;
  onViewGallery: () => void;
}

export const BulkUploadControls = ({
  uploadedFilesCount,
  completedCount,
  pendingCount,
  errorCount,
  isProcessing,
  onProcessFiles,
  onViewGallery
}: BulkUploadControlsProps) => {
  return (
    <div className="flex items-center justify-between bg-crd-darker rounded-lg p-4 border border-crd-mediumGray/20">
      <div className="flex items-center gap-4">
        <span className="text-white font-medium">
          {uploadedFilesCount} images uploaded
        </span>
        <div className="flex gap-4 text-sm">
          <span className="text-green-400">{completedCount} completed</span>
          <span className="text-yellow-400">{pendingCount} pending</span>
          {errorCount > 0 && <span className="text-red-400">{errorCount} errors</span>}
        </div>
      </div>
      
      <div className="flex gap-3">
        <Button
          onClick={onProcessFiles}
          disabled={isProcessing || pendingCount === 0}
          className="bg-crd-green hover:bg-crd-green/90 text-black"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {isProcessing ? 'Processing...' : `Create ${pendingCount} Cards`}
        </Button>
        
        {completedCount > 0 && (
          <Button
            onClick={onViewGallery}
            variant="outline"
            className="border-crd-mediumGray/20 text-white"
          >
            View in Gallery
          </Button>
        )}
      </div>
    </div>
  );
};
