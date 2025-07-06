import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Plus, Image, Palette, Beaker } from 'lucide-react';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

const navigationItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/create', icon: Plus, label: 'Create' },
  { path: '/gallery', icon: Image, label: 'Gallery' },
  { path: '/studio', icon: Palette, label: 'Studio' },
  { path: '/labs', icon: Beaker, label: 'Labs' }
];

export const MobileNavigation: React.FC = () => {
  const { isMobile } = useResponsiveLayout();
  const location = useLocation();

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-crd-dark/95 backdrop-blur-sm border-t border-crd-mediumGray">
      <div className="flex items-center justify-around py-2">
        {navigationItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive 
                  ? 'text-crd-green bg-crd-green/10' 
                  : 'text-crd-lightGray hover:text-crd-white'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};