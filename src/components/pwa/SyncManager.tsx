
import React, { useEffect, useState } from 'react';
import { Loader, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { syncOfflineData, initializeAutoSync } from '@/lib/syncService';
import { toast } from 'sonner';

interface SyncProgress {
  total: number;
  completed: number;
  current?: string;
  success: number;
  failed: number;
}

export const SyncManager: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initialize auto-sync
    const cleanup = initializeAutoSync((progress) => {
      setSyncProgress(progress);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      cleanup();
    };
  }, []);

  const handleManualSync = async () => {
    if (!isOnline) {
      toast.error('Cannot sync while offline');
      return;
    }

    setIsSyncing(true);
    
    try {
      const result = await syncOfflineData((progress) => {
        setSyncProgress(progress);
      });

      if (result.success) {
        toast.success(`Synced ${result.syncedItems} items successfully`);
        setPendingCount(0);
      } else {
        toast.error(`Sync failed: ${result.failedItems} items could not be synced`);
      }
    } catch (error) {
      toast.error('Sync failed unexpectedly');
    } finally {
      setIsSyncing(false);
      setSyncProgress(null);
    }
  };

  if (!pendingCount && !isSyncing) return null;

  return (
    <div className="fixed bottom-20 right-4 bg-crd-darker border border-crd-mediumGray/20 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <div className="flex items-center gap-3">
        {isSyncing ? (
          <Loader className="w-5 h-5 animate-spin text-crd-green" />
        ) : isOnline ? (
          <CheckCircle className="w-5 h-5 text-crd-green" />
        ) : (
          <AlertCircle className="w-5 h-5 text-amber-500" />
        )}
        
        <div className="flex-1">
          <p className="text-sm font-medium text-white">
            {isSyncing ? 'Syncing...' : `${pendingCount} items pending`}
          </p>
          
          {syncProgress && (
            <div className="mt-1">
              <div className="flex justify-between text-xs text-crd-lightGray">
                <span>{syncProgress.current || 'Processing...'}</span>
                <span>{syncProgress.completed}/{syncProgress.total}</span>
              </div>
              <div className="w-full bg-crd-mediumGray rounded-full h-1 mt-1">
                <div 
                  className="bg-crd-green h-1 rounded-full transition-all duration-300"
                  style={{ width: `${(syncProgress.completed / syncProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
        
        {!isSyncing && isOnline && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleManualSync}
            className="p-1 h-auto"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
