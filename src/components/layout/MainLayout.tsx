
import React from 'react';
import { Navbar } from '@/components/home/Navbar';
import { MobileBottomNav } from '@/components/mobile/MobileBottomNav';
import { MobileHeader } from '@/components/mobile/MobileHeader';
import { CardDebugInfo } from '@/components/debug/CardDebugInfo';
import { useDebugShortcut } from '@/hooks/useDebugShortcut';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = window.location;
  const isHomePage = location.pathname === '/';
  const { isMobile } = useResponsiveLayout();

  // Enable keyboard shortcuts and debug shortcut
  useKeyboardShortcuts();
  useDebugShortcut();

  console.log('MainLayout rendering, path:', location.pathname, 'isHomePage:', isHomePage, 'isMobile:', isMobile);

  return (
    <div className="min-h-screen bg-crd-darkest flex flex-col">
      {/* Desktop navbar */}
      {!isMobile && <Navbar />}
      
      {/* Mobile header - shown on non-home pages */}
      {isMobile && !isHomePage && (
        <MobileHeader 
          title={getPageTitle(location.pathname)}
          showSearch={location.pathname === '/gallery'}
        />
      )}
      
      {/* Main content */}
      <main className={`flex-1 ${isMobile ? 'mb-16' : ''} ${isMobile && !isHomePage ? 'pt-16' : ''}`}>
        {children}
      </main>
      
      {/* Mobile bottom navigation */}
      <MobileBottomNav />
      
      <CardDebugInfo />
    </div>
  );
};

// Helper function to get page titles
const getPageTitle = (pathname: string): string => {
  if (pathname === '/gallery') return 'Gallery';
  if (pathname === '/create') return 'Create Card';
  if (pathname.startsWith('/studio')) return 'Studio';
  if (pathname === '/collections') return 'Collections';
  if (pathname === '/profile') return 'Profile';
  if (pathname === '/settings') return 'Settings';
  return '';
};
