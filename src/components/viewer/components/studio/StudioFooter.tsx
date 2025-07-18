
import React from 'react';
import { Download, Share2, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StudioFooterProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onDownload: () => void;
  onShare?: () => void;
}

export const StudioFooter: React.FC<StudioFooterProps> = ({
  isFullscreen,
  onToggleFullscreen,
  onDownload,
  onShare
}) => {
  return (
    <div className="border-t border-white/10 p-4 bg-black/50">
      <div className="flex justify-between items-end gap-4">
        {/* Left side - Main controls */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFullscreen}
            className="border-white/20 text-white hover:bg-white/10"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 mr-2" /> : <Maximize2 className="w-4 h-4 mr-2" />}
            View
          </Button>
          
          {onShare && (
            <Button
              variant="outline"
              size="sm"
              onClick={onShare}
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            className="border-crd-green/50 text-crd-green hover:bg-crd-green/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>

      </div>
    </div>
  );
};
