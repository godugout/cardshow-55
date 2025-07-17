
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import '@/styles/studio.css';
import { AuthProvider } from '@/features/auth/providers/AuthProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ProductionOptimizer } from '@/components/production/ProductionOptimizer';
import { DevLoginFloatingButton } from '@/components/auth/DevLoginFloatingButton';
import { Navbar } from '@/components/layout/Navbar';
import Index from '@/pages/Index';
import CreateChoice from '@/pages/CreateChoice';
import CreateStory from '@/pages/CreateStory';
import CreateCRD from '@/pages/CreateCRD';
import CreateWithStickyControls from '@/pages/CreateWithStickyControls';
import CreateEnhanced from '@/pages/CreateEnhanced';
import Gallery from '@/pages/Gallery';
import Studio from '@/pages/Studio';
import Collections from '@/pages/Collections';
import CollectionsCatalog from '@/pages/CollectionsCatalog';
import UploadTestPage from '@/pages/UploadTestPage';
import DNATestPage from '@/pages/DNATestPage';
import DesignGuide from '@/pages/DesignGuide';
import DNAManager from '@/pages/DNAManager';
import DNALabLanding from '@/pages/DNALabLanding';
import DNALabDashboard from '@/pages/DNALabDashboard';
import DNALabUsers from '@/pages/DNALabUsers';
import DNALabModeration from '@/pages/DNALabModeration';
import SignIn from '@/pages/auth/SignIn';
import SignUp from '@/pages/auth/SignUp';
import { GlobalSecretEffectsProvider } from '@/contexts/GlobalSecretEffectsContext';
import { GlobalSecretMenu } from '@/components/global/GlobalSecretMenu';

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
                  <Route path="/" element={<Index />} />
                  <Route path="/create" element={<CreateEnhanced />} />
                  <Route path="/create/story" element={<CreateStory />} />
                  <Route path="/create/crd" element={<CreateCRD />} />
                  <Route path="/collections" element={<Collections />} />
                  <Route path="/collections/gallery" element={<Gallery />} />
                  <Route path="/collections/catalog" element={<CollectionsCatalog />} />
                  <Route path="/studio" element={<Studio />} />
                  <Route path="/studio/:cardId" element={<Studio />} />
                  <Route path="/upload-test" element={<UploadTestPage />} />
                  <Route path="/dna-test" element={<DNATestPage />} />
                  <Route path="/design-guide" element={<DesignGuide />} />
                  <Route path="/dna" element={<DNAManager />} />
                  <Route path="/dna/lab" element={<DNALabLanding />} />
                  <Route path="/dna/lab/dashboard" element={<DNALabDashboard />} />
                  <Route path="/dna/lab/users" element={<DNALabUsers />} />
                  <Route path="/dna/lab/moderation" element={<DNALabModeration />} />
                  <Route path="/auth/signin" element={<SignIn />} />
                  <Route path="/auth/signup" element={<SignUp />} />
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
