
import React, { useState } from 'react';
import { SVGTemplateRenderer } from '@/components/editor/templates/SVGTemplateRenderer';
import { CRDButton } from '@/components/ui/design-system/Button';
import { useTemplates } from '@/hooks/useTemplates';
import { ChevronLeft, ChevronRight, Grid, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { DesignTemplate } from '@/types/card';

interface CardPreviewRendererProps {
  imageUrl: string;
  template: DesignTemplate;
  onTemplateChange?: (template: DesignTemplate) => void;
  className?: string;
  enableFrameSwitching?: boolean;
  size?: 'default' | 'large';
}

export const CardPreviewRenderer: React.FC<CardPreviewRendererProps> = ({
  imageUrl,
  template,
  onTemplateChange,
  className = "",
  enableFrameSwitching = false,
  size = 'default'
}) => {
  const { templates } = useTemplates();
  const [showFrameControls, setShowFrameControls] = useState(enableFrameSwitching);
  
  const currentTemplateIndex = templates.findIndex(t => t.id === template.id);
  
  const switchToNextTemplate = () => {
    if (templates.length === 0) return;
    const nextIndex = (currentTemplateIndex + 1) % templates.length;
    const nextTemplate = templates[nextIndex];
    onTemplateChange?.(nextTemplate);
  };
  
  const switchToPrevTemplate = () => {
    if (templates.length === 0) return;
    const prevIndex = currentTemplateIndex === 0 ? templates.length - 1 : currentTemplateIndex - 1;
    const prevTemplate = templates[prevIndex];
    onTemplateChange?.(prevTemplate);
  };

  const sizeClasses = size === 'large' ? 'w-full max-w-md' : 'w-full max-w-xs';

  return (
    <div className={`relative ${className}`}>
      <div className={`${sizeClasses} mx-auto`}>
        <div className="aspect-[5/7] bg-white rounded-lg overflow-hidden shadow-xl border border-crd-mediumGray/20 relative group">
          <SVGTemplateRenderer
            template={template}
            imageUrl={imageUrl}
            className="w-full h-full"
          />
          
          {/* Frame Controls Toggle */}
          {enableFrameSwitching && (
            <div className="absolute top-2 left-2">
              <CRDButton
                variant="ghost"
                size="sm"
                onClick={() => setShowFrameControls(!showFrameControls)}
                className="bg-crd-darkest/80 backdrop-blur-sm border border-crd-mediumGray/30"
              >
                {showFrameControls ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </CRDButton>
            </div>
          )}
          
          {/* Frame Navigation Controls */}
          {enableFrameSwitching && showFrameControls && templates.length > 1 && (
            <>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <CRDButton
                  variant="ghost"
                  size="icon"
                  onClick={switchToPrevTemplate}
                  className="bg-crd-darkest/80 backdrop-blur-sm border border-crd-mediumGray/30"
                >
                  <ChevronLeft className="w-5 h-5" />
                </CRDButton>
              </div>
              
              <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <CRDButton
                  variant="ghost"
                  size="icon"
                  onClick={switchToNextTemplate}
                  className="bg-crd-darkest/80 backdrop-blur-sm border border-crd-mediumGray/30"
                >
                  <ChevronRight className="w-5 h-5" />
                </CRDButton>
              </div>
              
              {/* Frame Counter */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-crd-darkest/80 backdrop-blur-sm rounded-lg px-3 py-1 border border-crd-mediumGray/30">
                  <div className="flex items-center gap-2 text-xs">
                    <Grid className="w-3 h-3 text-crd-green" />
                    <span className="text-crd-lightGray">
                      {currentTemplateIndex + 1} / {templates.length}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Template Info */}
        <div className="mt-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <h4 className="text-crd-white font-medium">{template.name}</h4>
            {template.is_premium && (
              <Badge className="text-xs bg-crd-green/20 text-crd-green border-crd-green/30">
                PRO
              </Badge>
            )}
          </div>
          {enableFrameSwitching && showFrameControls && (
            <p className="text-crd-lightGray text-sm mt-1">
              Hover to switch frames • Click eye to hide controls
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
