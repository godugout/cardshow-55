
import React from 'react';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { MobileBottomNav } from '@/components/mobile/MobileBottomNav';
import { DesktopSidebar } from '@/components/desktop/DesktopSidebar';
import { TopNavbar } from '@/components/navigation/TopNavbar';
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

  // Determine navigation pattern based on auth status and device
  const shouldShowDesktopSidebar = !isMobile && user;
  const shouldShowTopNavbar = !user || isMobile;
  const shouldShowMobileBottomNav = isMobile && user;

  return (
    <div className="min-h-screen bg-crd-darkest text-white flex">
      {/* PWA Components */}
      <PWAInstallPrompt />
      <OfflineIndicator />
      <NotificationCenter />
      
      {/* Desktop Sidebar - Only for logged-in desktop users */}
      {shouldShowDesktopSidebar && <DesktopSidebar />}
      
      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col ${shouldShowDesktopSidebar ? 'ml-64' : ''}`}>
        {/* Top Navigation - For logged-out users or mobile users */}
        {shouldShowTopNavbar && <TopNavbar />}
        
        {/* Page Content */}
        <div className={`flex-1 ${shouldShowMobileBottomNav ? 'pb-16' : ''}`}>
          {children}
        </div>
        
        {/* Mobile Bottom Navigation - Only for logged-in mobile users */}
        {shouldShowMobileBottomNav && <MobileBottomNav />}
      </main>
    </div>
  );
};
