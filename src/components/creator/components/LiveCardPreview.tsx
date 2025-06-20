
import React from 'react';
import { Card } from '@/components/ui/card';

interface LiveCardPreviewProps {
  photo?: string;
  style?: string;
  mode: 'quick' | 'template' | 'canvas' | 'professional';
}

export const LiveCardPreview = ({ photo, style, mode }: LiveCardPreviewProps) => {
  
  const getStyleEffects = (styleId?: string) => {
    switch (styleId) {
      case 'minimal-clean':
        return {
          border: '2px solid #e5e5e5',
          borderRadius: '8px',
          background: 'linear-gradient(145deg, #f8f9fa, #ffffff)'
        };
      case 'classic-frame':
        return {
          border: '4px solid #d4af37',
          borderRadius: '12px',
          background: 'linear-gradient(145deg, #faf5e6, #f5e6d3)'
        };
      case 'modern-gradient':
        return {
          border: 'none',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        };
      case 'holographic':
        return {
          border: '2px solid transparent',
          borderRadius: '12px',
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
          animation: 'holographic 3s ease-in-out infinite'
        };
      case 'vintage':
        return {
          border: '3px solid #8b4513',
          borderRadius: '6px',
          background: 'linear-gradient(145deg, #f4e4bc, #ddbf94)',
          filter: 'sepia(0.3)'
        };
      case 'neon':
        return {
          border: '2px solid #00ffff',
          borderRadius: '8px',
          background: 'linear-gradient(145deg, #1a1a2e, #16213e)',
          boxShadow: '0 0 20px #00ffff'
        };
      default:
        return {
          border: '1px solid #333',
          borderRadius: '8px',
          background: '#1a1a1a'
        };
    }
  };

  const styleEffects = getStyleEffects(style);

  return (
    <div className="flex flex-col h-full">
      {/* Preview Card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div 
          className="w-48 h-64 relative overflow-hidden transition-all duration-300"
          style={styleEffects}
        >
          {photo ? (
            <img
              src={photo}
              alt="Card preview"
              className="w-full h-full object-cover"
              style={{
                filter: style === 'vintage' ? 'sepia(0.3)' : 
                        style === 'neon' ? 'hue-rotate(45deg) saturate(1.5)' : 'none'
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-crd-mediumGray/20">
              <div className="text-center text-crd-mediumGray">
                <div className="w-12 h-12 mx-auto mb-2 opacity-50">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs">Upload photo</p>
              </div>
            </div>
          )}
          
          {/* Style overlay effects */}
          {style === 'holographic' && photo && (
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent pointer-events-none" />
          )}
          
          {style === 'neon' && photo && (
            <div className="absolute inset-0 bg-cyan-500/10 pointer-events-none" />
          )}
        </div>
      </div>
      
      {/* Preview Info */}
      <div className="p-4 border-t border-crd-mediumGray/20">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-crd-lightGray">Mode:</span>
            <span className="text-sm text-white capitalize">{mode}</span>
          </div>
          
          {style && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-crd-lightGray">Style:</span>
              <span className="text-sm text-white">
                {style.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-crd-lightGray">Status:</span>
            <span className={`text-sm ${photo ? 'text-crd-green' : 'text-crd-mediumGray'}`}>
              {photo ? 'Ready' : 'Waiting for photo'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
