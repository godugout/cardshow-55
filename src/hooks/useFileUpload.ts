
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { UploadService, type UploadOptions, type UploadResult } from '@/services/uploadService';

interface UseFileUploadOptions extends UploadOptions {
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: string) => void;
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);
    setUploadResult(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await UploadService.uploadFile(file, options);
      
      clearInterval(progressInterval);
      setProgress(100);
      setUploadResult(result);
      
      toast.success('File uploaded successfully!');
      options.onSuccess?.(result);
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setError(errorMessage);
      toast.error(errorMessage);
      options.onError?.(errorMessage);
      throw error;
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, [options]);

  const reset = useCallback(() => {
    setUploadResult(null);
    setError(null);
    setProgress(0);
  }, []);

  return {
    uploadFile,
    isUploading,
    progress,
    uploadResult,
    error,
    reset
  };
};
