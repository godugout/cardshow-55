
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/features/auth/providers/AuthProvider';
import { AppShell } from '@/components/pwa/AppShell';
import { PerformanceOptimizer } from '@/components/performance/PerformanceOptimizer';

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const AuthPage = React.lazy(() => import('@/pages/AuthPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const StudioPage = React.lazy(() => import('@/pages/StudioPage'));
const CreatePage = React.lazy(() => import('@/pages/CreatePage'));
const CardsPage = React.lazy(() => import('@/pages/CardsPage'));
const GalleryPage = React.lazy(() => import('@/pages/GalleryPage'));
const TradingPage = React.lazy(() => import('@/pages/TradingPage'));
const MarketplacePage = React.lazy(() => import('@/pages/MarketplacePage'));
const CollectionsPage = React.lazy(() => import('@/pages/CollectionsPage'));
const AdminDashboard = React.lazy(() => import('@/pages/AdminDashboard'));
const Settings = React.lazy(() => import('@/pages/Settings'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingFallback = () => (
  <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppShell>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/studio" element={<StudioPage />} />
              <Route path="/create" element={<CreatePage />} />
              <Route path="/cards/*" element={<CardsPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/trading" element={<TradingPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
            </Routes>
          </Suspense>
        </AppShell>
        <Toaster />
        <PerformanceOptimizer />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
