
import React, { useState, useEffect } from 'react';
import { Bell, X, Settings, Check, AlertCircle, Info, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWA } from '@/hooks/usePWA';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'trade' | 'market';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
  const { requestNotificationPermission } = usePWA();

  useEffect(() => {
    // Load stored notifications
    loadNotifications();
    
    // Listen for new notifications
    const handleNewNotification = (event: CustomEvent<Notification>) => {
      addNotification(event.detail);
    };

    window.addEventListener('cardshow-notification' as any, handleNewNotification);
    return () => window.removeEventListener('cardshow-notification' as any, handleNewNotification);
  }, []);

  const loadNotifications = () => {
    try {
      const stored = localStorage.getItem('cardshow-notifications');
      if (stored) {
        const parsed = JSON.parse(stored).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(parsed);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const saveNotifications = (notifications: Notification[]) => {
    try {
      localStorage.setItem('cardshow-notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, 50); // Keep last 50
      saveNotifications(updated);
      return updated;
    });

    // Show browser notification if permission granted
    if (notificationPermission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/crd-logo-gradient.png',
        badge: '/crd-logo-gradient.png',
        tag: newNotification.id,
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      saveNotifications(updated);
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      saveNotifications(updated);
      return updated;
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      saveNotifications(updated);
      return updated;
    });
  };

  const clearAll = () => {
    setNotifications([]);
    saveNotifications([]);
  };

  const requestPermissions = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setNotificationPermission('granted');
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <Check className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'trade': return <Star className="w-4 h-4 text-blue-500" />;
      case 'market': return <Star className="w-4 h-4 text-purple-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b border-[#333]">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Notifications</h3>
              <div className="flex items-center space-x-2">
                {notificationPermission !== 'granted' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={requestPermissions}
                    className="text-xs"
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    Enable
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {notifications.length > 0 && (
              <div className="flex items-center space-x-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-xs text-red-400"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-[#333] last:border-b-0 ${
                    !notification.read ? 'bg-[#00C851]/10' : ''
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-medium truncate">
                        {notification.title}
                      </h4>
                      <p className="text-gray-400 text-xs mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-gray-500 text-xs">
                          {notification.timestamp.toLocaleDateString()}
                        </span>
                        {notification.actionUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-[#00C851]"
                            onClick={() => window.open(notification.actionUrl, '_blank')}
                          >
                            {notification.actionLabel || 'View'}
                          </Button>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="p-1"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
