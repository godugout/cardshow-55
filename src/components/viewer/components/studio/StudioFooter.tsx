
import React from 'react';
import { Download, Share2, Maximize2, Minimize2, RotateCcw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TemplateEngine } from '@/templates/engine';

interface StudioFooterProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onDownload: () => void;
  onShare?: () => void;
  templateEngine?: TemplateEngine;
  animationProgress?: number;
  onReplay?: () => void;
  onContinueToCustomize?: () => void;
  mode?: 'cinematic' | 'preview' | 'studio';
}

export const StudioFooter: React.FC<StudioFooterProps> = ({
  isFullscreen,
  onToggleFullscreen,
  onDownload,
  onShare,
  templateEngine,
  animationProgress = 0,
  onReplay,
  onContinueToCustomize,
  mode = 'studio'
}) => {
  // Get footer HUD configuration from template
  const footerHUD = templateEngine?.footerHUD;
  
  // Update status lines based on animation progress
  const getStatusLines = (): string[] => {
    if (!footerHUD) return [];
    
    const lines = [...footerHUD.statusLines];
    
    // Update progress-based status for cinematic mode
    if (mode === 'cinematic' && animationProgress !== undefined) {
      const progressPercentage = Math.round(animationProgress * 100);
      if (lines.length > 1) {
        lines[1] = `Animation Progress: ${progressPercentage}%`;
      }
      
      // Update final line based on completion
      if (animationProgress >= 1 && lines.length > 3) {
        lines[3] = 'Animation complete - Ready to customize';
      }
    }
    
    return footerHUD.compact ? lines.slice(0, 4) : lines;
  };

  const statusLines = getStatusLines();

  return (
    <div className="border-t border-white/10 p-4 bg-black/50">
      <div className="flex justify-between items-end gap-4">
        {/* Left side - Status lines (when template HUD is active) */}
        {footerHUD && mode === 'cinematic' && (
          <div className="flex-1 min-w-0">
            <div className="space-y-1">
              {statusLines.map((line, index) => (
                <div 
                  key={index}
                  className="text-sm text-white/80 truncate"
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Right side - Action buttons */}
        <div className="flex gap-2 flex-shrink-0">
          {/* Template-specific buttons */}
          {footerHUD && mode === 'cinematic' && (
            <>
              {footerHUD.showReplay && onReplay && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onReplay}
                  className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Replay
                </Button>
              )}
              
              {footerHUD.showContinue && onContinueToCustomize && animationProgress >= 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onContinueToCustomize}
                  className="border-crd-green/50 text-crd-green hover:bg-crd-green/10"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Continue to Customize
                </Button>
              )}
            </>
          )}
          
          {/* Standard controls */}
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
