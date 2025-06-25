
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/features/auth/providers/AuthProvider';
import { AppShell } from '@/components/pwa/AppShell';
import { ErrorBoundary } from '@/components/production/ErrorBoundary';
import { ProductionOptimizer } from '@/components/production/ProductionOptimizer';
import { SecurityHeaders } from '@/components/production/SecurityHeaders';
import { AccessibilityOptimizer } from '@/components/production/AccessibilityOptimizer';
import { PerformanceOptimizer } from '@/components/performance/PerformanceOptimizer';
import { HeaderSkeleton } from '@/components/production/LoadingSkeletons';

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
const AdvancedTradingPage = React.lazy(() => import('@/pages/AdvancedTradingPage'));
const ViewerPage = React.lazy(() => import('@/pages/ViewerPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: 1,
    },
  },
});

const LoadingFallback = () => (
  <div className="min-h-screen bg-crd-darkest flex items-center justify-center p-6">
    <div className="max-w-4xl w-full">
      <HeaderSkeleton />
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SecurityHeaders />
          <ProductionOptimizer />
          <AccessibilityOptimizer />
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
                <Route path="/advanced" element={<AdvancedTradingPage />} />
                <Route path="/viewer" element={<ViewerPage />} />
              </Routes>
            </Suspense>
          </AppShell>
          <Toaster />
          <PerformanceOptimizer />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
