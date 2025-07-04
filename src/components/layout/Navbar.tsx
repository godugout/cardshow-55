
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Home, ImageIcon, Palette, FlaskConical } from 'lucide-react';
import { LogoSelector } from '@/components/home/navbar/LogoSelector';

const getNavbarColorClasses = (color: string) => {
  const colorMap = {
    orange: 'bg-gradient-to-r from-orange-500/5 to-orange-400/5 border-b-orange-500/10',
    red: 'bg-gradient-to-r from-red-500/5 to-red-400/5 border-b-red-500/10',
    green: 'bg-gradient-to-r from-green-500/5 to-green-400/5 border-b-green-500/10',
    yellow: 'bg-gradient-to-r from-yellow-500/5 to-yellow-400/5 border-b-yellow-500/10',
    blue: 'bg-gradient-to-r from-blue-500/5 to-blue-400/5 border-b-blue-500/10',
    gray: 'bg-gradient-to-r from-gray-500/5 to-gray-400/5 border-b-gray-500/10',
    emerald: 'bg-gradient-to-r from-emerald-500/5 to-emerald-400/5 border-b-emerald-500/10',
    purple: 'bg-gradient-to-r from-purple-500/5 to-purple-400/5 border-b-purple-500/10',
    slate: 'bg-gradient-to-r from-slate-500/5 to-slate-400/5 border-b-slate-500/10',
    amber: 'bg-gradient-to-r from-amber-500/5 to-amber-400/5 border-b-amber-500/10',
    cyan: 'bg-gradient-to-r from-cyan-500/5 to-cyan-400/5 border-b-cyan-500/10',
    indigo: 'bg-gradient-to-r from-indigo-500/5 to-indigo-400/5 border-b-indigo-500/10',
  };
  return colorMap[color] || 'bg-gradient-to-r from-gray-500/5 to-gray-400/5 border-b-gray-500/10';
};

export const Navbar = () => {
  const location = useLocation();
  const [currentTheme, setCurrentTheme] = useState('sf-orange');

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar-themed sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Selector */}
          <div className="flex items-center">
            <LogoSelector onThemeChange={setCurrentTheme} />
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-themed-active' 
                  : 'text-themed-secondary hover-themed'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            <Link
              to="/create"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/create') 
                  ? 'text-themed-active' 
                  : 'text-themed-secondary hover-themed'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Create</span>
            </Link>

            <Link
              to="/gallery"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/gallery') 
                  ? 'text-themed-active' 
                  : 'text-themed-secondary hover-themed'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Gallery</span>
            </Link>

            <Link
              to="/studio"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/studio') 
                  ? 'text-themed-active' 
                  : 'text-themed-secondary hover-themed'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Studio</span>
            </Link>

            <Link
              to="/labs"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/labs') 
                  ? 'text-themed-active' 
                  : 'text-themed-secondary hover-themed'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              <span>Labs</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
