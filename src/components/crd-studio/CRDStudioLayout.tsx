import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Plus, 
  Edit3, 
  Image, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Palette,
  Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CRDStudioLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/crd-studio',
    icon: LayoutDashboard,
    description: 'Overview & recent projects'
  },
  {
    title: 'Create',
    href: '/crd-studio/create',
    icon: Plus,
    description: 'Start a new card project'
  },
  {
    title: 'Gallery',
    href: '/crd-studio/gallery',
    icon: Image,
    description: 'Browse your creations'
  }
];

const quickActions = [
  {
    title: 'Quick Create',
    icon: Camera,
    description: 'Upload & extract cards',
    color: 'from-crd-orange to-crd-gold'
  },
  {
    title: 'AI Effects',
    icon: Sparkles,
    description: 'Apply smart effects',
    color: 'from-crd-purple to-crd-blue'
  },
  {
    title: 'Templates',
    icon: Palette,
    description: 'Browse templates',
    color: 'from-crd-green to-crd-blue'
  }
];

export const CRDStudioLayout: React.FC<CRDStudioLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    if (path === '/crd-studio') {
      return location.pathname === '/crd-studio';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full bg-crd-dark border-r border-crd-mediumGray transition-all duration-300 z-50",
        sidebarCollapsed ? "w-16" : "w-72"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-crd-mediumGray">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-crd-orange to-crd-gold rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-crd-white">CRD Studio</h1>
                  <p className="text-xs text-crd-lightGray">Professional Card Creator</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-crd-lightGray hover:text-crd-white hover:bg-crd-mediumGray"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4">
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200",
                    isActive 
                      ? "bg-crd-orange text-white shadow-lg" 
                      : "text-crd-lightGray hover:text-crd-white hover:bg-crd-mediumGray"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs opacity-70">{item.description}</div>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Actions */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-crd-mediumGray mt-auto">
            <h3 className="text-sm font-medium text-crd-lightGray mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.title}
                    className={cn(
                      "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200",
                      "bg-gradient-to-r", action.color,
                      "text-white hover:shadow-lg hover:scale-105"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <div className="text-left">
                      <div className="text-sm font-medium">{action.title}</div>
                      <div className="text-xs opacity-80">{action.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "ml-16" : "ml-72"
      )}>
        <main className="min-h-screen bg-crd-darkest">
          {children}
        </main>
      </div>
    </div>
  );
};