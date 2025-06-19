
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useCameraCapabilities } from '@/hooks/useCameraCapabilities';

interface UseCameraHandlersProps {
  onFileSelect: (file: File) => void;
  onShowDesktopCamera: (show: boolean) => void;
}

export const useCameraHandlers = ({
  onFileSelect,
  onShowDesktopCamera,
}: UseCameraHandlersProps) => {
  const capabilities = useCameraCapabilities();

  const handleCameraClick = useCallback(() => {
    if (capabilities.requiresHTTPS) {
      toast.error('Camera requires HTTPS', {
        description: 'Please use HTTPS to access the camera feature.'
      });
      return;
    }

    if (!capabilities.hasCamera) {
      toast.error('No camera detected', {
        description: 'No camera was found on this device.'
      });
      return;
    }

    if (capabilities.isDesktop && capabilities.supportsGetUserMedia) {
      onShowDesktopCamera(true);
    } else if (capabilities.isMobile) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) onFileSelect(file);
      };
      input.click();
    } else {
      toast.error('Camera not supported', {
        description: 'Camera access is not supported on this device or browser.'
      });
    }
  }, [capabilities, onFileSelect, onShowDesktopCamera]);

  return {
    capabilities,
    handleCameraClick,
  };
};
