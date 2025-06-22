
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AuthPage } from '@/components/auth/AuthPage';
import { MainLayout } from '@/components/layout/MainLayout';
import { CardshowApp } from '@/pages/CardshowApp';
import { CardsPage } from '@/components/cards/CardsPage';
import { FeedPage } from '@/components/feed/FeedPage';
import { BackofficeLayout } from '@/components/backoffice/BackofficeLayout';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { NetworkStatus } from '@/components/common/NetworkStatus';
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
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className="App">
            <NetworkStatus />
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
                        {/* Default redirect to cards */}
                        <Route path="/" element={<Navigate to="/cards" replace />} />
                        
                        {/* Cards management */}
                        <Route path="/cards/*" element={<CardsPage />} />
                        
                        {/* Social feed */}
                        <Route path="/feed" element={<FeedPage />} />
                        
                        {/* Cardshow mobile app */}
                        <Route path="/cardshow/*" element={<CardshowApp />} />
                        
                        {/* Admin/Backoffice */}
                        <Route path="/admin/*" element={<BackofficeLayout />} />
                        
                        {/* Catch all route */}
                        <Route path="*" element={<Navigate to="/cards" replace />} />
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
    </ErrorBoundary>
  );
}

export default App;
