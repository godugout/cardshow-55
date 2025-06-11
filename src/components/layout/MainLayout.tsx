
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/home/Navbar';
import { Loader } from 'lucide-react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { NotificationProvider } from '@/components/common/NotificationCenter';

export const MainLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isLoading, setIsLoading] = useState(true);
  
  console.log('MainLayout rendering, path:', location.pathname, 'isHomePage:', isHomePage);

  useEffect(() => {
    console.log('MainLayout mounted');
    
    // Quick initialization with error handling
    const timer = setTimeout(() => {
      try {
        setIsLoading(false);
        console.log('MainLayout finished loading');
      } catch (error) {
        console.error('MainLayout loading error:', error);
        setIsLoading(false);
      }
    }, 50);
    
    return () => {
      clearTimeout(timer);
      console.log('MainLayout unmounted');
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#141416]">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-white mb-4" />
          <p className="text-white">Loading layout...</p>
        </div>
      </div>
    );
  }

  return (
    <NotificationProvider>
      <ErrorBoundary>
        <Navbar />
        <ErrorBoundary>
          <div className="outlet-container">
            <Outlet />
          </div>
        </ErrorBoundary>
      </ErrorBoundary>
    </NotificationProvider>
  );
};
