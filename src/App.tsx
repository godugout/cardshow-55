
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/features/auth/providers/AuthProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ProductionOptimizer } from '@/components/production/ProductionOptimizer';
import { Navbar } from '@/components/layout/Navbar';
import Index from '@/pages/Index';
import CreateCard from '@/pages/CreateCard';
import Gallery from '@/pages/Gallery';
import Studio from '@/pages/Studio';

const App = () => {
  // Main App Error Boundary wrapper
  return (
    <ErrorBoundary>
      <ProductionOptimizer />
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-crd-darkest">
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/create" element={<CreateCard />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/studio" element={<Studio />} />
              <Route path="/studio/:cardId" element={<Studio />} />
            </Routes>
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
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
