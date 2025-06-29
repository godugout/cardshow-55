
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Badge } from '@/components/ui/badge';
import { Upload } from 'lucide-react';

interface PhotoDropzoneProps {
  onFileSelect: (file: File) => void;
  isDragActive?: boolean;
  disabled?: boolean;
}

export const PhotoDropzone: React.FC<PhotoDropzoneProps> = ({
  onFileSelect,
  disabled = false
}) => {
  const handleBrowseClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    
    input.onchange = async (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        onFileSelect(files[0]);
      }
    };
    
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  }, [onFileSelect]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    onFileSelect(file);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: false,
    disabled
  });

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all min-h-[280px] flex flex-col items-center justify-center ${
        isDragActive
          ? 'border-crd-green bg-crd-green/10'
          : 'border-crd-mediumGray/30 hover:border-crd-green/50 bg-crd-darker/50'
      } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      onClick={handleBrowseClick}
    >
      <input {...getInputProps()} />
      
      <div className="space-y-6">
        <div className="w-20 h-20 mx-auto bg-crd-mediumGray/20 rounded-full flex items-center justify-center">
          <Upload className="w-10 h-10 text-crd-lightGray" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-crd-white mb-2">Upload Your Image</h3>
          <p className="text-crd-lightGray mb-4">
            Drag & drop or tap to browse files
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-crd-mediumGray mb-6">
            <Badge variant="outline" className="border-crd-mediumGray/30 text-crd-lightGray">JPG</Badge>
            <Badge variant="outline" className="border-crd-mediumGray/30 text-crd-lightGray">PNG</Badge>
            <Badge variant="outline" className="border-crd-mediumGray/30 text-crd-lightGray">WebP</Badge>
          </div>
        </div>
        <CRDButton
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleBrowseClick();
          }}
          className="bg-crd-green hover:bg-crd-green/90 text-black font-medium"
          disabled={disabled}
        >
          <Upload className="w-4 h-4 mr-2" />
          Choose File
        </CRDButton>
      </div>
    </div>
  );
};
