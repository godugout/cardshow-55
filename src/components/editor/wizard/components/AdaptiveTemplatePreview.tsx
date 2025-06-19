
import React from 'react';
import type { AdaptiveTemplate, AdaptiveCardPreviewProps } from '@/types/adaptiveTemplate';

export const AdaptiveTemplatePreview = ({ 
  template, 
  selectedPhoto, 
  imageFormat = 'fullBleed',
  customElements = [],
  className = ""
}: AdaptiveCardPreviewProps) => {
  const adaptiveLayout = template.adaptiveLayout[imageFormat === 'circle' ? 'square' : imageFormat];
  
  const getImageStyle = () => {
    const basePosition = adaptiveLayout.imagePosition;
    const style: React.CSSProperties = {
      position: 'absolute',
      left: `${basePosition.x}%`,
      top: `${basePosition.y}%`,
      width: `${basePosition.width}%`,
      height: `${basePosition.height}%`,
      borderRadius: imageFormat === 'circle' ? '50%' : `${basePosition.width < 100 ? 8 : 12}px`,
      overflow: 'hidden',
      objectFit: 'cover'
    };

    // For circle format, ensure square aspect ratio
    if (imageFormat === 'circle') {
      const size = Math.min(basePosition.width, basePosition.height);
      style.width = `${size}%`;
      style.height = `${size}%`;
      style.left = `${basePosition.x + (basePosition.width - size) / 2}%`;
      style.top = `${basePosition.y + (basePosition.height - size) / 2}%`;
    }

    return style;
  };

  const renderInfoZones = () => {
    return adaptiveLayout.infoZones.map((zone) => {
      const element = template.elements.find(e => 
        e.type === 'nameplate' && zone.type === 'title' ||
        e.type === 'logoPatch' && zone.type === 'logo' ||
        e.type === 'textOverlay' && (zone.type === 'stats' || zone.type === 'subtitle')
      );

      if (!element) return null;

      const customElement = customElements.find(ce => ce.id === element.id);
      const mergedElement = customElement ? { ...element, ...customElement } : element;

      const style: React.CSSProperties = {
        position: 'absolute',
        left: `${zone.position.x}%`,
        top: `${zone.position.y}%`,
        width: `${zone.position.width}%`,
        height: `${zone.position.height}%`,
        zIndex: mergedElement.layer,
        ...mergedElement.style
      };

      switch (element.type) {
        case 'nameplate':
        case 'textOverlay':
          return (
            <div
              key={zone.id}
              style={{
                ...style,
                backgroundColor: mergedElement.style.backgroundColor,
                borderRadius: `${mergedElement.style.borderRadius || 4}px`,
              }}
              className="flex items-center justify-center text-center px-1"
            >
              <span style={{
                fontSize: `${Math.max((mergedElement.style.fontSize || 12) * 0.7, 8)}px`,
                fontWeight: mergedElement.style.fontWeight,
                color: mergedElement.style.color,
                fontFamily: mergedElement.style.fontFamily
              }}>
                {mergedElement.content || (element.type === 'nameplate' ? 'TITLE' : 'INFO')}
              </span>
            </div>
          );
        
        case 'logoPatch':
          return (
            <div
              key={zone.id}
              style={{
                ...style,
                backgroundColor: mergedElement.style.backgroundColor || 'rgba(16, 185, 129, 0.9)',
                borderRadius: `${mergedElement.style.borderRadius || 50}%`
              }}
              className="flex items-center justify-center"
            >
              <span className="text-xs font-bold" style={{ color: mergedElement.style.color || '#000000' }}>
                {mergedElement.content || 'CRD'}
              </span>
            </div>
          );
        
        default:
          return null;
      }
    });
  };

  const backgroundElement = template.elements.find(e => e.type === 'background');
  const templateBackground = backgroundElement?.style?.backgroundColor || template.colorSchemes[0]?.background || '#1a1a1a';

  return (
    <div 
      className={`relative aspect-[2.5/3.5] rounded-lg overflow-hidden shadow-lg ${className}`}
      style={{ 
        background: templateBackground,
        minHeight: '140px'
      }}
    >
      {/* Background elements (frames, etc.) */}
      {template.elements
        .filter(e => e.type === 'frame')
        .map(element => (
          <div
            key={element.id}
            style={{
              position: 'absolute',
              left: `${element.position.x}%`,
              top: `${element.position.y}%`,
              width: `${element.position.width}%`,
              height: `${element.position.height}%`,
              backgroundColor: 'transparent',
              border: `${element.style.borderWidth || 2}px solid ${element.style.borderColor || '#333'}`,
              borderRadius: `${element.style.borderRadius || 8}px`,
              boxShadow: element.style.shadow,
              zIndex: element.layer
            }}
            className="pointer-events-none"
          />
        ))}

      {/* Adaptive Image */}
      <div style={getImageStyle()}>
        {selectedPhoto ? (
          <img
            src={selectedPhoto}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-white/60 text-xs border border-dashed border-white/30"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          >
            {imageFormat === 'circle' ? 'CIRCLE' : 'IMAGE'}
          </div>
        )}
      </div>

      {/* Adaptive Info Zones */}
      {renderInfoZones()}
      
      {/* Format indicator */}
      <div className="absolute top-1 right-1 px-2 py-1 text-white text-xs rounded font-medium bg-black/50">
        {imageFormat.toUpperCase()}
      </div>
    </div>
  );
};
