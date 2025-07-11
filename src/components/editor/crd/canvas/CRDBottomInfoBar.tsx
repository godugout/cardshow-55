import React from 'react';
import { Monitor, Settings, Palette, Clock } from 'lucide-react';

interface CRDBottomInfoBarProps {
  cardTitle: string;
  selectedTemplate: string;
  colorPalette: string;
  effects: string[];
  previewMode: 'edit' | 'preview' | 'print';
  cardVersion?: string;
}

export const CRDBottomInfoBar: React.FC<CRDBottomInfoBarProps> = ({
  cardTitle,
  selectedTemplate,
  colorPalette,
  effects,
  previewMode,
  cardVersion = '1.0'
}) => {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 bg-crd-darker/80 backdrop-blur-sm border border-crd-mediumGray/30 rounded-lg shadow-lg max-w-md">
      <div className="px-6 py-5 space-y-4">
        {/* Card Details Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="text-xs text-crd-lightGray font-medium">CARD DETAILS</div>
            <div className="flex-1 h-px bg-crd-mediumGray/30"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex flex-col gap-1">
              <span className="text-crd-lightGray">Title</span>
              <span className="text-crd-white font-medium">{cardTitle || 'Untitled Card'}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-crd-lightGray">Template</span>
              <span className="text-crd-white font-medium">{selectedTemplate || 'No template'}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-crd-lightGray">Colors</span>
              <span className="text-crd-white font-medium">{colorPalette || 'Default'}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-crd-lightGray">Effects</span>
              <span className="text-crd-white font-medium">{effects.length > 0 ? effects.join(', ') : 'None'}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-crd-lightGray">Mode</span>
              <span className="text-crd-white font-medium capitalize">{previewMode}</span>
            </div>
          </div>
        </div>

        {/* Specifications Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="text-xs text-crd-lightGray font-medium">SPECIFICATIONS</div>
            <div className="flex-1 h-px bg-crd-mediumGray/30"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Monitor className="w-3 h-3 text-crd-lightGray" />
              <div className="flex flex-col">
                <span className="text-crd-lightGray text-[10px]">Dimensions</span>
                <span className="text-crd-white font-medium">400×560px</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Settings className="w-3 h-3 text-crd-lightGray" />
              <div className="flex flex-col">
                <span className="text-crd-lightGray text-[10px]">Quality</span>
                <span className="text-crd-white font-medium">300 DPI</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Palette className="w-3 h-3 text-crd-lightGray" />
              <div className="flex flex-col">
                <span className="text-crd-lightGray text-[10px]">Format</span>
                <span className="text-crd-white font-medium">PNG/JPG</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-crd-lightGray" />
              <div className="flex flex-col">
                <span className="text-crd-lightGray text-[10px]">Version</span>
                <span className="text-crd-white font-medium">v{cardVersion}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="flex items-center justify-center gap-2 pt-2 border-t border-crd-mediumGray/20">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-300 text-xs font-medium">Ready to Export</span>
        </div>
      </div>
    </div>
  );
};