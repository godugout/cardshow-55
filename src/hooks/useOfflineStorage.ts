
import { useState, useEffect } from 'react';

interface OfflineQueueItem {
  id: string;
  type: 'card-creation' | 'trade-request' | 'collection-update';
  data: any;
  timestamp: number;
  retryCount: number;
}

export const useOfflineStorage = () => {
  const [queueSize, setQueueSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    updateQueueSize();
    
    // Process queue when online
    const handleOnline = () => {
      processOfflineQueue();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  const addToQueue = async (item: Omit<OfflineQueueItem, 'id' | 'timestamp' | 'retryCount'>) => {
    const queueItem: OfflineQueueItem = {
      ...item,
      id: `${item.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retryCount: 0,
    };

    try {
      const db = await openOfflineDB();
      const transaction = db.transaction(['queue'], 'readwrite');
      const store = transaction.objectStore('queue');
      await store.add(queueItem);
      updateQueueSize();
      
      // Try to process immediately if online
      if (navigator.onLine) {
        processOfflineQueue();
      }
    } catch (error) {
      console.error('Failed to add to offline queue:', error);
    }
  };

  const processOfflineQueue = async () => {
    if (isProcessing || !navigator.onLine) return;

    setIsProcessing(true);
    
    try {
      const db = await openOfflineDB();
      const transaction = db.transaction(['queue'], 'readwrite');
      const store = transaction.objectStore('queue');
      const items = await store.getAll();

      for (const item of items) {
        try {
          await processQueueItem(item);
          await store.delete(item.id);
        } catch (error) {
          console.error('Failed to process queue item:', error);
          
          // Increment retry count
          item.retryCount++;
          if (item.retryCount < 3) {
            await store.put(item);
          } else {
            // Remove after 3 failed attempts
            await store.delete(item.id);
          }
        }
      }
      
      updateQueueSize();
    } catch (error) {
      console.error('Failed to process offline queue:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const processQueueItem = async (item: OfflineQueueItem) => {
    switch (item.type) {
      case 'card-creation':
        await fetch('/api/cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.data),
        });
        break;
      
      case 'trade-request':
        await fetch('/api/trades', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.data),
        });
        break;
      
      case 'collection-update':
        await fetch(`/api/collections/${item.data.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.data),
        });
        break;
    }
  };

  const updateQueueSize = async () => {
    try {
      const db = await openOfflineDB();
      const transaction = db.transaction(['queue'], 'readonly');
      const store = transaction.objectStore('queue');
      const count = await store.count();
      setQueueSize(count);
    } catch (error) {
      console.error('Failed to update queue size:', error);
    }
  };

  const clearQueue = async () => {
    try {
      const db = await openOfflineDB();
      const transaction = db.transaction(['queue'], 'readwrite');
      const store = transaction.objectStore('queue');
      await store.clear();
      updateQueueSize();
    } catch (error) {
      console.error('Failed to clear queue:', error);
    }
  };

  return {
    queueSize,
    isProcessing,
    addToQueue,
    processOfflineQueue,
    clearQueue,
  };
};

// IndexedDB helper
const openOfflineDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CardshowOfflineDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('queue')) {
        const store = db.createObjectStore('queue', { keyPath: 'id' });
        store.createIndex('type', 'type', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
};
