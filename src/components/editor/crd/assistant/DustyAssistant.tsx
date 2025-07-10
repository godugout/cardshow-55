import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { DustyAvatar } from './DustyAvatar';
import { DustyMessageBubble } from './DustyMessageBubble';
import { DustyActionButtons } from './DustyActionButtons';
import { DustyProgressTracker } from './DustyProgressTracker';
import { useActivityMonitor } from './hooks/useActivityMonitor';
import { useDustyConversation } from './hooks/useDustyConversation';

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
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Monitor user activity and card state
  const activityState = useActivityMonitor({
    cardTitle,
    playerImage,
    selectedTemplate,
    colorPalette,
    effects,
    previewMode
  });

  // Generate contextual conversation
  const { currentMessage, suggestedActions, progress } = useDustyConversation(activityState);

  if (isMinimized) {
    return (
      <div className="h-20 bg-crd-darker/50 border-t border-crd-mediumGray/20 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <DustyAvatar size="small" expression="neutral" />
          <span className="text-crd-lightGray text-sm">Dusty is here to help</span>
        </div>
        <button
          onClick={() => setIsMinimized(false)}
          className="text-xs text-crd-blue hover:text-crd-blue/80 transition-colors"
        >
          Expand Assistant
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-crd-darkest/80 to-crd-darkest/60 border border-crd-mediumGray/30 rounded-lg backdrop-blur-sm">
      {/* Compact Content */}
      <div className="p-4 space-y-4">
        {/* Progress Tracker */}
        <DustyProgressTracker progress={progress} />

        {/* Message Area - Compact Layout */}
        <div className="flex items-start gap-3">
          <DustyAvatar size="small" expression={currentMessage.expression} />
          <div className="flex-1 space-y-3">
            <DustyMessageBubble message={currentMessage} />
            {suggestedActions.length > 0 && (
              <DustyActionButtons actions={suggestedActions} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};