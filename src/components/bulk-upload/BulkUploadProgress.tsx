
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface BulkUploadProgressProps {
  progress: number;
}

export const BulkUploadProgress = ({ progress }: BulkUploadProgressProps) => {
  return (
    <div className="bg-crd-darker rounded-lg p-4 border border-crd-mediumGray/20">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white">Processing cards with AI analysis and improved image filling...</span>
        <span className="text-crd-lightGray">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="w-full" />
    </div>
  );
};
