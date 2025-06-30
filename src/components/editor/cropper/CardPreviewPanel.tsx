import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CropArea } from './types';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import type { DesignTemplate } from '@/types/card';

interface CardPreviewPanelProps {
  cropAreas: CropArea[];
  imageUrl: string;
  template?: DesignTemplate;
  onClose: () => void;
}

export const CardPreviewPanel: React.FC<CardPreviewPanelProps> = ({
  cropAreas,
  imageUrl,
  template,
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewZoom, setPreviewZoom] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const generatePreview = React.useCallback(async () => {
    if (!canvasRef.current) return;
    
    setIsLoading(true);
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set card dimensions (2.5" x 3.5" at 300 DPI = 750x1050px)
      const cardWidth = 300;
      const cardHeight = 420;
      canvas.width = cardWidth;
      canvas.height = cardHeight;

      // Clear canvas with card background
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, cardWidth, cardHeight);
      
      // Draw card border
      ctx.strokeStyle = '#e9ecef';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, cardWidth, cardHeight);

      // Load and process source image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      // Draw crops on the card
      const mainCrop = cropAreas.find(crop => crop.type === 'main');
      if (mainCrop && mainCrop.visible !== false) {
        // Calculate scale factors
        const scaleX = img.naturalWidth / img.clientWidth;
        const scaleY = img.naturalHeight / img.clientHeight;
        
        // Source coordinates
        const sourceX = mainCrop.x * scaleX;
        const sourceY = mainCrop.y * scaleY;
        const sourceWidth = mainCrop.width * scaleX;
        const sourceHeight = mainCrop.height * scaleY;
        
        // Destination coordinates (main photo area)
        const destX = 15;
        const destY = 50;
        const destWidth = cardWidth - 30;
        const destHeight = cardHeight - 100;
        
        ctx.save();
        if (mainCrop.rotation !== 0) {
          ctx.translate(destX + destWidth / 2, destY + destHeight / 2);
          ctx.rotate((mainCrop.rotation * Math.PI) / 180);
          ctx.translate(-destWidth / 2, -destHeight / 2);
          ctx.drawImage(
            img,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, destWidth, destHeight
          );
        } else {
          ctx.drawImage(
            img,
            sourceX, sourceY, sourceWidth, sourceHeight,
            destX, destY, destWidth, destHeight
          );
        }
        ctx.restore();
      }

      // Draw other crop elements
      cropAreas.filter(crop => crop.type !== 'main' && crop.visible !== false).forEach((crop, index) => {
        const scaleX = img.naturalWidth / img.clientWidth;
        const scaleY = img.naturalHeight / img.clientHeight;
        
        const sourceX = crop.x * scaleX;
        const sourceY = crop.y * scaleY;
        const sourceWidth = crop.width * scaleX;
        const sourceHeight = crop.height * scaleY;
        
        // Position elements on card
        let destX, destY, destWidth, destHeight;
        
        if (crop.type === 'frame') {
          // Frame elements go in corners or edges
          destX = index % 2 === 0 ? 10 : cardWidth - 60;
          destY = 10;
          destWidth = 50;
          destHeight = 50;
        } else {
          // Other elements positioned relatively
          destX = 20 + (index * 60);
          destY = cardHeight - 80;
          destWidth = 50;
          destHeight = 50;
        }
        
        ctx.save();
        if (crop.rotation !== 0) {
          ctx.translate(destX + destWidth / 2, destY + destHeight / 2);
          ctx.rotate((crop.rotation * Math.PI) / 180);
          ctx.translate(-destWidth / 2, -destHeight / 2);
          ctx.drawImage(
            img,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, destWidth, destHeight
          );
        } else {
          ctx.drawImage(
            img,
            sourceX, sourceY, sourceWidth, sourceHeight,
            destX, destY, destWidth, destHeight
          );
        }
        ctx.restore();
      });

      // Add template frame overlay if available
      if (template) {
        ctx.strokeStyle = template.template_data?.colors?.primary || '#1a472a';
        ctx.lineWidth = 3;
        ctx.strokeRect(5, 5, cardWidth - 10, cardHeight - 10);
        
        // Add template name
        ctx.fillStyle = template.template_data?.colors?.primary || '#1a472a';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(template.name, 15, cardHeight - 15);
      }
      
    } catch (error) {
      console.error('Preview generation failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [cropAreas, imageUrl, template]);

  useEffect(() => {
    generatePreview();
  }, [generatePreview]);

  return (
    <div className="w-96 bg-crd-darker border-l border-crd-mediumGray/30 flex flex-col">
      <CardHeader className="p-4 border-b border-crd-mediumGray/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg">Card Preview</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-crd-lightGray hover:text-white hover:bg-crd-mediumGray/20 p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        {template && (
          <p className="text-crd-lightGray text-sm">{template.name}</p>
        )}
      </CardHeader>

      <CardContent className="flex-1 p-4 flex flex-col">
        {/* Preview Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewZoom(Math.max(0.5, previewZoom - 0.25))}
              disabled={previewZoom <= 0.5}
              className="bg-crd-darkGray border-crd-mediumGray text-white hover:bg-crd-mediumGray p-2"
            >
              <ZoomOut className="w-3 h-3" />
            </Button>
            
            <span className="text-white text-sm min-w-[50px] text-center">
              {Math.round(previewZoom * 100)}%
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewZoom(Math.min(2, previewZoom + 0.25))}
              disabled={previewZoom >= 2}
              className="bg-crd-darkGray border-crd-mediumGray text-white hover:bg-crd-mediumGray p-2"
            >
              <ZoomIn className="w-3 h-3" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={generatePreview}
            disabled={isLoading}
            className="bg-crd-darkGray border-crd-mediumGray text-white hover:bg-crd-mediumGray"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Refresh
          </Button>
        </div>

        {/* Canvas Preview */}
        <div className="flex-1 flex items-center justify-center bg-crd-darkGray/30 rounded-lg p-4 overflow-hidden">
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full rounded shadow-lg border border-crd-mediumGray/30"
              style={{ 
                transform: `scale(${previewZoom})`,
                transformOrigin: 'center'
              }}
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Preview Info */}
        <div className="mt-4 p-3 bg-crd-darkGray/50 rounded-lg">
          <h4 className="text-white font-medium text-sm mb-2">Preview Info</h4>
          <ul className="text-crd-lightGray text-xs space-y-1">
            <li>• Card Size: 2.5" × 3.5"</li>
            <li>• Layers: {cropAreas.filter(c => c.visible !== false).length} visible</li>
            <li>• Updates automatically</li>
            <li>• Click Refresh to update</li>
          </ul>
        </div>
      </CardContent>
    </div>
  );
};
