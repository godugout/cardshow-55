
import React from 'react';
import { Download, Share2, Maximize2, Minimize2, Orbit, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StudioFooterProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onDownload: () => void;
  onShare?: () => void;
  onToggle3D?: () => void;
  is3D?: boolean;
  onToggleCustomize?: () => void;
}

export const StudioFooter: React.FC<StudioFooterProps> = ({
  isFullscreen,
  onToggleFullscreen,
  onDownload,
  onShare,
  onToggle3D,
  is3D,
  onToggleCustomize
}) => {
  return (
    <div className="border-t border-white/10 p-4 bg-black/50">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFullscreen}
          className="flex-1 border-white/20 text-white hover:bg-white/10"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 mr-2" /> : <Maximize2 className="w-4 h-4 mr-2" />}
          View
        </Button>
        
        {onToggle3D && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggle3D}
            className="flex-1 border-white/20 text-white hover:bg-white/10"
          >
            <Orbit className="w-4 h-4 mr-2" />
            {is3D ? 'View 2D' : 'View 3D'}
          </Button>
        )}

        {onToggleCustomize && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleCustomize}
            className="flex-1 border-white/20 text-white hover:bg-white/10"
          >
            <Settings className="w-4 h-4 mr-2" />
            Customize
          </Button>
        )}

        {onShare && (
          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            className="flex-1 border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={onDownload}
          className="flex-1 border-crd-green/50 text-crd-green hover:bg-crd-green/10"
        >
          <Download className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
};
