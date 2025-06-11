
import React, { createContext, useContext, ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';

interface NotificationContextType {
  // Add notification methods here if needed in the future
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const value = {
    // Add notification methods here if needed
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Toaster />
    </NotificationContext.Provider>
  );
};

// Export NotificationCenter as an alias for the component that NavActions expects
export const NotificationCenter: React.FC = () => {
  return null; // This can be a simple notification bell icon or dropdown
};
