
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/home/Navbar';
import { CardDebugInfo } from '@/components/debug/CardDebugInfo';
import { useDebugShortcut } from '@/hooks/useDebugShortcut';

export const MainLayout = () => {
  const location = window.location;
  const isHomePage = location.pathname === '/';

  // Enable debug keyboard shortcut
  useDebugShortcut();

  console.log('MainLayout rendering, path:', location.pathname, 'isHomePage:', isHomePage);

  return (
    <div className="min-h-screen bg-crd-darkest flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <CardDebugInfo />
    </div>
  );
};
