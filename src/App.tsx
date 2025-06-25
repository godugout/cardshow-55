
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AuthPage } from '@/components/auth/AuthPage';
import { AppShell } from '@/components/pwa/AppShell';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { NetworkStatusBanner } from '@/components/pwa/NetworkStatusBanner';

// Import page components
import Index from '@/pages/Index';
import { GalleryPage } from '@/pages/GalleryPage';
import { CreatePage } from '@/pages/CreatePage';
import { CollectionsPage } from '@/pages/CollectionsPage';
import { StudioPage } from '@/pages/StudioPage';
import Studio from '@/pages/Studio';
import { CardsPage } from '@/components/cards/CardsPage';
import { FeedPage } from '@/components/feed/FeedPage';
import { CardshowApp } from '@/pages/CardshowApp';
import { BackofficeLayout } from '@/components/backoffice/BackofficeLayout';
import './App.css';

function App() {
  console.log('App component rendering');
  
  return (
    <ErrorBoundary>
      <div className="App min-h-screen bg-crd-darkest">
        <NetworkStatusBanner />
        
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
                    <Route path="/" element={<Index />} />
                    <Route path="/gallery" element={<GalleryPage />} />
                    <Route path="/create" element={<CreatePage />} />
                    <Route path="/collections" element={<CollectionsPage />} />
                    <Route path="/studio" element={<Studio />} />
                    <Route path="/studio/welcome" element={<StudioPage />} />
                    <Route path="/cards/*" element={<CardsPage />} />
                    <Route path="/feed" element={<FeedPage />} />
                    <Route path="/cardshow/*" element={<CardshowApp />} />
                    <Route path="/admin/*" element={<BackofficeLayout />} />
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
              marginTop: '60px',
            },
            className: 'toast-cardshow'
          }}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
