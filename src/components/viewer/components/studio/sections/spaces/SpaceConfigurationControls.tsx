
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, RotateCcw } from 'lucide-react';
import type { SpaceCard } from '../../../../types/spaces';

interface SpaceConfigurationControlsProps {
  spaceCards: SpaceCard[];
  onExportConfiguration: () => void;
  onResetSpace: () => void;
}

export const SpaceConfigurationControls: React.FC<SpaceConfigurationControlsProps> = ({
  spaceCards,
  onExportConfiguration,
  onResetSpace
}) => {
  if (spaceCards.length === 0) return null;

  return (
    <div>
      <h4 className="text-white font-medium text-sm mb-3">Configuration</h4>
      <div className="grid grid-cols-3 gap-2">
        <Button
          onClick={onExportConfiguration}
          variant="outline"
          size="sm"
          className="flex items-center space-x-1 text-xs"
        >
          <Download className="w-3 h-3" />
          <span>Export</span>
        </Button>
        
        <Button
          onClick={() => {}}
          variant="outline"
          size="sm"
          className="flex items-center space-x-1 text-xs"
          disabled
        >
          <Upload className="w-3 h-3" />
          <span>Import</span>
        </Button>
        
        <Button
          onClick={onResetSpace}
          variant="outline"
          size="sm"
          className="flex items-center space-x-1 text-xs text-yellow-400 hover:text-yellow-300"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </Button>
      </div>
    </div>
  );
};
