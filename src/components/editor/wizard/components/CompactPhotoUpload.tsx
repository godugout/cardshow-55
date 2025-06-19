
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileImage, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface CompactPhotoUploadProps {
  selectedPhoto: string;
  onPhotoSelect: (photo: string) => void;
  onPhotoRemove: () => void;
  isAnalyzing?: boolean;
}

export const CompactPhotoUpload = ({
  selectedPhoto,
  onPhotoSelect,
  onPhotoRemove,
  isAnalyzing = false
}: CompactPhotoUploadProps) => {
  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onPhotoSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onPhotoSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  return (
    <Card className="bg-crd-darkGray border-crd-mediumGray/30">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium text-sm">Upload Photo</h3>
            {selectedPhoto && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onPhotoRemove}
                className="h-6 w-6 p-0 text-crd-lightGray hover:text-white"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>

          {selectedPhoto ? (
            <div className="space-y-2">
              <div className="relative">
                <img
                  src={selectedPhoto}
                  alt="Uploaded photo"
                  className="w-full h-24 object-cover rounded-md"
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
                    <div className="text-crd-green text-xs">Analyzing...</div>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('compact-photo-input')?.click()}
                className="w-full bg-transparent border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray hover:text-white text-xs"
              >
                Change Photo
              </Button>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-md p-4 text-center transition-colors cursor-pointer ${
                isDragActive 
                  ? 'border-crd-green bg-crd-green/10' 
                  : 'border-crd-mediumGray bg-crd-mediumGray/10 hover:border-crd-green'
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-2">
                <div className="flex justify-center">
                  <FileImage className="w-6 h-6 text-crd-lightGray" />
                </div>
                <p className="text-crd-lightGray text-xs">
                  {isDragActive ? 'Drop here!' : 'Drop photo or click'}
                </p>
                <Button
                  size="sm"
                  onClick={() => document.getElementById('compact-photo-input')?.click()}
                  className="bg-crd-green hover:bg-crd-green/90 text-black text-xs font-medium"
                >
                  <Upload className="w-3 h-3 mr-1" />
                  Browse
                </Button>
              </div>
            </div>
          )}
        </div>

        <input
          id="compact-photo-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};
