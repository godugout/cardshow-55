
import React from 'react';
import { WifiOff, Wifi, CloudOff } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export const OfflineIndicator: React.FC = () => {
  const { isOnline } = usePWA();

  if (isOnline) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-amber-500 text-black px-4 py-2 rounded-full flex items-center space-x-2 z-50 shadow-lg">
      <WifiOff className="w-4 h-4" />
      <span className="text-sm font-medium">You're offline</span>
      <CloudOff className="w-4 h-4" />
    </div>
  );
};
