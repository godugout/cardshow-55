import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Home, ImageIcon, Palette, Sparkles, Grid } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isStudioRoute = location.pathname.startsWith('/studio');

  return (
    <nav className="bg-crd-darker border-b border-crd-mediumGray/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Static for Studio, link for other pages */}
          {isStudioRoute ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <img
                  src="/lovable-uploads/786e777f-b56f-4080-9b40-aef8e8303f27.png"
                  alt="CRD Logo"
                  className="w-8 h-8"
                />
                <span className="text-white font-bold text-xl font-orbitron">CARDSHOW</span>
              </div>
            </div>
          ) : (
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="flex items-center space-x-2">
                <img
                  src="/lovable-uploads/786e777f-b56f-4080-9b40-aef8e8303f27.png"
                  alt="CRD Logo"
                  className="w-8 h-8"
                />
                <span className="text-white font-bold text-xl font-orbitron">CARDSHOW</span>
              </div>
            </Link>
          )}

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-crd-green bg-crd-green/10' 
                  : 'text-crd-lightGray hover:text-white hover:bg-crd-mediumGray/20'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            <Link
              to="/create"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/create') 
                  ? 'text-crd-green bg-crd-green/10' 
                  : 'text-crd-lightGray hover:text-white hover:bg-crd-mediumGray/20'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Create</span>
            </Link>

            <Link
              to="/crdmkr"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/crdmkr') 
                  ? 'text-crd-green bg-crd-green/10' 
                  : 'text-crd-lightGray hover:text-white hover:bg-crd-mediumGray/20'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>CRDMKR</span>
            </Link>

            <Link
              to="/cards"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/cards') 
                  ? 'text-crd-green bg-crd-green/10' 
                  : 'text-crd-lightGray hover:text-white hover:bg-crd-mediumGray/20'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Cards</span>
            </Link>

            <Link
              to="/gallery"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/gallery') 
                  ? 'text-crd-green bg-crd-green/10' 
                  : 'text-crd-lightGray hover:text-white hover:bg-crd-mediumGray/20'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Gallery</span>
            </Link>

            <Link
              to="/studio"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/studio') 
                  ? 'text-crd-green bg-crd-green/10' 
                  : 'text-crd-lightGray hover:text-white hover:bg-crd-mediumGray/20'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Studio</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
