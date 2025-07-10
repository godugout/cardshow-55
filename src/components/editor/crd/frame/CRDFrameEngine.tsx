import React, { useMemo, useState, useCallback } from 'react';
import type { CRDFrame, CRDRegion, CropResult, CropToolConfig } from '@/types/crd-frame';
import { CRDAdvancedCropper } from './CRDAdvancedCropper';

interface CRDFrameEngineProps {
  frame: CRDFrame;
  content: Record<string, any>;
  selectedVisualStyle?: string;
  onContentChange: (regionId: string, content: any) => void;
  onCropComplete: (result: CropResult) => void;
  className?: string;
}

export const CRDFrameEngine: React.FC<CRDFrameEngineProps> = ({
  frame,
  content,
  selectedVisualStyle = 'classic_matte',
  onContentChange,
  onCropComplete,
  className = ''
}) => {
  const [activeCropRegion, setActiveCropRegion] = useState<string | null>(null);
  const [cropConfig, setCropConfig] = useState<CropToolConfig | null>(null);

  // Parse frame configuration
  const frameConfig = useMemo(() => {
    return frame.frame_config;
  }, [frame.frame_config]);

  // Calculate scaled dimensions for display
  const displayDimensions = useMemo(() => {
    const maxWidth = 400;
    const maxHeight = 600;
    const { width, height } = frameConfig.dimensions;
    
    const widthRatio = maxWidth / width;
    const heightRatio = maxHeight / height;
    const scale = Math.min(widthRatio, heightRatio, 1);
    
    return {
      width: width * scale,
      height: height * scale,
      scale
    };
  }, [frameConfig.dimensions]);

  // Handle region click for photo regions
  const handleRegionClick = useCallback((region: CRDRegion) => {
    if (region.type === 'photo' && region.cropSettings?.enabled) {
      setActiveCropRegion(region.id);
      setCropConfig({
        enabled: true,
        regionId: region.id,
        aspectRatio: region.constraints.aspectRatio,
        minCropSize: region.constraints.minSize,
        allowRotation: region.cropSettings.allowRotation || false,
        allowBackgroundRemoval: region.cropSettings.allowBackgroundRemoval || false,
        cropHandles: {
          corner: true,
          edge: true,
          rotate: region.cropSettings.allowRotation || false
        },
        snapToGrid: true,
        gridSize: 10
      });
    }
  }, []);

  // Handle file upload for regions
  const handleFileUpload = useCallback((regionId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      onContentChange(regionId, { 
        type: 'image', 
        src: imageUrl, 
        originalFile: file 
      });
      
      // Auto-open crop tool for photo regions
      const region = frameConfig.regions.find(r => r.id === regionId);
      if (region?.type === 'photo' && region.cropSettings?.enabled) {
        handleRegionClick(region);
      }
    };
    reader.readAsDataURL(file);
  }, [frameConfig.regions, onContentChange, handleRegionClick]);

  // Render individual region
  const renderRegion = useCallback((region: CRDRegion) => {
    // Safety check for bounds
    if (!region.bounds) {
      console.warn('Region missing bounds:', region);
      return null;
    }
    
    const { x, y, width, height } = region.bounds;
    const { scale } = displayDimensions;
    
    const scaledBounds = {
      left: x * scale,
      top: y * scale,
      width: width * scale,
      height: height * scale
    };

    const regionContent = content[region.id];
    const hasContent = regionContent && regionContent.src;

    const regionStyle: React.CSSProperties = {
      position: 'absolute',
      ...scaledBounds,
      borderRadius: region.styling?.border?.radius || 0,
      border: region.styling?.border ? 
        `${region.styling.border.width}px ${region.styling.border.style} ${region.styling.border.color}` : 
        '2px dashed rgba(255, 255, 255, 0.4)',
      background: region.styling?.background?.value || 'transparent',
      clipPath: region.styling?.clipPath,
      cursor: region.type === 'photo' ? 'pointer' : 'default',
      overflow: 'hidden'
    };

    return (
      <div
        key={region.id}
        style={regionStyle}
        className={`
          transition-all duration-200 hover:border-white/60 
          ${region.type === 'photo' ? 'hover:bg-white/5' : ''}
          ${hasContent ? 'border-solid border-white/20' : ''}
        `}
        onClick={() => {
          if (region.type === 'photo') {
            if (hasContent) {
              handleRegionClick(region);
            } else {
              // Trigger file upload
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  handleFileUpload(region.id, file);
                }
              };
              input.click();
            }
          }
        }}
      >
        {/* Region Content */}
        {hasContent ? (
          <img
            src={regionContent.src}
            alt={regionContent.alt || region.name}
            className="w-full h-full object-cover"
            style={{
              transform: regionContent.transform || 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {region.type === 'photo' ? (
              <div className="text-center text-white/60">
                <div className="text-sm font-medium mb-1">{region.name}</div>
                <div className="text-xs opacity-75">Click to add photo</div>
              </div>
            ) : (
              <div className="text-center text-white/40">
                <div className="text-xs">{region.name}</div>
              </div>
            )}
          </div>
        )}

        {/* Crop indicator */}
        {region.type === 'photo' && hasContent && region.cropSettings?.enabled && (
          <div className="absolute top-1 right-1 bg-primary/80 text-white text-xs px-1.5 py-0.5 rounded">
            Crop
          </div>
        )}
      </div>
    );
  }, [content, displayDimensions, handleRegionClick, handleFileUpload]);

  // Render frame elements (decorative elements, text, etc.)
  const renderElements = useCallback(() => {
    return frameConfig.elements.map(element => {
      const { scale } = displayDimensions;
      
      if (!element.properties.position) return null;

      const elementStyle: React.CSSProperties = {
        position: 'absolute',
        left: element.properties.position.x * scale,
        top: element.properties.position.y * scale,
        transform: element.properties.rotation ? 
          `rotate(${element.properties.rotation}deg)` : 'none',
        opacity: element.properties.opacity || 1
      };

      switch (element.type) {
        case 'text':
          return (
            <div
              key={element.id}
              style={{
                ...elementStyle,
                fontSize: (element.properties.font?.size || 16) * scale,
                fontFamily: element.properties.font?.family || 'inherit',
                fontWeight: element.properties.font?.weight || 400,
                color: element.properties.color || '#ffffff'
              }}
            >
              {element.properties.content || element.name}
            </div>
          );
        
        case 'image':
        case 'svg':
          return (
            <img
              key={element.id}
              src={element.properties.src}
              alt={element.properties.alt || element.name}
              style={{
                ...elementStyle,
                width: element.properties.size ? element.properties.size.width * scale : 'auto',
                height: element.properties.size ? element.properties.size.height * scale : 'auto'
              }}
            />
          );
        
        default:
          return null;
      }
    });
  }, [frameConfig.elements, displayDimensions]);

  return (
    <div className={`relative ${className}`}>
      {/* Main Frame Container */}
      <div
        className="relative bg-crd-surface border border-crd-border rounded-lg overflow-hidden"
        style={{
          width: displayDimensions.width,
          height: displayDimensions.height
        }}
      >
        {/* Background */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
          }}
        />

        {/* Regions */}
        {frameConfig.regions.map(renderRegion)}

        {/* Frame Elements */}
        {renderElements()}

        {/* Visual Style Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: selectedVisualStyle === 'holographic' ? 
              'linear-gradient(45deg, rgba(255,0,128,0.1) 0%, rgba(0,255,128,0.1) 50%, rgba(0,128,255,0.1) 100%)' :
              'none',
            mixBlendMode: selectedVisualStyle === 'holographic' ? 'overlay' : 'normal'
          }}
        />
      </div>

      {/* Advanced Cropper Modal */}
      {activeCropRegion && cropConfig && (
        <CRDAdvancedCropper
          isOpen={!!activeCropRegion}
          imageUrl={content[activeCropRegion]?.src}
          config={cropConfig}
          onClose={() => {
            setActiveCropRegion(null);
            setCropConfig(null);
          }}
          onCropComplete={(result) => {
            onCropComplete(result);
            setActiveCropRegion(null);
            setCropConfig(null);
          }}
        />
      )}

      {/* Frame Info */}
      <div className="mt-2 text-center text-sm text-muted-foreground">
        <div className="font-medium">{frame.name}</div>
        <div className="text-xs opacity-75">
          {frameConfig.dimensions.width} × {frameConfig.dimensions.height}px
        </div>
      </div>
    </div>
  );
};