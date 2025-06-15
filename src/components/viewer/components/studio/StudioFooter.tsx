
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
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
      <div className="flex items-center gap-2 p-2 bg-black/30 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFullscreen}
          className="border-transparent text-white/80 hover:bg-white/10 hover:text-white rounded-full"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 mr-2" /> : <Maximize2 className="w-4 h-4 mr-2" />}
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </Button>
        
        {onToggle3D && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggle3D}
            className="border-transparent text-white/80 hover:bg-white/10 hover:text-white rounded-full"
          >
            <Orbit className="w-4 h-4 mr-2" />
            {is3D ? '2D' : '3D'}
          </Button>
        )}

        {onToggleCustomize && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleCustomize}
            className="border-transparent text-white/80 hover:bg-white/10 hover:text-white rounded-full"
          >
            <Settings className="w-4 h-4 mr-2" />
            Customize
          </Button>
        )}

        <div className="h-6 w-px bg-white/20 mx-1"></div>

        {onShare && (
          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            className="border-transparent text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 rounded-full"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        )}
        
        <Button
          variant="default"
          size="sm"
          onClick={onDownload}
          className="bg-crd-primary text-black hover:bg-crd-primary/90 rounded-full font-semibold"
        >
          <Download className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
};
