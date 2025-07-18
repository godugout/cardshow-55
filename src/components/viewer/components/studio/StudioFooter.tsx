
import React from 'react';
import { Download, Share2, Maximize2, Minimize2, Play, ArrowRight, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TemplateEngine } from '@/templates/engine';

interface StudioFooterProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onDownload: () => void;
  onShare?: () => void;
  
  // Template engine integration
  templateEngine?: TemplateEngine;
  onReplayTemplate?: () => void;
  onStudioEntry?: () => void;
  animationProgress?: number;
  isCosmicPlaying?: boolean;
}

export const StudioFooter: React.FC<StudioFooterProps> = ({
  isFullscreen,
  onToggleFullscreen,
  onDownload,
  onShare,
  templateEngine,
  onReplayTemplate,
  onStudioEntry,
  animationProgress = 0,
  isCosmicPlaying = false
}) => {
  // Template engine state
  const isTemplateReplayable = templateEngine?.replayable || false;
  const hasTemplateCompleted = animationProgress >= 1 && !isCosmicPlaying;
  const canTransitionToStudio = templateEngine?.transitionToStudio && hasTemplateCompleted;
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

        {/* Right side - Cosmic Dance Info & Controls */}
        {templateEngine && (
          <div className="flex items-end gap-3">
            {/* Minimal info display - 3-4 lines max */}
            <div className="text-right text-xs text-white/60">
              <div className="flex items-center gap-1">
                <Film className="w-3 h-3 text-crd-orange" />
                <span className="text-white/80 font-medium">{templateEngine.name || templateEngine.id}</span>
              </div>
              <div>{isCosmicPlaying ? 'Playing...' : hasTemplateCompleted ? 'Complete' : 'Ready'}</div>
              <div>Progress: {Math.round(animationProgress * 100)}%</div>
              {templateEngine.replayable && <div className="text-crd-orange">Replayable</div>}
            </div>

            {/* Template controls */}
            <div className="flex gap-2">
              {isTemplateReplayable && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onReplayTemplate}
                  disabled={isCosmicPlaying}
                  className={
                    isCosmicPlaying
                      ? 'border-white/10 text-white/30 cursor-not-allowed'
                      : 'border-crd-orange/50 text-crd-orange hover:bg-crd-orange/10'
                  }
                >
                  <Play className="w-4 h-4 mr-2" />
                  Replay
                </Button>
              )}
              
              {canTransitionToStudio && onStudioEntry && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onStudioEntry}
                  className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Customize
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
