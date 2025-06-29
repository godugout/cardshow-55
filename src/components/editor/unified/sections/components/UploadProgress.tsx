
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Brain, Sparkles } from 'lucide-react';

interface UploadProgressProps {
  progress: number;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  progress
}) => {
  const getStatusMessage = () => {
    if (progress < 20) return 'Loading image...';
    if (progress < 40) return 'Extracting text with OCR...';
    if (progress < 60) return 'Classifying image content...';
    if (progress < 80) return 'Detecting regions and objects...';
    if (progress < 100) return 'Analyzing colors and patterns...';
    return 'Analysis complete!';
  };

  const getIcon = () => {
    if (progress < 50) {
      return <Brain className="w-8 h-8 text-crd-green animate-pulse" />;
    }
    return <Sparkles className="w-8 h-8 text-crd-green animate-spin" />;
  };

  return (
    <div className="space-y-4 w-full max-w-xs">
      <div className="w-16 h-16 mx-auto bg-crd-green/20 rounded-full flex items-center justify-center">
        {getIcon()}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-crd-white mb-2">AI Analysis</h3>
        <p className="text-crd-lightGray text-sm mb-4">{getStatusMessage()}</p>
        <Progress value={progress} className="w-full" />
        <p className="text-crd-mediumGray text-xs mt-2 text-center">
          {progress}% complete
        </p>
      </div>
    </div>
  );
};
