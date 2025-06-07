
import { useEffect, useCallback } from 'react';

interface UseWheelZoomProps {
  containerRef: React.RefObject<HTMLDivElement>;
  handleZoom: (delta: number) => void;
  isInSafeZone: (x: number, y: number, rect: DOMRect) => boolean;
}

export const useWheelZoom = ({ containerRef, handleZoom, isInSafeZone }: UseWheelZoomProps) => {
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const inSafeZone = isInSafeZone(e.clientX, e.clientY, rect);
    
    if (!inSafeZone) {
      e.preventDefault();
      const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
      handleZoom(zoomDelta);
    }
  }, [isInSafeZone, handleZoom]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);
};
