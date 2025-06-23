
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AuthPage } from '@/components/auth/AuthPage';
import { MainLayout } from '@/components/layout/MainLayout';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { NetworkStatus } from '@/components/common/NetworkStatus';
import { PWAInstallPrompt } from '@/components/pwa/PWAInstallPrompt';
import { OfflineIndicator } from '@/components/pwa/OfflineIndicator';
import { PerformanceMonitor } from '@/components/platform/PerformanceMonitor';
import { NotificationCenter } from '@/components/platform/NotificationCenter';
import { SecurityProvider } from '@/components/platform/SecurityProvider';
import { AnalyticsProvider } from '@/components/platform/AnalyticsProvider';

// Import page components
import { HomePage } from '@/pages/HomePage';
import { GalleryPage } from '@/pages/GalleryPage';
import { CreatePage } from '@/pages/CreatePage';
import { CollectionsPage } from '@/pages/CollectionsPage';
import { StudioPage } from '@/pages/StudioPage';
import { CardsPage } from '@/components/cards/CardsPage';
import { FeedPage } from '@/components/feed/FeedPage';
import { CardshowApp } from '@/pages/CardshowApp';
import { BackofficeLayout } from '@/components/backoffice/BackofficeLayout';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <SecurityProvider>
        <AnalyticsProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <div className="App">
                <NetworkStatus />
                <OfflineIndicator />
                <PWAInstallPrompt />
                <PerformanceMonitor />
                
                <Routes>
                  {/* Public routes */}
                  <Route path="/auth/*" element={<AuthPage />} />
                  
                  {/* Protected main application routes */}
                  <Route
                    path="/*"
                    element={
                      <ProtectedRoute>
                        <MainLayout>
                          <Routes>
                            {/* Main pages */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/gallery" element={<GalleryPage />} />
                            <Route path="/create" element={<CreatePage />} />
                            <Route path="/collections" element={<CollectionsPage />} />
                            <Route path="/studio" element={<StudioPage />} />
                            
                            {/* Cards management */}
                            <Route path="/cards/*" element={<CardsPage />} />
                            
                            {/* Social feed */}
                            <Route path="/feed" element={<FeedPage />} />
                            
                            {/* Cardshow mobile app */}
                            <Route path="/cardshow/*" element={<CardshowApp />} />
                            
                            {/* Admin/Backoffice */}
                            <Route path="/admin/*" element={<BackofficeLayout />} />
                            
                            {/* Catch all route */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                          </Routes>
                        </MainLayout>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
                
                <Toaster 
                  position="top-right" 
                  expand={true}
                  richColors
                  closeButton
                />
              </div>
            </AuthProvider>
          </QueryClientProvider>
        </AnalyticsProvider>
      </SecurityProvider>
    </ErrorBoundary>
  );
}

export default App;
