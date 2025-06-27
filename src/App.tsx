
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';

// Import pages with correct syntax
import Home from './pages/Index';
import AuthPage from './pages/auth/SignIn';
import Profile from './pages/Profile';
import Gallery from './pages/Gallery';
import Studio from './pages/Studio';
import CreateCard from './pages/CreateCard';
import Creators from './pages/Creators';
import Showcase from './pages/Showcase';

// Create missing pages
import CardsPage from './pages/CardsPage';
import FeedPage from './pages/FeedPage';

function App() {
  return (
    <div className="min-h-screen bg-crd-darkest">
      <Toaster />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="auth" element={<AuthPage />} />
          <Route 
            path="profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="gallery" 
            element={
              <ProtectedRoute>
                <Gallery />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="cards" 
            element={
              <ProtectedRoute>
                <CardsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="cards/create" 
            element={
              <ProtectedRoute>
                <CreateCard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="studio" 
            element={
              <ProtectedRoute>
                <Studio />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="studio/:cardId" 
            element={
              <ProtectedRoute>
                <Studio />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="showcase" 
            element={
              <ProtectedRoute>
                <Showcase />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="showcase/:cardId" 
            element={
              <ProtectedRoute>
                <Showcase />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="creators" 
            element={
              <ProtectedRoute>
                <Creators />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="feed" 
            element={
              <ProtectedRoute>
                <FeedPage />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
