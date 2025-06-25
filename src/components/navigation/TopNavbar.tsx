
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { LogoSelector } from '@/components/home/navbar/LogoSelector';
import { Button } from '@/components/ui/button';
import { User, Settings } from 'lucide-react';

export const TopNavbar: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-crd-darker border-b border-crd-mediumGray/20 px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <LogoSelector onColorChange={() => {}} />
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className="text-crd-lightGray hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link 
            to="/gallery" 
            className="text-crd-lightGray hover:text-white transition-colors"
          >
            Gallery
          </Link>
          <Link 
            to="/collections" 
            className="text-crd-lightGray hover:text-white transition-colors"
          >
            Collections
          </Link>
          <Link 
            to="/viewer" 
            className="text-crd-lightGray hover:text-white transition-colors"
          >
            3D Viewer
          </Link>
          {user && (
            <>
              <Link 
                to="/create" 
                className="text-crd-lightGray hover:text-white transition-colors"
              >
                Create
              </Link>
              <Link 
                to="/studio" 
                className="text-crd-lightGray hover:text-white transition-colors"
              >
                Studio
              </Link>
              <Link 
                to="/trading" 
                className="text-crd-lightGray hover:text-white transition-colors"
              >
                Trading
              </Link>
              <Link 
                to="/advanced" 
                className="text-crd-lightGray hover:text-white transition-colors"
              >
                Advanced Tools
              </Link>
            </>
          )}
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="text-crd-lightGray hover:text-white">
                  <User className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="ghost" size="sm" className="text-crd-lightGray hover:text-white">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
              <Button 
                onClick={signOut}
                variant="outline" 
                size="sm"
                className="border-crd-mediumGray text-crd-lightGray hover:text-white"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button 
                variant="outline" 
                size="sm"
                className="border-crd-green text-crd-green hover:bg-crd-green hover:text-black"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
