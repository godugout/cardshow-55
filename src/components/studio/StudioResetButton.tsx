import React from 'react';
import { RotateCcw } from 'lucide-react';

interface StudioResetButtonProps {
  onReset: () => void;
}

export const StudioResetButton: React.FC<StudioResetButtonProps> = ({ onReset }) => {
  return (
    <button
      onClick={onReset}
      className="w-12 h-12 rounded-full bg-crd-darkGray/80 backdrop-blur-sm border border-crd-mediumGray/30 hover:bg-crd-mediumGray/50 transition-all duration-200 flex items-center justify-center group"
      title="Reset Camera View"
    >
      <RotateCcw 
        className="w-4 h-4 text-crd-lightGray group-hover:text-crd-white group-hover:rotate-180 transition-all duration-300" 
      />
      
      {/* Tooltip */}
      <div className="absolute left-full ml-3 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        Reset View
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 bg-black/80 rotate-45" />
      </div>
    </button>
  );
};