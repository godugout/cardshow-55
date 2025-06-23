
import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, CloudOff, CheckCircle } from 'lucide-react';

interface NetworkState {
  isOnline: boolean;
  connectionType?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

export const NetworkStatusBanner: React.FC = () => {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isOnline: navigator.onLine
  });
  const [showBanner, setShowBanner] = useState(false);
  const [justCameOnline, setJustCameOnline] = useState(false);

  useEffect(() => {
    const updateNetworkState = () => {
      const wasOffline = !networkState.isOnline;
      const newState: NetworkState = {
        isOnline: navigator.onLine,
      };

      // Add connection info if available
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        newState.connectionType = connection?.type;
        newState.effectiveType = connection?.effectiveType;
        newState.downlink = connection?.downlink;
        newState.rtt = connection?.rtt;
      }

      setNetworkState(newState);
      
      // Show banner when status changes
      if (wasOffline && navigator.onLine) {
        setJustCameOnline(true);
        setShowBanner(true);
        // Hide the "back online" message after 3 seconds
        setTimeout(() => {
          setJustCameOnline(false);
          setShowBanner(false);
        }, 3000);
      } else if (!navigator.onLine) {
        setShowBanner(true);
        setJustCameOnline(false);
      } else {
        setShowBanner(false);
      }
    };

    const handleOnline = () => updateNetworkState();
    const handleOffline = () => updateNetworkState();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for connection changes
    if ('connection' in navigator) {
      (navigator as any).connection?.addEventListener('change', updateNetworkState);
    }

    // Initial state
    updateNetworkState();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if ('connection' in navigator) {
        (navigator as any).connection?.removeEventListener('change', updateNetworkState);
      }
    };
  }, [networkState.isOnline]);

  if (!showBanner) return null;

  const getConnectionQuality = () => {
    if (!networkState.isOnline) return 'offline';
    if (!networkState.effectiveType) return 'unknown';
    
    switch (networkState.effectiveType) {
      case 'slow-2g':
      case '2g':
        return 'poor';
      case '3g':
        return 'fair';
      case '4g':
        return 'good';
      default:
        return 'unknown';
    }
  };

  const quality = getConnectionQuality();

  return (
    <div 
      className={`
        fixed top-0 left-0 right-0 z-50 px-4 py-2 text-center text-sm font-medium transition-all duration-300
        ${justCameOnline 
          ? 'bg-green-600 text-white' 
          : networkState.isOnline
            ? quality === 'poor' 
              ? 'bg-amber-500 text-black'
              : 'bg-green-600 text-white'
            : 'bg-red-600 text-white'
        }
      `}
    >
      <div className="flex items-center justify-center gap-2">
        {justCameOnline ? (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>Back online! Syncing your changes...</span>
          </>
        ) : networkState.isOnline ? (
          quality === 'poor' ? (
            <>
              <Wifi className="w-4 h-4" />
              <span>Slow connection detected - some features may be limited</span>
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4" />
              <span>Connected ({networkState.effectiveType?.toUpperCase() || 'Unknown'})</span>
            </>
          )
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>You're offline - changes will sync when reconnected</span>
          </>
        )}
      </div>
    </div>
  );
};
