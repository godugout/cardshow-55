
import React, { useEffect, useRef } from 'react';

interface ImageLoaderProps {
  selectedPhoto: string;
  isOpen: boolean;
  onImageLoad: (img: HTMLImageElement) => void;
  onImageError: () => void;
  onLoadingChange: (loading: boolean) => void;
}

export const ImageLoader = ({
  selectedPhoto,
  isOpen,
  onImageLoad,
  onImageError,
  onLoadingChange
}: ImageLoaderProps) => {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (selectedPhoto && isOpen) {
      console.log('Loading image:', selectedPhoto);
      onLoadingChange(true);
      
      const img = new Image();
      img.onload = () => {
        console.log('Image loaded successfully:', img.naturalWidth, 'x', img.naturalHeight);
        onImageLoad(img);
        onLoadingChange(false);
        
        if (imageRef.current) {
          imageRef.current.src = selectedPhoto;
        }
      };
      
      img.onerror = (error) => {
        console.error('Image failed to load:', error);
        onImageError();
        onLoadingChange(false);
      };
      
      img.src = selectedPhoto;
    }
  }, [selectedPhoto, isOpen, onImageLoad, onImageError, onLoadingChange]);

  return (
    <img
      ref={imageRef}
      src={selectedPhoto}
      alt="Source"
      className="hidden"
      onLoad={() => console.log('Hidden image ref loaded')}
      onError={() => console.error('Hidden image ref failed')}
    />
  );
};
