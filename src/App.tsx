
import { Routes, Route, Navigate } from 'react-router-dom';
import { OverlayProvider } from '@/components/overlay/OverlayProvider';
import { MainLayout } from '@/components/layout/MainLayout';
import Index from '@/pages/Index';
import Gallery from '@/pages/Gallery';
import Profile from '@/pages/Profile';
import AccountSettings from '@/pages/AccountSettings';
import Creators from '@/pages/Creators';
import DebugDetection from '@/pages/DebugDetection';
import Studio from '@/pages/Studio';
import Collections from '@/pages/Collections';
import { AuthPage } from '@/components/auth/AuthPage';
import { CardCreationFlow } from '@/components/editor/CardCreationFlow';

function App() {
  return (
    <OverlayProvider>
      <div className="min-h-screen bg-crd-darkest">
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Index />} />
            <Route path="studio" element={<Studio />} />
            <Route path="studio/:cardId" element={<Studio />} />
            <Route path="studio/:cardId/preset/:presetId" element={<Studio />} />
            <Route path="cards" element={<Navigate to="/cards/create" replace />} />
            <Route path="cards/create" element={<CardCreationFlow />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="collections" element={<Collections />} />
            <Route path="auth" element={<AuthPage />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<AccountSettings />} />
            <Route path="creators" element={<Creators />} />
            <Route path="debug-detection" element={<DebugDetection />} />
          </Route>
        </Routes>
      </div>
    </OverlayProvider>
  );
}

export default App;
