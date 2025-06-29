import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/features/auth/providers/AuthProvider';
import { MainLayout } from '@/layouts/MainLayout';
import { Home } from '@/pages/Home';
import { CreateCard } from '@/pages/CreateCard';
import { CardsPage } from '@/pages/CardsPage';
import { FeedPage } from '@/pages/Feed';
import { Studio } from '@/pages/Studio';
import { Gallery } from '@/pages/Gallery';
import { AuthPage } from '@/pages/Auth';
import CRDMKRPage from '@/pages/CRDMKRPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="crd-ui-theme">
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-crd-darkest text-white">
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/create" element={<CreateCard />} />
                  <Route path="/cards" element={<CardsPage />} />
                  <Route path="/crdmkr" element={<CRDMKRPage />} />
                  <Route path="/feed" element={<FeedPage />} />
                  <Route path="/studio/:cardId?" element={<Studio />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/auth/*" element={<AuthPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </MainLayout>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
