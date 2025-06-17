
import React from 'react';
import { Card } from '@/components/ui/card';
import { Upload } from 'lucide-react';
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
    <Card className="bg-crd-darker border-crd-mediumGray/20 p-8">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
          isDragActive 
            ? 'border-crd-green bg-crd-green/10' 
            : 'border-crd-mediumGray hover:border-crd-green/50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-16 h-16 text-crd-lightGray mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-white mb-2">
          {isDragActive ? 'Drop images here' : 'Upload Card Images'}
        </h3>
        <p className="text-crd-lightGray text-lg">
          Drag and drop multiple images, or click to browse
        </p>
        <p className="text-crd-lightGray text-sm mt-2">
          AI will automatically analyze and create cards with metadata
        </p>
        <p className="text-crd-green text-sm mt-1">
          ✨ Images now properly fill the entire card face with improved cropping
        </p>
      </div>
    </Card>
  );
};
