
import React from 'react';
import { Button } from '@/components/ui/button';
import { List, Grid3X3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LightingViewToggleProps {
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
}

export const LightingViewToggle: React.FC<LightingViewToggleProps> = ({
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex items-center justify-end">
      <div className="flex items-center space-x-1 bg-white/10 rounded-lg p-1">
        <Button
          onClick={() => onViewModeChange('list')}
          variant="ghost"
          size="sm"
          className={cn(
            "h-6 w-6 p-0",
            viewMode === 'list' ? "bg-white/20 text-white" : "text-gray-400"
          )}
        >
          <List className="w-3 h-3" />
        </Button>
        <Button
          onClick={() => onViewModeChange('grid')}
          variant="ghost"
          size="sm"
          className={cn(
            "h-6 w-6 p-0",
            viewMode === 'grid' ? "bg-white/20 text-white" : "text-gray-400"
          )}
        >
          <Grid3X3 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};
