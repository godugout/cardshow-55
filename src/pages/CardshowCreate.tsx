
import React, { useState } from 'react';
import { Camera, Upload, Plus, ArrowLeft } from 'lucide-react';
import { MobileCreationStudio } from '@/components/cardshow/creation/MobileCreationStudio';

type CreateMode = 'select' | 'studio';

export const CardshowCreate: React.FC = () => {
  const [mode, setMode] = useState<CreateMode>('select');

  if (mode === 'studio') {
    return <MobileCreationStudio />;
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] pb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-white mb-6">Create Card</h1>
        
        <div className="space-y-4">
          <button 
            onClick={() => setMode('studio')}
            className="w-full bg-[#00C851] text-black rounded-lg p-6 font-semibold hover:bg-[#00C851]/90 transition-colors touch-target group"
          >
            <Plus className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold mb-2">Create from Template</h3>
            <p className="text-black/70 text-sm">Professional templates for sports, fantasy & gaming cards</p>
          </button>

          <button className="w-full bg-[#2d2d2d] border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-[#00C851] transition-colors group touch-target">
            <Camera className="w-8 h-8 text-gray-400 group-hover:text-[#00C851] mx-auto mb-3 transition-colors group-hover:scale-110 transition-transform" />
            <h3 className="text-white text-lg font-semibold mb-2">Take Photo</h3>
            <p className="text-gray-400 text-sm">Use your camera to capture a new card</p>
          </button>

          <button className="w-full bg-[#2d2d2d] border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-[#00C851] transition-colors group touch-target">
            <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#00C851] mx-auto mb-3 transition-colors group-hover:scale-110 transition-transform" />
            <h3 className="text-white text-lg font-semibold mb-2">Upload Image</h3>
            <p className="text-gray-400 text-sm">Select an image from your gallery</p>
          </button>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 p-4 bg-[#2d2d2d]/50 rounded-lg border border-gray-600">
          <h4 className="text-white font-medium mb-2">Pro Tips</h4>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Use high-resolution images for best quality</li>
            <li>• Portrait orientation works best for trading cards</li>
            <li>• Templates include pre-made layouts and effects</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
