
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CameraErrorProps {
  error: string;
  onRetry: () => void;
}

export const CameraError = ({ error, onRetry }: CameraErrorProps) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <X className="w-8 h-8 text-red-400" />
      </div>
      <p className="text-red-400 mb-4">{error}</p>
      <Button
        onClick={onRetry}
        className="bg-crd-green hover:bg-crd-green/90 text-black"
      >
        Try Again
      </Button>
    </div>
  );
};
