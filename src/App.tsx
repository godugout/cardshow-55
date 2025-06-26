import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './components/ui/theme-provider';
import { Home } from './pages/Home';
import { AuthPage } from './pages/AuthPage';
import { Profile } from './pages/Profile';
import { Gallery } from './pages/Gallery';
import { CardsPage } from './pages/CardsPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthProvider } from './features/auth/providers/AuthProvider';
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from 'react-query';
import { Studio } from './pages/Studio';
import { FeedPage } from './pages/FeedPage';
import CreateCard from '@/pages/CreateCard';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster />
        <Router>
          <AuthProvider>
            <div className="min-h-screen bg-crd-darkest">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/gallery" 
                  element={
                    <ProtectedRoute>
                      <Gallery />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/cards" 
                  element={
                    <ProtectedRoute>
                      <CardsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/cards/create" 
                  element={
                    <ProtectedRoute>
                      <CreateCard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/studio" 
                  element={
                    <ProtectedRoute>
                      <Studio />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/feed" 
                  element={
                    <ProtectedRoute>
                      <FeedPage />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </div>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
