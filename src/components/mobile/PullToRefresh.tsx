
import React, { useState, useCallback, useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  disabled?: boolean;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  threshold = 80,
  disabled = false
}) => {
  const { isMobile } = useResponsiveLayout();
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRefreshIcon, setShowRefreshIcon] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || !isMobile) return;
    
    startY.current = e.touches[0].clientY;
  }, [disabled, isMobile]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (disabled || !isMobile || isRefreshing) return;
    
    currentY.current = e.touches[0].clientY;
    const distance = currentY.current - startY.current;
    
    // Only allow pull down when at the top of the page
    if (window.scrollY === 0 && distance > 0) {
      const pullValue = Math.min(distance * 0.5, threshold * 1.5);
      setPullDistance(pullValue);
      setShowRefreshIcon(pullValue > threshold * 0.7);
    }
  }, [disabled, isMobile, isRefreshing, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (disabled || !isMobile || isRefreshing) return;
    
    if (pullDistance > threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setPullDistance(0);
    setShowRefreshIcon(false);
  }, [disabled, isMobile, isRefreshing, pullDistance, threshold, onRefresh]);

  if (!isMobile) {
    return <>{children}</>;
  }

  const refreshIconScale = Math.min(pullDistance / threshold, 1);
  const refreshIconRotation = isRefreshing ? 'animate-spin' : '';

  return (
    <div 
      className="relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div 
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-transform duration-200 ease-out z-10"
        style={{
          transform: `translateY(${pullDistance > 0 ? pullDistance - 40 : -40}px)`,
          height: '40px'
        }}
      >
        {(showRefreshIcon || isRefreshing) && (
          <div className="bg-crd-darkest/90 backdrop-blur-sm rounded-full p-2 border border-crd-mediumGray/20">
            <RefreshCw 
              className={`w-5 h-5 text-crd-green transition-transform duration-200 ${refreshIconRotation}`}
              style={{ 
                transform: `scale(${refreshIconScale})`,
                opacity: isRefreshing ? 1 : refreshIconScale 
              }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div 
        className="transition-transform duration-200 ease-out"
        style={{
          transform: `translateY(${pullDistance}px)`
        }}
      >
        {children}
      </div>
    </div>
  );
};
