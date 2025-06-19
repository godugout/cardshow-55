
import React from 'react';
import type { ModularTemplate, CardElement } from '@/types/modularTemplate';

interface ModularTemplatePreviewProps {
  template: ModularTemplate;
  selectedPhoto?: string;
  customElements?: Partial<CardElement>[];
  className?: string;
}

export const ModularTemplatePreview = ({ 
  template, 
  selectedPhoto, 
  customElements = [],
  className = ""
}: ModularTemplatePreviewProps) => {
  const renderElement = (element: CardElement) => {
    const customElement = customElements.find(ce => ce.id === element.id);
    const mergedElement = customElement ? { ...element, ...customElement } : element;
    
    const style: React.CSSProperties = {
      position: 'absolute',
      left: `${mergedElement.position.x}%`,
      top: `${mergedElement.position.y}%`,
      width: `${mergedElement.position.width}%`,
      height: `${mergedElement.position.height}%`,
      zIndex: mergedElement.layer,
      transform: mergedElement.position.rotation 
        ? `rotate(${mergedElement.position.rotation}deg)` 
        : undefined,
      ...mergedElement.style
    };

    switch (element.type) {
      case 'background':
        return (
          <div
            key={element.id}
            style={style}
            className="pointer-events-none"
          />
        );
      
      case 'frame':
        return (
          <div
            key={element.id}
            style={{
              ...style,
              backgroundColor: 'transparent',
              border: `${element.style.borderWidth || 2}px solid ${element.style.borderColor || '#333'}`,
              borderRadius: `${element.style.borderRadius || 8}px`,
              boxShadow: element.style.shadow
            }}
            className="pointer-events-none"
          />
        );
      
      case 'imageZone':
        return (
          <div
            key={element.id}
            style={{
              ...style,
              borderRadius: `${element.style.borderRadius || 4}px`,
              overflow: 'hidden'
            }}
            className="pointer-events-none flex items-center justify-center"
          >
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
                IMAGE
              </div>
            )}
          </div>
        );
      
      case 'nameplate':
      case 'textOverlay':
        return (
          <div
            key={element.id}
            style={{
              ...style,
              backgroundColor: element.style.backgroundColor,
              borderRadius: `${element.style.borderRadius || 4}px`,
              border: element.style.borderWidth 
                ? `${element.style.borderWidth}px solid ${element.style.borderColor}`
                : undefined
            }}
            className="pointer-events-none flex items-center justify-center text-center px-1"
          >
            <span style={{
              fontSize: `${Math.max((element.style.fontSize || 12) * 0.7, 8)}px`,
              fontWeight: element.style.fontWeight,
              color: element.style.color,
              fontFamily: element.style.fontFamily
            }}>
              {element.content || (element.type === 'nameplate' ? 'NAME' : 'TEXT')}
            </span>
          </div>
        );
      
      case 'logoPatch':
        return (
          <div
            key={element.id}
            style={{
              ...style,
              backgroundColor: element.style.backgroundColor || 'rgba(255,255,255,0.2)',
              borderRadius: `${element.style.borderRadius || 50}%`
            }}
            className="pointer-events-none flex items-center justify-center"
          >
            <span className="text-xs text-white/60 font-bold">LOGO</span>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Get the actual background from the template
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
      {template.elements
        .sort((a, b) => a.layer - b.layer)
        .map(renderElement)}
      
      {/* Aesthetic indicator with proper color coding */}
      <div className={`absolute top-1 right-1 px-2 py-1 text-white text-xs rounded font-medium ${getAestheticColor(template.aesthetic)}`}>
        {getAestheticDisplayName(template.aesthetic)}
      </div>
    </div>
  );
};

const getAestheticColor = (aesthetic: string): string => {
  const colors = {
    'minimal-grid': 'bg-gray-600',
    'cinematic': 'bg-red-600',
    'neon-cyber': 'bg-cyan-500',
    'vintage': 'bg-amber-600',
    'magazine': 'bg-blue-600',
    'polaroid': 'bg-yellow-600',
    'comic': 'bg-purple-600',
    'holographic': 'bg-pink-500'
  };
  return colors[aesthetic as keyof typeof colors] || 'bg-gray-500';
};

const getAestheticDisplayName = (aesthetic: string): string => {
  const names = {
    'minimal-grid': 'Minimal',
    'cinematic': 'Cinema',
    'neon-cyber': 'Cyber',
    'vintage': 'Vintage',
    'magazine': 'Editorial',
    'polaroid': 'Instant',
    'comic': 'Comic',
    'holographic': 'Holo'
  };
  return names[aesthetic as keyof typeof names] || aesthetic;
};
