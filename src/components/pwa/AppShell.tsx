
import React from 'react';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { MobileBottomNav } from '@/components/mobile/MobileBottomNav';
import { DesktopSidebar } from '@/components/desktop/DesktopSidebar';
import { PWAInstallPrompt } from '@/components/pwa/PWAInstallPrompt';
import { OfflineIndicator } from '@/components/pwa/OfflineIndicator';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { NotificationCenter } from '@/components/platform/NotificationCenter';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { user } = useAuth();
  const { isMobile } = useResponsiveLayout();

  return (
    <div className="min-h-screen bg-crd-darkest text-white flex">
      {/* PWA Components */}
      <PWAInstallPrompt />
      <OfflineIndicator />
      <NotificationCenter />
      
      {/* Desktop Sidebar */}
      {!isMobile && user && <DesktopSidebar />}
      
      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col ${!isMobile && user ? 'ml-64' : ''}`}>
        <div className={`flex-1 ${isMobile ? 'pb-16' : ''}`}>
          {children}
        </div>
        
        {/* Mobile Bottom Navigation */}
        {isMobile && user && <MobileBottomNav />}
      </main>
    </div>
  );
};
