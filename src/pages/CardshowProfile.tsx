
import React from 'react';
import { Settings, Trophy, Star, Users } from 'lucide-react';

export const CardshowProfile: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#1a1a1a] pb-20">
      <div className="p-4">
        {/* Profile header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-[#00C851] rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-black">JD</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">John Doe</h1>
          <p className="text-gray-400">@johndoe_cards</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#2d2d2d] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">247</div>
            <div className="text-gray-400 text-sm">Cards</div>
          </div>
          <div className="bg-[#2d2d2d] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">18</div>
            <div className="text-gray-400 text-sm">Trades</div>
          </div>
          <div className="bg-[#2d2d2d] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">4.8</div>
            <div className="text-gray-400 text-sm">Rating</div>
          </div>
        </div>

        {/* Menu items */}
        <div className="space-y-3">
          <button className="w-full bg-[#2d2d2d] p-4 rounded-lg flex items-center gap-4 hover:bg-[#3d3d3d] transition-colors">
            <Trophy className="w-6 h-6 text-[#00C851]" />
            <span className="text-white font-medium">Achievements</span>
          </button>
          
          <button className="w-full bg-[#2d2d2d] p-4 rounded-lg flex items-center gap-4 hover:bg-[#3d3d3d] transition-colors">
            <Star className="w-6 h-6 text-[#00C851]" />
            <span className="text-white font-medium">Favorites</span>
          </button>
          
          <button className="w-full bg-[#2d2d2d] p-4 rounded-lg flex items-center gap-4 hover:bg-[#3d3d3d] transition-colors">
            <Users className="w-6 h-6 text-[#00C851]" />
            <span className="text-white font-medium">Friends</span>
          </button>
          
          <button className="w-full bg-[#2d2d2d] p-4 rounded-lg flex items-center gap-4 hover:bg-[#3d3d3d] transition-colors">
            <Settings className="w-6 h-6 text-[#00C851]" />
            <span className="text-white font-medium">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
