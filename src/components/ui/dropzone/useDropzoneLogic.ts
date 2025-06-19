
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

interface UseDropzoneLogicProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  disabled?: boolean;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
}

export const useDropzoneLogic = ({
  onFileSelect,
  isLoading = false,
  disabled = false,
  accept = { 'image/*': [] },
  maxFiles = 1,
  maxSize = 10 * 1024 * 1024,
}: UseDropzoneLogicProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const dropzone = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
    disabled: disabled || isLoading,
    noClick: true,
    noKeyboard: true
  });

  return dropzone;
};
