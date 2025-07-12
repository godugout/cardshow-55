
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/features/auth/providers/AuthProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ProductionOptimizer } from '@/components/production/ProductionOptimizer';
import { DevLoginFloatingButton } from '@/components/auth/DevLoginFloatingButton';
import { Navbar } from '@/components/layout/Navbar';
import Index from '@/pages/Index';
import { CreateChoice } from '@/pages/CreateChoice';
import CreateStory from '@/pages/CreateStory';
import CreateCRD from '@/pages/CreateCRD';
import Gallery from '@/pages/Gallery';
import Studio from '@/pages/Studio';
import UploadTestPage from '@/pages/UploadTestPage';
import DNATestPage from '@/pages/DNATestPage';
import DesignGuide from '@/pages/DesignGuide';
import DNAManager from '@/pages/DNAManager';

const App = () => {
  // Main App Error Boundary wrapper
  return (
    <ErrorBoundary>
      <ProductionOptimizer />
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-crd-darkest flex flex-col">
            <Navbar />
            <main className="flex-1 transition-all duration-300 ease-in-out">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/create" element={<CreateChoice />} />
                <Route path="/create/story" element={<CreateStory />} />
                <Route path="/create/crd" element={<CreateCRD />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/studio" element={<Studio />} />
                <Route path="/studio/:cardId" element={<Studio />} />
                <Route path="/upload-test" element={<UploadTestPage />} />
                <Route path="/dna-test" element={<DNATestPage />} />
                <Route path="/design-guide" element={<DesignGuide />} />
                <Route path="/dna" element={<DNAManager />} />
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
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
