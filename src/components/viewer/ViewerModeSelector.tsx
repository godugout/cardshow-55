
import React from 'react';
import { Eye, Sparkles, ShoppingBag } from 'lucide-react';
import type { ViewerMode } from '@/pages/Viewer';

interface ViewerModeSelectorProps {
  currentMode: ViewerMode;
  onModeChange: (mode: ViewerMode) => void;
}

export const ViewerModeSelector: React.FC<ViewerModeSelectorProps> = ({
  currentMode,
  onModeChange
}) => {
  const modes = [
    { id: 'view' as const, label: 'View', icon: Eye },
    { id: 'studio' as const, label: 'Studio', icon: Sparkles },
    { id: 'shop' as const, label: 'Shop', icon: ShoppingBag },
  ];

  return (
    <div className="flex items-center bg-black/20 backdrop-blur-sm rounded-lg p-1">
      {modes.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onModeChange(id)}
          className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            currentMode === id
              ? 'bg-crd-purple text-white'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <Icon className="w-4 h-4 mr-2" />
          {label}
        </button>
      ))}
    </div>
  );
};
