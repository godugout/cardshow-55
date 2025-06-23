
import React, { useState } from 'react';
import { X, Download, Smartphone, Star, Zap, Wifi } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';

export const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, install } = usePWA();
  const [isVisible, setIsVisible] = useState(true);
  const [isInstalling, setIsInstalling] = useState(false);

  if (!isInstallable || !isVisible) return null;

  const handleInstall = async () => {
    setIsInstalling(true);
    const success = await install();
    if (success) {
      setIsVisible(false);
    }
    setIsInstalling(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Remember dismissal for 7 days
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:max-w-sm bg-[#1a1a1a] border border-[#333] rounded-lg p-4 shadow-lg z-50 animate-slide-up">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Smartphone className="w-5 h-5 text-[#00C851]" />
          <h3 className="text-white font-semibold">Install Cardshow</h3>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-gray-300 text-sm mb-4">
        Install our app for the best experience with offline access and faster loading.
      </p>

      <div className="flex items-center space-x-4 mb-4 text-xs text-gray-400">
        <div className="flex items-center space-x-1">
          <Wifi className="w-3 h-3" />
          <span>Works offline</span>
        </div>
        <div className="flex items-center space-x-1">
          <Zap className="w-3 h-3" />
          <span>Faster loading</span>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="w-3 h-3" />
          <span>Native feel</span>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="flex-1 text-gray-400 hover:text-white"
        >
          Maybe later
        </Button>
        <Button
          onClick={handleInstall}
          disabled={isInstalling}
          size="sm"
          className="flex-1 bg-[#00C851] text-black hover:bg-[#00a844] font-semibold"
        >
          {isInstalling ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black" />
          ) : (
            <>
              <Download className="w-4 h-4 mr-1" />
              Install
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
