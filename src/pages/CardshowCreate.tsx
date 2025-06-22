
import React from 'react';
import { Plus, Camera, Upload } from 'lucide-react';

export const CardshowCreate: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#1a1a1a] pb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-white mb-6">Create Card</h1>
        
        <div className="space-y-4">
          <button className="w-full bg-[#2d2d2d] border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-[#00C851] transition-colors group">
            <Camera className="w-12 h-12 text-gray-400 group-hover:text-[#00C851] mx-auto mb-4 transition-colors" />
            <h3 className="text-white text-lg font-semibold mb-2">Take Photo</h3>
            <p className="text-gray-400">Use your camera to capture a new card</p>
          </button>

          <button className="w-full bg-[#2d2d2d] border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-[#00C851] transition-colors group">
            <Upload className="w-12 h-12 text-gray-400 group-hover:text-[#00C851] mx-auto mb-4 transition-colors" />
            <h3 className="text-white text-lg font-semibold mb-2">Upload Image</h3>
            <p className="text-gray-400">Select an image from your gallery</p>
          </button>

          <button className="w-full bg-[#00C851] text-black rounded-lg p-4 font-semibold hover:bg-[#00C851]/90 transition-colors">
            <Plus className="w-5 h-5 inline mr-2" />
            Create from Template
          </button>
        </div>
      </div>
    </div>
  );
};
