
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Wand2 } from 'lucide-react';

interface UploadProgressProps {
  progress: number;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  progress
}) => {
  return (
    <div className="space-y-4 w-full max-w-xs">
      <div className="w-16 h-16 mx-auto bg-crd-green/20 rounded-full flex items-center justify-center">
        <Wand2 className="w-8 h-8 text-crd-green animate-spin" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-crd-white mb-2">Processing Image</h3>
        <p className="text-crd-lightGray text-sm mb-4">Analyzing with AI...</p>
        <Progress value={progress} className="w-full" />
      </div>
    </div>
  );
};
