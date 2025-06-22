
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Image, Plus, Sparkles } from 'lucide-react';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  color: string;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    path: '/',
    color: 'text-blue-500'
  },
  {
    id: 'gallery',
    label: 'Gallery', 
    icon: Image,
    path: '/gallery',
    color: 'text-purple-500'
  },
  {
    id: 'create',
    label: 'Create',
    icon: Plus,
    path: '/create',
    color: 'text-crd-green'
  },
  {
    id: 'studio',
    label: 'Studio',
    icon: Sparkles,
    path: '/studio',
    color: 'text-orange-500'
  }
];

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { isMobile, minTouchTarget } = useResponsiveLayout();

  // Only show on mobile devices
  if (!isMobile) return null;

  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-crd-darkest border-t border-crd-mediumGray/20 backdrop-blur-lg">
      <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {navItems.map((item) => {
          const isActive = isActiveRoute(item.path);
          const IconComponent = item.icon;
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`
                flex flex-col items-center justify-center rounded-lg transition-all duration-200
                ${minTouchTarget} px-3 py-1
                ${isActive 
                  ? `${item.color} bg-white/5` 
                  : 'text-crd-lightGray hover:text-white hover:bg-white/5'
                }
                active:scale-95 active:bg-white/10
              `}
            >
              <IconComponent className={`w-5 h-5 mb-1 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className={`w-1 h-1 rounded-full mt-1 ${item.color.replace('text-', 'bg-')}`} />
              )}
            </Link>
          );
        })}
      </div>
      
      {/* Safe area padding for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-crd-darkest" />
    </nav>
  );
};
