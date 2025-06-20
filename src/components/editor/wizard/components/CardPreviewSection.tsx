
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { AdaptiveTemplatePreview } from './AdaptiveTemplatePreview';
import { ADAPTIVE_TEMPLATES } from '@/data/adaptiveTemplates';
import type { DesignTemplate } from '@/hooks/useCardEditor';

interface CardPreviewSectionProps {
  selectedPhoto: string;
  selectedTemplate: DesignTemplate | null;
  onPhotoSelect?: (photo: string) => void;
  cardData?: {
    title?: string;
    description?: string;
    rarity?: string;
  };
}

export const CardPreviewSection = ({ 
  selectedPhoto, 
  selectedTemplate,
  onPhotoSelect,
  cardData = {}
}: CardPreviewSectionProps) => {
  const [imageFormat, setImageFormat] = useState<'square' | 'circle' | 'fullBleed'>('fullBleed');

  // Find the adaptive template that corresponds to the selected template
  const adaptiveTemplate = selectedTemplate 
    ? ADAPTIVE_TEMPLATES.find(t => t.id === selectedTemplate.id)
    : null;

  console.log('CardPreviewSection - selectedTemplate:', selectedTemplate);
  console.log('CardPreviewSection - adaptiveTemplate:', adaptiveTemplate);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && onPhotoSelect) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onPhotoSelect(result);
      };
      reader.readAsDataURL(file);
    }
  }, [onPhotoSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1,
    disabled: !onPhotoSelect
  });

  // Always show the preview container, even without a template
  const showUploadZone = !selectedPhoto && onPhotoSelect;

  // Create custom elements with user data and new logo
  const customElements = adaptiveTemplate ? adaptiveTemplate.elements.map(element => {
    if (element.type === 'nameplate') {
      return {
        ...element,
        content: cardData.title || 'Your Card Title'
      };
    }
    if (element.type === 'textOverlay') {
      return {
        ...element,
        content: cardData.description || 'Card description will appear here'
      };
    }
    if (element.type === 'logoPatch') {
      return {
        ...element,
        content: '/lovable-uploads/ffcc3926-a637-4938-a3d6-6b0b366e95d4.png' // Use the new Cardshow logo
      };
    }
    return element;
  }) : [];

  return (
    <div className="flex justify-center">
      <div className="relative transform hover:scale-105 transition-transform duration-200">
        {/* Card Preview Container - Always show */}
        <div className="relative w-80 h-112 shadow-2xl border border-crd-mediumGray/50 rounded-lg overflow-hidden">
          
          {showUploadZone ? (
            /* Upload dropzone when no photo */
            <div
              {...getRootProps()}
              className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'bg-crd-green/20 border-crd-green' 
                  : 'bg-crd-darkGray hover:bg-crd-mediumGray/40'
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-crd-mediumGray/40 rounded-full flex items-center justify-center">
                  {isDragActive ? (
                    <Upload className="w-8 h-8 text-crd-green" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-crd-lightGray" />
                  )}
                </div>
                <div className="text-white font-medium mb-2">
                  {isDragActive ? 'Drop your image here' : 'Add Your Photo'}
                </div>
                <div className="text-crd-lightGray text-sm">
                  {isDragActive ? 'Release to upload' : 'Drag & drop or click to browse'}
                </div>
              </div>
            </div>
          ) : selectedPhoto && adaptiveTemplate ? (
            /* Card preview with photo and template */
            <AdaptiveTemplatePreview
              template={adaptiveTemplate}
              selectedPhoto={selectedPhoto}
              imageFormat={imageFormat}
              customElements={customElements}
              className="w-full h-full"
            />
          ) : selectedPhoto ? (
            /* Simple photo preview when no template */
            <div className="w-full h-full relative">
              <img 
                src={selectedPhoto} 
                alt="Your uploaded photo" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 rounded-lg p-3">
                <p className="text-white font-medium">Your Photo</p>
                <p className="text-crd-lightGray text-sm">Choose a frame to style your card</p>
              </div>
            </div>
          ) : (
            /* Default state when no photo and no upload capability */
            <div className="flex items-center justify-center h-full bg-crd-mediumGray/30">
              <div className="text-center p-8">
                <ImageIcon className="w-16 h-16 text-crd-lightGray mx-auto mb-4" />
                <p className="text-crd-lightGray">Card preview will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
