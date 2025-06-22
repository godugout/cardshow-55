
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Plus, MessageSquare, User, ShoppingBag } from 'lucide-react';

export const CardshowBottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Cards', path: '/cardshow' },
    { icon: ShoppingBag, label: 'Market', path: '/cardshow/marketplace' },
    { icon: Plus, label: 'Create', path: '/cardshow/create' },
    { icon: MessageSquare, label: 'Trade', path: '/cardshow/trade' },
    { icon: User, label: 'Profile', path: '/cardshow/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-700 z-50 bottom-nav-safe">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors touch-target ${
                isActive 
                  ? 'text-[#00C851]' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
