
import React from 'react';
import { Button } from '@/components/ui/button';
import { Scissors, Sparkles } from 'lucide-react';

interface UploadActionsProps {
  selectedPhoto: string | null;
  isAnalyzing: boolean;
  onFileSelect: () => void;
  onAdvancedCrop: () => void;
}

export const UploadActions = ({ 
  selectedPhoto, 
  isAnalyzing, 
  onFileSelect, 
  onAdvancedCrop 
}: UploadActionsProps) => {
  return (
    <div className="space-y-4">
      {/* Upload Actions */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={onFileSelect}
          variant="ghost"
          className="bg-crd-mediumGray/30 border border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/50 hover:text-white hover:border-crd-lightGray"
          disabled={isAnalyzing}
        >
          Choose File
        </Button>
        {selectedPhoto && (
          <Button
            onClick={onAdvancedCrop}
            className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
            disabled={isAnalyzing}
          >
            <Scissors className="w-4 h-4 mr-2" />
            Advanced Crop
          </Button>
        )}
      </div>

      {/* Status Messages */}
      {isAnalyzing && (
        <div className="flex items-center justify-center gap-2 text-crd-green">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="text-sm">AI is analyzing your image...</span>
        </div>
      )}
    </div>
  );
};
