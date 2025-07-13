
import React from "react";
import { Link, useLocation } from "react-router-dom";

export const NavLinks = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/collections') {
      return location.pathname === path || location.pathname.startsWith('/collections');
    }
    return location.pathname === path;
  };
  
  return (
    <div className="flex items-center gap-8">
      <Link 
        to="/" 
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive('/') 
            ? 'text-themed-active' 
            : 'text-themed-secondary hover-themed'
        }`}
      >
        Home
      </Link>
      <Link 
        to="/studio" 
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          location.pathname.startsWith('/studio') 
            ? 'text-themed-active' 
            : 'text-themed-secondary hover-themed'
        }`}
      >
        Studio
      </Link>
      <Link 
        to="/collections" 
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive('/collections') 
            ? 'text-themed-active' 
            : 'text-themed-secondary hover-themed'
        }`}
      >
        Collections
      </Link>
      <Link 
        to="/showcase" 
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          location.pathname.startsWith('/showcase') 
            ? 'text-themed-active' 
            : 'text-themed-secondary hover-themed'
        }`}
      >
        Showcase
      </Link>
      <Link 
        to="/cards" 
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          location.pathname.startsWith('/cards') 
            ? 'text-themed-active' 
            : 'text-themed-secondary hover-themed'
        }`}
      >
        Cards
      </Link>
      <Link 
        to="/gallery" 
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive('/gallery') 
            ? 'text-themed-active' 
            : 'text-themed-secondary hover-themed'
        }`}
      >
        Gallery
      </Link>
      <Link 
        to="/creators" 
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive('/creators') 
            ? 'text-themed-active' 
            : 'text-themed-secondary hover-themed'
        }`}
      >
        Creators
      </Link>
      <Link 
        to="/cards/bulk-upload" 
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive('/cards/bulk-upload') 
            ? 'text-themed-active' 
            : 'text-themed-secondary hover-themed'
        }`}
      >
        Bulk Upload
      </Link>
    </div>
  );
};
