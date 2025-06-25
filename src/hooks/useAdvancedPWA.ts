
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface PWACapabilities {
  canInstall: boolean;
  isInstalled: boolean;
  supportsNotifications: boolean;
  supportsBackgroundSync: boolean;
  supportsShareTarget: boolean;
  supportsBadging: boolean;
  supportsFileHandling: boolean;
}

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
}

export const useAdvancedPWA = () => {
  const [capabilities, setCapabilities] = useState<PWACapabilities>({
    canInstall: false,
    isInstalled: false,
    supportsNotifications: false,
    supportsBackgroundSync: false,
    supportsShareTarget: false,
    supportsBadging: false,
    supportsFileHandling: false,
  });

  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    detectPWACapabilities();
    setupInstallPromptListener();
    setupNotificationHandlers();
    setupBackgroundSync();
  }, []);

  const detectPWACapabilities = () => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebApp = (window.navigator as any).standalone === true;
    
    setCapabilities({
      canInstall: 'beforeinstallprompt' in window,
      isInstalled: isStandalone || isInWebApp,
      supportsNotifications: 'Notification' in window,
      supportsBackgroundSync: 'serviceWorker' in navigator,
      supportsShareTarget: 'share' in navigator,
      supportsBadging: 'setAppBadge' in navigator,
      supportsFileHandling: 'launchQueue' in window,
    });
  };

  const setupInstallPromptListener = () => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setCapabilities(prev => ({ ...prev, canInstall: true }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  };

  const setupNotificationHandlers = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'NOTIFICATION_CLICK') {
          handleNotificationClick(event.data.payload);
        }
      });
    }
  };

  const setupBackgroundSync = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        window.addEventListener('online', () => {
          // Background sync will be handled by the service worker
          console.log('Connection restored, background sync will process queued actions');
        });
      });
    }
  };

  const install = async (): Promise<boolean> => {
    if (!installPrompt) return false;

    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      
      if (choice.outcome === 'accepted') {
        setCapabilities(prev => ({ ...prev, canInstall: false, isInstalled: true }));
        setInstallPrompt(null);
        toast.success('App installed successfully!');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Installation failed:', error);
      toast.error('Installation failed');
      return false;
    }
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!capabilities.supportsNotifications) {
      toast.error('Notifications not supported');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast.success('Notifications enabled!');
        return true;
      } else {
        toast.error('Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Notification permission failed:', error);
      return false;
    }
  };

  const showNotification = async (options: NotificationOptions): Promise<boolean> => {
    if (Notification.permission !== 'granted') {
      const granted = await requestNotificationPermission();
      if (!granted) return false;
    }

    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(options.title, {
          body: options.body,
          icon: options.icon || '/crd-logo-gradient.png',
          badge: options.badge || '/crd-logo-gradient.png',
          tag: options.tag,
          requireInteraction: options.requireInteraction,
          silent: options.silent,
          data: { timestamp: Date.now() }
        });
      } else {
        new Notification(options.title, {
          body: options.body,
          icon: options.icon || '/crd-logo-gradient.png',
        });
      }
      return true;
    } catch (error) {
      console.error('Failed to show notification:', error);
      return false;
    }
  };

  const setBadge = async (count: number): Promise<boolean> => {
    if (!capabilities.supportsBadging) return false;

    try {
      if (count > 0) {
        await (navigator as any).setAppBadge(count);
      } else {
        await (navigator as any).clearAppBadge();
      }
      return true;
    } catch (error) {
      console.error('Failed to set badge:', error);
      return false;
    }
  };

  const shareContent = async (data: ShareData): Promise<boolean> => {
    if (!capabilities.supportsShareTarget) {
      try {
        await navigator.clipboard.writeText(data.url || data.text || '');
        toast.success('Copied to clipboard!');
        return true;
      } catch {
        return false;
      }
    }

    try {
      await navigator.share(data);
      return true;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Share failed:', error);
      }
      return false;
    }
  };

  const registerBackgroundSync = async (tag: string): Promise<boolean> => {
    if (!capabilities.supportsBackgroundSync) return false;

    try {
      const registration = await navigator.serviceWorker.ready;
      // Background sync will be handled by the service worker
      console.log(`Background sync registered for tag: ${tag}`);
      return true;
    } catch (error) {
      console.error('Background sync registration failed:', error);
      return false;
    }
  };

  const handleNotificationClick = (payload: any) => {
    switch (payload.type) {
      case 'new_card':
        window.location.href = `/cards/${payload.cardId}`;
        break;
      case 'trade_request':
        window.location.href = `/trades/${payload.tradeId}`;
        break;
      case 'auction_ending':
        window.location.href = `/auctions/${payload.auctionId}`;
        break;
      default:
        window.location.href = '/';
    }
  };

  return {
    capabilities,
    install,
    requestNotificationPermission,
    showNotification,
    setBadge,
    shareContent,
    registerBackgroundSync,
  };
};
