
import React, { useRef, useEffect, forwardRef } from 'react';
import type { DesignTemplate } from '@/hooks/useCardEditor';

interface Canvas2DPreviewProps {
  selectedPhoto: string;
  selectedTemplate: DesignTemplate;
  effects: any;
  className?: string;
}

export const Canvas2DPreview = forwardRef<HTMLCanvasElement, Canvas2DPreviewProps>(
  ({ selectedPhoto, selectedTemplate, effects, className }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas || !selectedPhoto) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      const cardWidth = 400;
      const cardHeight = 560;
      canvas.width = cardWidth;
      canvas.height = cardHeight;

      // Load and draw image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Clear canvas
        ctx.clearRect(0, 0, cardWidth, cardHeight);
        
        // Draw background
        ctx.fillStyle = selectedTemplate.template_data?.colors?.background || '#1a1a1a';
        ctx.fillRect(0, 0, cardWidth, cardHeight);
        
        // Apply material effects
        if (effects.material.type === 'chrome') {
          const gradient = ctx.createLinearGradient(0, 0, cardWidth, cardHeight);
          gradient.addColorStop(0, 'rgba(200, 200, 200, 0.3)');
          gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)');
          gradient.addColorStop(1, 'rgba(200, 200, 200, 0.3)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, cardWidth, cardHeight);
        }
        
        // Draw main image
        const imgX = 20;
        const imgY = 60;
        const imgWidth = cardWidth - 40;
        const imgHeight = 280;
        
        ctx.save();
        
        // Apply color adjustments
        ctx.filter = `
          saturate(${100 + effects.color.saturation}%) 
          contrast(${100 + effects.color.contrast}%) 
          brightness(${100 + effects.color.brightness}%) 
          hue-rotate(${effects.color.hue}deg)
        `;
        
        ctx.globalAlpha = effects.material.opacity;
        ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
        ctx.restore();
        
        // Draw template elements
        // Title area
        ctx.fillStyle = selectedTemplate.template_data?.colors?.primary || '#00C851';
        ctx.fillRect(20, 20, cardWidth - 40, 30);
        
        // Title text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('CARD TITLE', cardWidth / 2, 40);
        
        // Stats area
        ctx.fillStyle = selectedTemplate.template_data?.colors?.accent || '#333333';
        ctx.fillRect(20, cardHeight - 40, cardWidth - 40, 30);
        
        // Apply surface effects
        if (effects.surface.holographic.enabled) {
          drawHolographicEffect(ctx, cardWidth, cardHeight, effects.surface.holographic.intensity);
        }
        
        if (effects.surface.foil.enabled) {
          drawFoilEffect(ctx, cardWidth, cardHeight, effects.surface.foil);
        }
        
        // Apply material overlay
        if (effects.material.clearcoat > 0) {
          const clearcoatGradient = ctx.createRadialGradient(
            cardWidth / 2, cardHeight / 2, 0,
            cardWidth / 2, cardHeight / 2, Math.max(cardWidth, cardHeight) / 2
          );
          clearcoatGradient.addColorStop(0, `rgba(255, 255, 255, ${effects.material.clearcoat * 0.2})`);
          clearcoatGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = clearcoatGradient;
          ctx.fillRect(0, 0, cardWidth, cardHeight);
        }
      };
      
      img.src = selectedPhoto;
      imageRef.current = img;
    }, [selectedPhoto, selectedTemplate, effects]);

    const drawHolographicEffect = (
      ctx: CanvasRenderingContext2D, 
      width: number, 
      height: number, 
      intensity: number
    ) => {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      const alpha = intensity / 100 * 0.3;
      
      gradient.addColorStop(0, `rgba(255, 0, 128, ${alpha})`);
      gradient.addColorStop(0.2, `rgba(0, 255, 255, ${alpha})`);
      gradient.addColorStop(0.4, `rgba(255, 255, 0, ${alpha})`);
      gradient.addColorStop(0.6, `rgba(128, 0, 255, ${alpha})`);
      gradient.addColorStop(0.8, `rgba(255, 128, 0, ${alpha})`);
      gradient.addColorStop(1, `rgba(0, 255, 128, ${alpha})`);
      
      ctx.fillStyle = gradient;
      ctx.globalCompositeOperation = 'screen';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';
    };

    const drawFoilEffect = (
      ctx: CanvasRenderingContext2D, 
      width: number, 
      height: number, 
      foil: { type: string; intensity: number }
    ) => {
      const foilColors = {
        silver: 'rgba(192, 192, 192, ',
        gold: 'rgba(255, 215, 0, ',
        copper: 'rgba(184, 115, 51, ',
        rainbow: 'rgba(255, 255, 255, '
      };
      
      const baseColor = foilColors[foil.type as keyof typeof foilColors] || foilColors.silver;
      const alpha = foil.intensity / 100 * 0.4;
      
      // Create metallic texture pattern
      for (let i = 0; i < width; i += 20) {
        for (let j = 0; j < height; j += 20) {
          const opacity = Math.random() * alpha;
          ctx.fillStyle = baseColor + opacity + ')';
          ctx.fillRect(i, j, 10, 10);
        }
      }
    };

    return (
      <canvas
        ref={(node) => {
          canvasRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={className}
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          borderRadius: '8px'
        }}
      />
    );
  }
);

Canvas2DPreview.displayName = 'Canvas2DPreview';
