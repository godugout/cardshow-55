
import React from "react";
import { Link, useLocation } from "react-router-dom";

export const NavLinks = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="flex items-center gap-8">
      <Link 
        to="/" 
        className={`nav-item ${isActive('/') ? 'active' : ''}`}
      >
        Home
      </Link>
      <Link 
        to="/create" 
        className={`nav-item ${location.pathname.startsWith('/create') ? 'active' : ''}`}
      >
        Create
      </Link>
      <Link 
        to="/gallery" 
        className={`nav-item ${isActive('/gallery') ? 'active' : ''}`}
      >
        Gallery
      </Link>
      <Link 
        to="/collections" 
        className={`nav-item ${isActive('/collections') ? 'active' : ''}`}
      >
        Collections
      </Link>
    </div>
  );
};
