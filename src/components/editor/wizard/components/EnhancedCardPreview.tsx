
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw, FileImage } from 'lucide-react';
import type { DesignTemplate } from '@/hooks/useCardEditor';

interface EnhancedCardPreviewProps {
  selectedPhoto: string | null;
  selectedTemplate: DesignTemplate | null;
  cardData?: {
    title?: string;
    description?: string;
    rarity?: string;
  };
}

export const EnhancedCardPreview = ({
  selectedPhoto,
  selectedTemplate,
  cardData
}: EnhancedCardPreviewProps) => {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.6));
  const handleResetZoom = () => setZoom(1);

  const renderCardPreview = () => {
    if (!selectedTemplate) {
      return (
        <div className="w-full h-96 bg-crd-mediumGray/20 rounded-lg flex items-center justify-center">
          <div className="text-center space-y-2">
            <FileImage className="w-12 h-12 text-crd-lightGray mx-auto" />
            <p className="text-crd-lightGray">Select a frame to see your card preview</p>
          </div>
        </div>
      );
    }

    const isGraded = selectedTemplate.id.includes('graded-slab');
    const is3D = selectedTemplate.id.includes('3d');

    return (
      <div 
        className="relative mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
        style={{ 
          width: `${240 * zoom}px`,
          height: `${336 * zoom}px`, // 2.5:3.5 aspect ratio
          transform: is3D ? 'perspective(1000px) rotateY(-5deg) rotateX(2deg)' : 'none'
        }}
      >
        {/* Graded slab case overlay */}
        {isGraded && (
          <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-200 border-2 border-gray-300 rounded-lg">
            {/* Grade label */}
            <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded text-xs font-bold">
              CRD
            </div>
            <div className="absolute top-2 right-2 bg-crd-green text-black px-2 py-1 rounded text-xs font-bold">
              {cardData?.rarity === 'legendary' ? '10' : cardData?.rarity === 'rare' ? '9' : '8'}
            </div>
            {/* Inner card area */}
            <div className="absolute inset-4 bg-white rounded border shadow-inner">
              {selectedPhoto && (
                <img
                  src={selectedPhoto}
                  alt="Card preview"
                  className="w-full h-3/4 object-cover rounded-t"
                />
              )}
              {cardData?.title && (
                <div className="p-2">
                  <p className="text-xs font-bold text-center truncate">{cardData.title}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Regular card layout */}
        {!isGraded && (
          <>
            {selectedPhoto && (
              <img
                src={selectedPhoto}
                alt="Card preview"
                className={`w-full ${selectedTemplate.id === 'full-bleed' ? 'h-full' : 'h-3/4'} object-cover`}
              />
            )}
            {selectedTemplate.id !== 'full-bleed' && cardData?.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-2">
                <p className="text-sm font-bold text-center truncate">{cardData.title}</p>
              </div>
            )}
          </>
        )}

        {/* Template-specific styling */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: selectedTemplate.template_data?.colors?.background !== 'transparent' 
              ? selectedTemplate.template_data?.colors?.background 
              : undefined,
            borderRadius: `${selectedTemplate.template_data?.effects?.borderRadius || 8}px`
          }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Preview Area */}
      <Card className="bg-crd-darkGray border-crd-mediumGray/30">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header with zoom controls */}
            <div className="flex items-center justify-between">
              <h2 className="text-white font-medium">Card Preview</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.6}
                  className="text-crd-lightGray hover:text-white"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-crd-lightGray text-sm min-w-[3rem] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoom >= 2}
                  className="text-crd-lightGray hover:text-white"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetZoom}
                  className="text-crd-lightGray hover:text-white"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Card Preview */}
            <div className="flex justify-center bg-gradient-to-br from-crd-mediumGray/20 to-crd-mediumGray/40 rounded-lg p-8 min-h-[400px] items-center">
              {renderCardPreview()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Details */}
      {(cardData?.title || cardData?.description || selectedTemplate) && (
        <Card className="bg-crd-darkGray border-crd-mediumGray/30">
          <CardContent className="p-6">
            <h3 className="text-white font-medium mb-4">Card Details</h3>
            <div className="space-y-3">
              {cardData?.title && (
                <div>
                  <label className="text-crd-lightGray text-sm">Title</label>
                  <p className="text-white">{cardData.title}</p>
                </div>
              )}
              {cardData?.description && (
                <div>
                  <label className="text-crd-lightGray text-sm">Description</label>
                  <p className="text-white text-sm">{cardData.description}</p>
                </div>
              )}
              {selectedTemplate && (
                <div>
                  <label className="text-crd-lightGray text-sm">Frame</label>
                  <p className="text-white">{selectedTemplate.name}</p>
                  <p className="text-crd-lightGray text-xs">{selectedTemplate.description}</p>
                </div>
              )}
              {cardData?.rarity && (
                <div>
                  <label className="text-crd-lightGray text-sm">Rarity</label>
                  <p className="text-white capitalize">{cardData.rarity}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
