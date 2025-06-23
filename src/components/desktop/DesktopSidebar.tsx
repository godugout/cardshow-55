
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Image, 
  Plus, 
  Sparkles, 
  User, 
  Settings,
  LogOut,
  TrendingUp,
  Users
} from 'lucide-react';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { LogoSelector } from '@/components/home/navbar/LogoSelector';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'gallery', label: 'Gallery', icon: Image, path: '/gallery' },
  { id: 'create', label: 'Create', icon: Plus, path: '/create' },
  { id: 'studio', label: 'Studio', icon: Sparkles, path: '/studio' },
  { id: 'collections', label: 'Collections', icon: TrendingUp, path: '/collections' },
  { id: 'community', label: 'Community', icon: Users, path: '/feed' },
];

const bottomNavItems: NavItem[] = [
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

export const DesktopSidebar: React.FC = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-crd-darker border-r border-crd-mediumGray/20 z-30">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-crd-mediumGray/20">
          <LogoSelector onColorChange={() => {}} />
        </div>
        
        {/* Main Navigation */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {mainNavItems.map((item) => {
              const isActive = isActiveRoute(item.path);
              const IconComponent = item.icon;
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-crd-green text-black font-semibold' 
                      : 'text-crd-lightGray hover:text-white hover:bg-crd-mediumGray/20'
                    }
                  `}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-crd-orange text-black text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
        
        {/* Bottom Navigation */}
        <div className="p-4 border-t border-crd-mediumGray/20">
          <div className="space-y-2 mb-4">
            {bottomNavItems.map((item) => {
              const isActive = isActiveRoute(item.path);
              const IconComponent = item.icon;
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-crd-green text-black font-semibold' 
                      : 'text-crd-lightGray hover:text-white hover:bg-crd-mediumGray/20'
                    }
                  `}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="w-full justify-start gap-3 text-crd-lightGray hover:text-white hover:bg-crd-mediumGray/20"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
};
