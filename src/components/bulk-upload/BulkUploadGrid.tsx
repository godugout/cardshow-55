
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X, Check, Sparkles, AlertCircle, Edit3 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import type { UploadedFile } from '@/types/bulk-upload';

interface BulkUploadGridProps {
  uploadedFiles: UploadedFile[];
  onRemoveFile: (id: string) => void;
  onFilesAdded: (files: File[]) => void;
  onEditFile: (id: string) => void;
}

export const BulkUploadGrid = ({ uploadedFiles, onRemoveFile, onFilesAdded, onEditFile }: BulkUploadGridProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true,
    onDrop: onFilesAdded
  });

  return (
    <>
      {/* Files Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {uploadedFiles.map((fileData) => (
          <Card key={fileData.id} className="bg-crd-darker border-crd-mediumGray/20 overflow-hidden group relative">
            <div className="relative">
              <img
                src={fileData.editData?.croppedImageUrl || fileData.preview}
                alt="Upload preview"
                className="w-full aspect-[3/4] object-cover"
              />
              
              {/* Hover Overlay with Edit Button */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                <Button
                  onClick={() => onEditFile(fileData.id)}
                  className="bg-crd-green hover:bg-crd-green/90 text-black font-medium relative z-20"
                  size="sm"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
              
              {/* Status Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-5">
                {fileData.status === 'pending' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveFile(fileData.id)}
                    className="absolute top-2 right-2 text-white hover:bg-red-500 z-15"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
                
                {fileData.status === 'editing' && (
                  <div className="absolute top-2 left-2 bg-crd-blue text-white text-xs px-2 py-1 rounded z-15">
                    Editing...
                  </div>
                )}
                
                {fileData.status === 'analyzing' && (
                  <div className="text-center">
                    <Sparkles className="w-8 h-8 text-crd-green animate-pulse mx-auto mb-2" />
                    <span className="text-white text-sm">AI Analyzing...</span>
                  </div>
                )}
                
                {fileData.status === 'complete' && (
                  <div className="text-center">
                    <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <span className="text-white text-sm">Complete</span>
                    {fileData.analysis?.aiGenerated && (
                      <span className="text-crd-green text-xs block">AI Enhanced</span>
                    )}
                    {fileData.editData?.croppedImageUrl && (
                      <span className="text-crd-blue text-xs block">Cropped</span>
                    )}
                  </div>
                )}
                
                {fileData.status === 'error' && (
                  <div className="text-center">
                    <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <span className="text-white text-sm">Error</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* File Info */}
            <div className="p-3">
              <p className="text-white text-sm font-medium truncate">
                {fileData.file.name}
              </p>
              <p className="text-crd-lightGray text-xs">
                {(fileData.file.size / 1024 / 1024).toFixed(1)} MB
              </p>
              
              {fileData.analysis && (
                <div className="mt-2 text-xs">
                  <p className="text-crd-green font-medium truncate">
                    {fileData.analysis.title}
                  </p>
                  <p className="text-crd-lightGray">
                    {fileData.analysis.rarity}
                  </p>
                </div>
              )}
              
              {fileData.error && (
                <p className="text-red-400 text-xs mt-2">
                  {fileData.error}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Add More Button */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-crd-mediumGray rounded-xl p-6 text-center cursor-pointer hover:border-crd-green/50 transition-colors"
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 text-crd-lightGray mx-auto mb-2" />
        <p className="text-crd-lightGray">Add more images</p>
      </div>
    </>
  );
};
