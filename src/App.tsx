
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './features/auth/providers/AuthProvider';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Import pages with correct syntax
import Home from './pages/Index';
import AuthPage from './pages/auth/SignIn';
import Profile from './pages/Profile';
import Gallery from './pages/Gallery';
import Studio from './pages/Studio';
import CreateCard from './pages/CreateCard';

// Create missing pages
import CardsPage from './pages/CardsPage';
import FeedPage from './pages/FeedPage';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-950 text-white">
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
      </div>
    </QueryClientProvider>
  );
}

export default App;
