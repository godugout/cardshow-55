
import { useState, useRef, useCallback, useEffect } from 'react';

interface CameraStreamState {
  isInitializing: boolean;
  isStreaming: boolean;
  error: string | null;
  capturedImage: string | null;
}

export const useCameraStream = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [state, setState] = useState<CameraStreamState>({
    isInitializing: false,
    isStreaming: false,
    error: null,
    capturedImage: null,
  });

  const startCamera = useCallback(async () => {
    console.log('🎥 Starting camera initialization...');
    setState(prev => ({
      ...prev,
      isInitializing: true,
      error: null,
      isStreaming: false
    }));

    // Set timeout to prevent infinite loading
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
    }
    
    initTimeoutRef.current = setTimeout(() => {
      console.log('⏰ Camera initialization timeout');
      setState(prev => ({
        ...prev,
        error: 'Camera initialization timed out. Please try again.',
        isInitializing: false
      }));
    }, 10000); // 10 second timeout

    try {
      console.log('📷 Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      
      console.log('✅ Camera access granted, setting up video element...');
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        const video = videoRef.current;
        
        const handleLoadedMetadata = () => {
          console.log('📺 Video metadata loaded, camera ready');
          if (initTimeoutRef.current) {
            clearTimeout(initTimeoutRef.current);
            initTimeoutRef.current = null;
          }
          setState(prev => ({
            ...prev,
            isInitializing: false,
            isStreaming: true
          }));
        };

        const handleError = (e: Event) => {
          console.error('❌ Video element error:', e);
          if (initTimeoutRef.current) {
            clearTimeout(initTimeoutRef.current);
            initTimeoutRef.current = null;
          }
          setState(prev => ({
            ...prev,
            error: 'Failed to display camera feed. Please try again.',
            isInitializing: false
          }));
        };

        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('error', handleError);
        
        // Cleanup function
        return () => {
          video.removeEventListener('loadedmetadata', handleLoadedMetadata);
          video.removeEventListener('error', handleError);
        };
      }
    } catch (err) {
      console.error('❌ Camera access error:', err);
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = null;
      }
      
      setState(prev => ({
        ...prev,
        isInitializing: false,
        error: getErrorMessage(err)
      }));
    }
  }, []);

  const stopCamera = useCallback(() => {
    console.log('🛑 Stopping camera...');
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
      initTimeoutRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log('🔌 Stopping track:', track.kind);
        track.stop();
      });
      streamRef.current = null;
    }
    setState(prev => ({
      ...prev,
      isStreaming: false,
      isInitializing: false
    }));
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob and create file
    canvas.toBlob(
      (blob) => {
        if (blob) {
          // Create preview URL
          const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
          setState(prev => ({
            ...prev,
            capturedImage: imageUrl
          }));
          
          // Stop camera stream
          stopCamera();
        }
      },
      'image/jpeg',
      0.9
    );
  }, [stopCamera]);

  const handleRetake = useCallback(() => {
    setState(prev => ({
      ...prev,
      capturedImage: null
    }));
    startCamera();
  }, [startCamera]);

  const reset = useCallback(() => {
    setState({
      isInitializing: false,
      isStreaming: false,
      error: null,
      capturedImage: null,
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    ...state,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    capturePhoto,
    handleRetake,
    reset
  };
};

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) {
    if (err.name === 'NotAllowedError') {
      return 'Camera permission denied. Please allow camera access and try again.';
    } else if (err.name === 'NotFoundError') {
      return 'No camera found on this device.';
    } else if (err.name === 'NotSupportedError') {
      return 'Camera not supported. Please ensure you\'re using HTTPS.';
    } else {
      return 'Failed to access camera. Please check your camera permissions.';
    }
  } else {
    return 'Unknown camera error occurred.';
  }
};
