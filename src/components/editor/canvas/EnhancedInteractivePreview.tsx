
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2, Edit3, Maximize, RotateCcw, Eye, Camera } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { ModularTemplatePreview } from '../wizard/components/ModularTemplatePreview';
import { MODULAR_TEMPLATES } from '@/data/modularTemplates';
import type { useCardEditor } from '@/hooks/useCardEditor';

interface EnhancedInteractivePreviewProps {
  title: string;
  description: string;
  cardEditor?: ReturnType<typeof useCardEditor>;
  onElementSelect?: (elementId: string | null) => void;
  selectedElement?: string | null;
  currentPhoto?: string;
  cardState?: any;
}

export const EnhancedInteractivePreview = ({ 
  title, 
  description, 
  cardEditor,
  onElementSelect,
  selectedElement,
  currentPhoto
}: EnhancedInteractivePreviewProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const cardFrontRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedModularTemplate, setSelectedModularTemplate] = useState<any>(null);

  useEffect(() => {
    // Get selected template from wizard state or card editor
    const templateId = cardEditor?.cardData?.template_id;
    if (templateId) {
      // Find template data from MODULAR_TEMPLATES
      const template = MODULAR_TEMPLATES.find(t => t.id === templateId);
      setSelectedModularTemplate(template);
    }
  }, [cardEditor?.cardData?.template_id]);

  const addWatermarkToCanvas = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    // Add CRD text watermark in upper right corner
    const margin = 10;
    
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = '#10B981'; // CRD green color
    
    const fontSize = Math.max(Math.min(canvas.width * 0.05, 24), 12);
    
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText('CRD', canvas.width - margin, margin);
    ctx.restore();

    return canvas;
  };

  const handleExportCard = async () => {
    if (!cardFrontRef.current) {
      toast.error('Card not ready for export');
      return;
    }
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardFrontRef.current, {
        backgroundColor: 'transparent',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        removeContainer: true
      });
      
      const watermarkedCanvas = addWatermarkToCanvas(canvas);
      
      const link = document.createElement('a');
      link.download = `${cardEditor?.cardData.title || 'card'}.png`;
      link.href = watermarkedCanvas.toDataURL('image/png', 1.0);
      link.click();
      
      toast.success('Card exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export card');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePhotoUpload = () => {
    window.dispatchEvent(new CustomEvent('photoAction', { 
      detail: { action: 'upload' } 
    }));
  };

  const renderCard = () => {
    const photoUrl = currentPhoto || cardEditor?.cardData.image_url;
    const cardTitle = cardEditor?.cardData.title || title || 'Card Title';
    
    if (!selectedModularTemplate) {
      return (
        <div 
          ref={cardFrontRef}
          className="w-80 h-112 bg-white rounded-lg shadow-lg border-2 border-gray-200 flex items-center justify-center"
          data-card-front="true"
        >
          <div className="text-center p-4">
            <div className="text-gray-400 mb-2">No template selected</div>
            <div className="text-sm text-gray-500">Choose a template to see your card preview</div>
          </div>
        </div>
      );
    }

    // Create custom elements with user data
    const customElements = selectedModularTemplate.elements.map((element: any) => {
      if (element.type === 'nameplate' || element.type === 'textOverlay') {
        return {
          ...element,
          content: element.type === 'nameplate' ? cardTitle : (cardEditor?.cardData.description || 'Card description')
        };
      }
      return element;
    });

    return (
      <div 
        ref={cardFrontRef}
        className="transform scale-75 origin-center"
        data-card-front="true"
      >
        <ModularTemplatePreview
          template={selectedModularTemplate}
          selectedPhoto={photoUrl}
          customElements={customElements}
          className="w-80 h-112 shadow-2xl"
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      {/* Card Preview */}
      <div className="flex flex-col items-center space-y-4">
        <div ref={cardRef} className="transform hover:scale-105 transition-transform duration-200">
          {renderCard()}
        </div>
        
        {/* Quick info */}
        <div className="text-center">
          <h3 className="text-white font-medium">{cardEditor?.cardData.title || 'Preview Mode'}</h3>
          <p className="text-crd-lightGray text-sm">
            {selectedModularTemplate ? `${selectedModularTemplate.name} Template` : 'Select a template to begin'}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 flex-wrap justify-center">
        <Button
          onClick={handlePhotoUpload}
          variant="outline"
          className="border-editor-border text-white hover:bg-editor-border"
        >
          <Camera className="w-4 h-4 mr-2" />
          {currentPhoto || cardEditor?.cardData.image_url ? 'Change Photo' : 'Add Photo'}
        </Button>
        
        <Button
          onClick={() => window.dispatchEvent(new CustomEvent('switchToCanvas'))}
          variant="outline"
          className="border-editor-border text-white hover:bg-editor-border"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Edit Details
        </Button>
        
        <Button
          onClick={handleExportCard}
          disabled={isExporting}
          className="bg-crd-green hover:bg-crd-green/90 text-black"
        >
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export Card'}
        </Button>
      </div>

      {/* Help text */}
      <div className="text-center text-crd-lightGray text-xs max-w-md">
        <p>
          Your card preview will update as you upload photos and select templates. 
          Click elements to edit them or use the sidebar tools for more options.
        </p>
      </div>
    </div>
  );
};
