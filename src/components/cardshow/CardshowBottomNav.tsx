
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Grid3X3, Plus, ArrowLeftRight, User } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    id: 'browse',
    label: 'Browse',
    icon: Grid3X3,
    path: '/cardshow'
  },
  {
    id: 'create',
    label: 'Create',
    icon: Plus,
    path: '/cardshow/create'
  },
  {
    id: 'trade',
    label: 'Trade',
    icon: ArrowLeftRight,
    path: '/cardshow/trade',
    badge: 2
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    path: '/cardshow/profile'
  }
];

export const CardshowBottomNav: React.FC = () => {
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    if (path === '/cardshow') {
      return location.pathname === '/cardshow' || location.pathname === '/cardshow/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a] border-t border-gray-700 backdrop-blur-lg">
      <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {navItems.map((item) => {
          const isActive = isActiveRoute(item.path);
          const IconComponent = item.icon;
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`
                relative flex flex-col items-center justify-center rounded-lg transition-all duration-200
                min-h-[44px] min-w-[44px] px-3 py-1
                ${isActive 
                  ? 'text-[#00C851] bg-[#00C851]/10' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
                active:scale-95 active:bg-white/10
              `}
            >
              <div className="relative">
                <IconComponent className={`w-5 h-5 mb-1 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                {item.badge && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{item.badge}</span>
                  </div>
                )}
              </div>
              <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute bottom-0 w-6 h-0.5 bg-[#00C851] rounded-t" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
