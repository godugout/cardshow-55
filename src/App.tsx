
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { OverlayProvider } from '@/components/overlay/OverlayProvider';
import { MainLayout } from '@/components/layout/MainLayout';
import Index from '@/pages/Index';
import Gallery from '@/pages/Gallery';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Studio from '@/pages/Studio';
import Collections from '@/pages/Collections';
import { AuthPage } from '@/components/auth/AuthPage';
import { UnifiedCardCreator } from '@/components/creator/UnifiedCardCreator';
import { BackofficeLayout } from '@/components/backoffice/BackofficeLayout';

function App() {
  const [showBackoffice, setShowBackoffice] = useState(false);

  if (showBackoffice) {
    return (
      <OverlayProvider>
        <BackofficeLayout />
      </OverlayProvider>
    );
  }

  return (
    <OverlayProvider>
      <div className="min-h-screen bg-crd-darkest">
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Index />} />
            <Route path="studio" element={<Studio />} />
            <Route path="studio/:cardId" element={<Studio />} />
            <Route path="studio/:cardId/preset/:presetId" element={<Studio />} />
            
            {/* Simplified card creation routes */}
            <Route path="create" element={<UnifiedCardCreator />} />
            <Route path="cards/create" element={<Navigate to="/create" replace />} />
            <Route path="cards" element={<Navigate to="/create" replace />} />
            
            <Route path="gallery" element={<Gallery />} />
            <Route path="collections" element={<Collections />} />
            <Route path="auth" element={<AuthPage />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            
            {/* Hidden backoffice route */}
            <Route path="admin/backoffice" element={<div />} />
          </Route>
        </Routes>
        
        {/* Global keyboard shortcut for backoffice access */}
        <div
          onKeyDown={(e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'B') {
              setShowBackoffice(true);
            }
          }}
          style={{ position: 'fixed', top: 0, left: 0, width: 1, height: 1, opacity: 0 }}
          tabIndex={-1}
        />
      </div>
    </OverlayProvider>
  );
}

export default App;
