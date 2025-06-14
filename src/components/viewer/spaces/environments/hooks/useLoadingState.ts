
import { useState } from 'react';

export const useLoadingState = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);

  const handleLoadStart = () => {
    console.log('🔄 360° image loading started');
    setIsLoading(true);
    setLoadError(null);
  };

  const handleLoadComplete = () => {
    console.log('✅ 360° image loading completed');
    setIsLoading(false);
    setLoadError(null);
  };

  const handleLoadError = (error: Error) => {
    console.error('❌ 360° image loading failed:', error);
    setIsLoading(false);
    setLoadError(error);
  };

  return {
    isLoading,
    loadError,
    handleLoadStart,
    handleLoadComplete,
    handleLoadError
  };
};
