
import React, { useState } from 'react';
import { Menu, X, Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { LogoSelector } from '@/components/home/navbar/LogoSelector';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { ProfileDropdown } from '@/components/home/navbar/ProfileDropdown';
import { Link } from 'react-router-dom';

interface MobileHeaderProps {
  title?: string;
  showSearch?: boolean;
  showMenu?: boolean;
  onMenuToggle?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  showSearch = false,
  showMenu = true,
  onMenuToggle
}) => {
  const { isMobile, minTouchTarget } = useResponsiveLayout();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isMobile) return null;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    onMenuToggle?.();
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-crd-darkest/95 backdrop-blur-lg border-b border-crd-mediumGray/20">
        <div className="flex items-center justify-between px-4 py-3 safe-area-inset-top">
          {/* Left: Menu or Logo */}
          <div className="flex items-center">
            {showMenu ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMenu}
                className={`${minTouchTarget} p-2 text-crd-lightGray hover:text-white`}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            ) : (
              <LogoSelector onColorChange={() => {}} />
            )}
          </div>

          {/* Center: Title */}
          {title && (
            <h1 className="text-lg font-semibold text-white truncate mx-4">
              {title}
            </h1>
          )}

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {showSearch && (
              <Button
                variant="ghost"
                size="sm"
                className={`${minTouchTarget} p-2 text-crd-lightGray hover:text-white`}
              >
                <Search className="w-5 h-5" />
              </Button>
            )}
            
            {user && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${minTouchTarget} p-2 text-crd-lightGray hover:text-white`}
                >
                  <Bell className="w-5 h-5" />
                </Button>
                <ProfileDropdown />
              </>
            )}
            
            {!user && (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="text-xs px-3 py-1">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm" onClick={toggleMenu}>
          <div 
            className="fixed top-0 left-0 w-64 h-full bg-crd-darkest border-r border-crd-mediumGray/20 transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu content */}
            <div className="pt-20 px-4">
              <nav className="space-y-4">
                <Link 
                  to="/collections" 
                  className="block py-3 px-4 text-crd-lightGray hover:text-white hover:bg-crd-mediumGray/20 rounded-lg transition-colors"
                  onClick={toggleMenu}
                >
                  Collections
                </Link>
                <Link 
                  to="/profile" 
                  className="block py-3 px-4 text-crd-lightGray hover:text-white hover:bg-crd-mediumGray/20 rounded-lg transition-colors"
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
                <Link 
                  to="/settings" 
                  className="block py-3 px-4 text-crd-lightGray hover:text-white hover:bg-crd-mediumGray/20 rounded-lg transition-colors"
                  onClick={toggleMenu}
                >
                  Settings
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
