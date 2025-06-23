
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/components/pwa/ThemeProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AuthPage } from '@/components/auth/AuthPage';
import { AppShell } from '@/components/pwa/AppShell';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { NetworkStatusBanner } from '@/components/pwa/NetworkStatusBanner';
import { SyncManager } from '@/components/pwa/SyncManager';
import { PerformanceMonitor } from '@/components/platform/PerformanceMonitor';
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
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <SecurityProvider>
          <AnalyticsProvider>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <div className="App min-h-screen bg-crd-darkest">
                  <NetworkStatusBanner />
                  <SyncManager />
                  <PerformanceMonitor />
                  
                  <Routes>
                    {/* Public routes */}
                    <Route path="/auth/*" element={<AuthPage />} />
                    
                    {/* Protected main application routes */}
                    <Route
                      path="/*"
                      element={
                        <ProtectedRoute>
                          <AppShell>
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
                          </AppShell>
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                  
                  <Toaster 
                    position="top-center" 
                    expand={false}
                    richColors
                    closeButton
                    duration={3000}
                    theme="dark"
                    toastOptions={{
                      style: {
                        marginTop: '60px', // Avoid overlapping with network banner
                      },
                      className: 'toast-cardshow'
                    }}
                  />
                </div>
              </AuthProvider>
            </QueryClientProvider>
          </AnalyticsProvider>
        </SecurityProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
