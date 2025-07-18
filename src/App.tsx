
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import '@/styles/studio.css';
import { AuthProvider } from '@/features/auth/providers/AuthProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ProductionOptimizer } from '@/components/production/ProductionOptimizer';
import { DevLoginFloatingButton } from '@/components/auth/DevLoginFloatingButton';
import { Navbar } from '@/components/layout/Navbar';
import { RouteErrorBoundary } from '@/components/routing/RouteErrorBoundary';
import { LoadingState } from '@/components/common/LoadingState';
import { GlobalSecretEffectsProvider } from '@/contexts/GlobalSecretEffectsContext';
import { GlobalSecretMenu } from '@/components/global/GlobalSecretMenu';

// Core pages loaded immediately
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';

// Lazy load non-critical pages for better performance
const CreateEnhanced = lazy(() => import('@/pages/CreateEnhanced'));
const CreateStory = lazy(() => import('@/pages/CreateStory'));
const CreateCRD = lazy(() => import('@/pages/CreateCRD'));
const Gallery = lazy(() => import('@/pages/Gallery'));
const Studio = lazy(() => import('@/pages/Studio'));
const Collections = lazy(() => import('@/pages/Collections'));
const CollectionsCatalog = lazy(() => import('@/pages/CollectionsCatalog'));
const UploadTestPage = lazy(() => import('@/pages/UploadTestPage'));
const DNATestPage = lazy(() => import('@/pages/DNATestPage'));
const DesignGuide = lazy(() => import('@/pages/DesignGuide'));
const DNAManager = lazy(() => import('@/pages/DNAManager'));
const DNALabLanding = lazy(() => import('@/pages/DNALabLanding'));
const DNALabDashboard = lazy(() => import('@/pages/DNALabDashboard'));
const DNALabUsers = lazy(() => import('@/pages/DNALabUsers'));
const DNALabModeration = lazy(() => import('@/pages/DNALabModeration'));
const SignIn = lazy(() => import('@/pages/auth/SignIn'));
const SignUp = lazy(() => import('@/pages/auth/SignUp'));

// Route loading fallback component
const RouteLoading = () => (
  <LoadingState 
    fullPage 
    message="Loading page..." 
    size="lg"
    className="bg-crd-darkest"
  />
);

const App = () => {
  // Main App Error Boundary wrapper
  return (
    <ErrorBoundary>
      <ProductionOptimizer />
      <AuthProvider>
        <GlobalSecretEffectsProvider>
          <Router>
            <div className="min-h-screen bg-crd-darkest flex flex-col">
              <Navbar />
              <main className="flex-1 transition-all duration-300 ease-in-out">
                <Routes>
                  {/* Core pages - no lazy loading */}
                  <Route 
                    path="/" 
                    element={
                      <RouteErrorBoundary>
                        <Index />
                      </RouteErrorBoundary>
                    } 
                  />
                  
                  {/* Lazy-loaded pages with error boundaries and loading states */}
                  <Route 
                    path="/create" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<RouteLoading />}>
                          <CreateEnhanced />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/create/story" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<RouteLoading />}>
                          <CreateStory />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/create/crd" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<RouteLoading />}>
                          <CreateCRD />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/collections" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<RouteLoading />}>
                          <Collections />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/collections/gallery" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<RouteLoading />}>
                          <Gallery />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/collections/catalog" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<RouteLoading />}>
                          <CollectionsCatalog />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/studio" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<RouteLoading />}>
                          <Studio />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/studio/:cardId" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<RouteLoading />}>
                          <Studio />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/upload-test" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<RouteLoading />}>
                          <UploadTestPage />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/dna-test" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<RouteLoading />}>
                          <DNATestPage />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/design-guide" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<RouteLoading />}>
                          <DesignGuide />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/dna" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<RouteLoading />}>
                          <DNAManager />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/dna/lab" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<RouteLoading />}>
                          <DNALabLanding />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/dna/lab/dashboard" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<RouteLoading />}>
                          <DNALabDashboard />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/dna/lab/users" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<RouteLoading />}>
                          <DNALabUsers />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/dna/lab/moderation" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<RouteLoading />}>
                          <DNALabModeration />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/auth/signin" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<RouteLoading />}>
                          <SignIn />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/auth/signup" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<RouteLoading />}>
                          <SignUp />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  
                  {/* 404 catch-all route */}
                  <Route 
                    path="*" 
                    element={
                      <RouteErrorBoundary>
                        <NotFound />
                      </RouteErrorBoundary>
                    } 
                  />
                </Routes>
              </main>
              <Toaster 
                position="top-right"
                theme="dark"
                toastOptions={{
                  style: {
                    background: '#1A1A1A',
                    color: '#FCFCFD',
                    border: '1px solid #353945'
                  }
                }}
              />
              <DevLoginFloatingButton />
              <GlobalSecretMenu />
            </div>
          </Router>
        </GlobalSecretEffectsProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
