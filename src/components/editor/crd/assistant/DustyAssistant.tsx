import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Settings } from 'lucide-react';
import { FloatingChatWindow } from './FloatingChatWindow';

interface DustyAssistantProps {
  cardTitle: string;
  playerImage: string | null;
  selectedTemplate: string;
  colorPalette: string;
  effects: string[];
  previewMode: 'edit' | 'preview' | 'print';
}

export const DustyAssistant: React.FC<DustyAssistantProps> = ({
  cardTitle,
  playerImage,
  selectedTemplate,
  colorPalette,
  effects,
  previewMode
}) => {
  const [showFloatingChat, setShowFloatingChat] = useState(false);

  return (
    <div className="space-y-4">
      {/* Card Details & Specs */}
      <div className="space-y-3">
        <div className="bg-crd-darker/30 rounded-lg p-3">
          <h4 className="text-crd-white text-sm font-medium mb-2">Card Details</h4>
          <div className="space-y-1 text-xs text-crd-lightGray">
            <div>Title: {cardTitle || 'Untitled Card'}</div>
            <div>Template: {selectedTemplate || 'No template selected'}</div>
            <div>Colors: {colorPalette || 'Default palette'}</div>
            <div>Effects: {effects.length > 0 ? effects.join(', ') : 'None'}</div>
            <div>Mode: {previewMode}</div>
          </div>
        </div>

        <div className="bg-crd-darker/30 rounded-lg p-3">
          <h4 className="text-crd-white text-sm font-medium mb-2">Specifications</h4>
          <div className="space-y-1 text-xs text-crd-lightGray">
            <div>Dimensions: 400 × 560px</div>
            <div>DPI: 300 (Print Ready)</div>
            <div>Format: PNG/JPG Export</div>
            <div>Quality: Professional</div>
          </div>
        </div>
      </div>

      {/* Chat Controls */}
      <div className="space-y-2">
        <Button
          onClick={() => setShowFloatingChat(true)}
          className="w-full bg-crd-blue hover:bg-crd-blue/80 text-white text-sm"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat with Dusty
        </Button>
        
        <Button
          variant="outline"
          className="w-full bg-transparent border-crd-mediumGray/30 text-crd-lightGray hover:bg-crd-mediumGray/20 hover:text-crd-white text-sm"
        >
          <Settings className="w-4 h-4 mr-2" />
          Assistant Settings
        </Button>
      </div>

      {/* Floating Chat Window */}
      <FloatingChatWindow
        isOpen={showFloatingChat}
        onClose={() => setShowFloatingChat(false)}
        cardTitle={cardTitle}
        selectedTemplate={selectedTemplate}
      />
    </div>
  );
};