
import React from 'react';
import { Plus, TrendingUp, Bell, Bookmark, Users } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const actions = [
    { icon: Plus, label: 'Sell Card', color: 'bg-[#00C851]' },
    { icon: TrendingUp, label: 'Trending', color: 'bg-blue-600' },
    { icon: Bell, label: 'Alerts', color: 'bg-orange-600' },
    { icon: Bookmark, label: 'Saved', color: 'bg-purple-600' },
    { icon: Users, label: 'Community', color: 'bg-pink-600' }
  ];

  return (
    <div className="p-4">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              className={`${action.color} text-white px-4 py-3 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 hover:opacity-90 transition-opacity`}
            >
              <Icon className="w-4 h-4" />
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
