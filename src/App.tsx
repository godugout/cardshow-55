
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/pwa/AppShell';
import { PerformanceOptimizer } from '@/components/performance/PerformanceOptimizer';
import { AdaptiveQualityProvider } from '@/components/performance/AdaptiveQualityProvider';
import { CriticalResourcePreloader } from '@/components/performance/CriticalResourcePreloader';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LoadingFallback } from '@/components/common/LoadingFallback';
import { DebugProvider } from '@/contexts/DebugContext';

// Lazy load pages for better performance
const HomePage = lazy(() => import('@/pages/HomePage'));
const GalleryPage = lazy(() => import('@/pages/GalleryPage'));
const CreatePage = lazy(() => import('@/pages/CreatePage'));
const CollectionsPage = lazy(() => import('@/pages/CollectionsPage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const StudioPage = lazy(() => import('@/pages/StudioPage'));
const CreatorEconomyDashboard = lazy(() => import('@/pages/CreatorEconomyDashboard').then(module => ({ default: module.CreatorEconomyDashboard })));
const TradingPage = lazy(() => import('@/pages/TradingPage'));
const MarketplacePage = lazy(() => import('@/pages/MarketplacePage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <DebugProvider>
        <AdaptiveQualityProvider>
          <CriticalResourcePreloader />
          <AppShell>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/create" element={<CreatePage />} />
                <Route path="/collections" element={<CollectionsPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/studio" element={<StudioPage />} />
                <Route path="/creator-dashboard" element={<CreatorEconomyDashboard />} />
                <Route path="/trading" element={<TradingPage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </Suspense>
          </AppShell>
          <PerformanceOptimizer />
        </AdaptiveQualityProvider>
      </DebugProvider>
    </ErrorBoundary>
  );
};

export default App;
