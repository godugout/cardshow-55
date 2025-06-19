
import { useState, useEffect } from 'react';

interface CameraCapabilities {
  hasCamera: boolean;
  isDesktop: boolean;
  isMobile: boolean;
  supportsGetUserMedia: boolean;
  requiresHTTPS: boolean;
}

export const useCameraCapabilities = () => {
  const [capabilities, setCapabilities] = useState<CameraCapabilities>({
    hasCamera: false,
    isDesktop: false,
    isMobile: false,
    supportsGetUserMedia: false,
    requiresHTTPS: false
  });

  useEffect(() => {
    const detectCapabilities = async () => {
      // Check if we're on mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      
      const isDesktop = !isMobile;
      
      // Check if getUserMedia is supported
      const supportsGetUserMedia = !!(
        navigator.mediaDevices && 
        navigator.mediaDevices.getUserMedia
      );
      
      // Check if HTTPS is required (getUserMedia requires HTTPS except on localhost)
      const requiresHTTPS = location.protocol !== 'https:' && 
                           !location.hostname.includes('localhost') &&
                           location.hostname !== '127.0.0.1';
      
      let hasCamera = false;
      
      // Try to detect camera availability
      if (supportsGetUserMedia && !requiresHTTPS) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          hasCamera = devices.some(device => device.kind === 'videoinput');
        } catch (error) {
          // If we can't enumerate devices, assume camera might be available
          hasCamera = supportsGetUserMedia;
        }
      }
      
      setCapabilities({
        hasCamera,
        isDesktop,
        isMobile,
        supportsGetUserMedia,
        requiresHTTPS
      });
    };

    detectCapabilities();
  }, []);

  return capabilities;
};
