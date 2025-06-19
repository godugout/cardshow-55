
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
              border: `${element.style.borderWidth || 1}px solid ${element.style.borderColor || '#000'}`,
              boxShadow: element.style.shadow
            }}
            className="pointer-events-none"
          />
        );
      
      case 'imageZone':
        return (
          <div
            key={element.id}
            style={style}
            className="pointer-events-none overflow-hidden flex items-center justify-center"
          >
            {selectedPhoto ? (
              <img
                src={selectedPhoto}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center">
                <span className="text-xs text-gray-500">Image</span>
              </div>
            )}
          </div>
        );
      
      case 'nameplate':
      case 'textOverlay':
        return (
          <div
            key={element.id}
            style={style}
            className="pointer-events-none flex items-center justify-center text-center"
          >
            <span style={{
              fontSize: `${element.style.fontSize}px`,
              fontWeight: element.style.fontWeight,
              color: element.style.color,
              fontFamily: element.style.fontFamily
            }}>
              {element.content || 'TEXT'}
            </span>
          </div>
        );
      
      case 'logoPatch':
        return (
          <div
            key={element.id}
            style={style}
            className="pointer-events-none bg-gray-300 rounded-full flex items-center justify-center"
          >
            <span className="text-xs text-gray-600">LOGO</span>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div 
      className={`relative aspect-[2.5/3.5] rounded-lg overflow-hidden ${className}`}
      style={{ backgroundColor: '#f5f5f5' }}
    >
      {template.elements
        .sort((a, b) => a.layer - b.layer)
        .map(renderElement)}
      
      {/* Aesthetic indicator */}
      <div className="absolute top-1 right-1 px-2 py-1 bg-black/70 text-white text-xs rounded">
        {template.aesthetic}
      </div>
    </div>
  );
};
