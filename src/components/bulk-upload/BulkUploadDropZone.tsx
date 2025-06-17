
import React from 'react';
import { Card } from '@/components/ui/card';
import { Upload, Image, Sparkles } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

interface BulkUploadDropZoneProps {
  onFilesAdded: (files: File[]) => void;
}

export const BulkUploadDropZone = ({ onFilesAdded }: BulkUploadDropZoneProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      onFilesAdded(acceptedFiles);
      toast.success(`Added ${acceptedFiles.length} images for processing`);
    }
  });

  return (
    <Card className="bg-crd-darker border-crd-mediumGray/20 p-8 max-w-4xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-16 text-center transition-all cursor-pointer ${
          isDragActive 
            ? 'border-crd-green bg-crd-green/10 scale-105' 
            : 'border-crd-mediumGray hover:border-crd-green/50 hover:bg-crd-green/5'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-6">
          {/* Icon */}
          <div className="relative">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all ${
              isDragActive ? 'bg-crd-green/20' : 'bg-crd-green/10'
            }`}>
              <Upload className={`w-10 h-10 transition-all ${
                isDragActive ? 'text-crd-green scale-110' : 'text-crd-green'
              }`} />
            </div>
            
            {/* Floating icons */}
            <Image className="w-6 h-6 text-crd-blue absolute -top-2 -right-2 animate-bounce" />
            <Sparkles className="w-5 h-5 text-crd-green absolute -bottom-1 -left-1 animate-pulse" />
          </div>
          
          {/* Main text */}
          <div>
            <h3 className={`text-3xl font-bold mb-3 transition-colors ${
              isDragActive ? 'text-crd-green' : 'text-white'
            }`}>
              {isDragActive ? 'Drop your images here!' : 'Drop your card images'}
            </h3>
            <p className="text-crd-lightGray text-lg mb-2">
              {isDragActive 
                ? 'Release to start processing with AI analysis' 
                : 'Drag and drop multiple images, or click to browse'
              }
            </p>
            <p className="text-crd-lightGray text-base">
              AI will automatically analyze and create cards with metadata
            </p>
          </div>
          
          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-crd-green">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Analysis</span>
            </div>
            <div className="flex items-center gap-2 text-crd-blue">
              <Image className="w-4 h-4" />
              <span>Smart Cropping</span>
            </div>
            <div className="flex items-center gap-2 text-crd-lightGray">
              <Upload className="w-4 h-4" />
              <span>Bulk Processing</span>
            </div>
          </div>
          
          {/* File info */}
          <div className="border-t border-crd-mediumGray/30 pt-4">
            <p className="text-crd-lightGray text-sm">
              Supports JPG, PNG, WebP • Upload up to 50 images • Max 15MB each
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
