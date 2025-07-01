import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/features/auth/providers/AuthProvider';
import { MainLayout } from '@/components/layout/MainLayout';
import Home from '@/pages/Index';
import CreateCard from '@/pages/CreateCard';
import { EnhancedCardCreator } from '@/components/creation/EnhancedCardCreator';
import CardsPage from '@/pages/CardsPage';
import FeedPage from '@/pages/FeedPage';
import Studio from '@/pages/Studio';
import Gallery from '@/pages/Gallery';
import CRDMKRPage from '@/pages/CRDMKRPage';
import CropperDemo from '@/pages/CropperDemo';
import { AuthPage } from '@/components/auth/AuthPage';
import { PSDProfessionalWorkflow } from '@/pages/crdmkr/PSDProfessionalWorkflow';
import { SmartUploadWorkflow } from '@/pages/crdmkr/SmartUploadWorkflow';
import { BatchProcessingWorkflow } from '@/pages/crdmkr/BatchProcessingWorkflow';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  console.log('App: Initializing with CRDMKR workflow routing configuration');

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="crd-ui-theme">
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/*" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="create" element={<CreateCard />} />
                <Route path="create/enhanced" element={<EnhancedCardCreator />} />
                <Route path="cards" element={<CardsPage />} />
                <Route path="crdmkr" element={<CRDMKRPage />} />
                <Route path="crdmkr/psd-professional" element={<PSDProfessionalWorkflow />} />
                <Route path="crdmkr/smart-upload" element={<SmartUploadWorkflow />} />
                <Route path="crdmkr/batch-processing" element={<BatchProcessingWorkflow />} />
                <Route path="demo/croppers" element={<CropperDemo />} />
                <Route path="feed" element={<FeedPage />} />
                <Route path="studio/:cardId?" element={<Studio />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="auth/*" element={<AuthPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
