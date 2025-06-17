
import React from 'react';
import { Sparkles, Settings } from 'lucide-react';
import { CardDetailsStep } from '@/components/editor/wizard/CardDetailsStep';
import type { CardData } from '@/hooks/useCardEditor';

interface EnhancedDetailsStepProps {
  mode: 'quick' | 'advanced';
  cardData: CardData;
  onFieldUpdate: <K extends keyof CardData>(field: K, value: CardData[K]) => void;
  onCreatorAttributionUpdate: (updates: Partial<CardData['creator_attribution']>) => void;
  aiAnalysisComplete: boolean;
}

export const EnhancedDetailsStep = ({
  mode,
  cardData,
  onFieldUpdate,
  onCreatorAttributionUpdate,
  aiAnalysisComplete
}: EnhancedDetailsStepProps) => {
  return (
    <div className="space-y-6">
      {/* Mode-specific header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          {mode === 'quick' ? 'Review & Finalize' : 'Customize Card Details'}
        </h2>
        <p className="text-crd-lightGray">
          {mode === 'quick' 
            ? 'Review the AI-generated details and make any adjustments'
            : 'Add detailed information and customize your card'
          }
        </p>
      </div>

      {/* AI Pre-fill Banner */}
      {aiAnalysisComplete && mode === 'quick' && (
        <div className="bg-gradient-to-r from-crd-green/20 to-crd-blue/20 rounded-lg p-4 border border-crd-green/30">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-crd-green" />
            <span className="text-white font-medium">AI Analysis Complete</span>
          </div>
          <p className="text-sm text-crd-lightGray">
            We've pre-filled the details based on your photo. Feel free to make adjustments.
          </p>
        </div>
      )}

      {/* Card Details Form */}
      <CardDetailsStep
        cardData={cardData}
        onFieldUpdate={onFieldUpdate}
        onCreatorAttributionUpdate={onCreatorAttributionUpdate}
        aiAnalysisComplete={aiAnalysisComplete}
      />

      {/* Mode-specific tips */}
      {mode === 'advanced' && (
        <div className="text-center p-4 bg-crd-blue/10 rounded-lg border border-crd-blue/20">
          <div className="flex items-center justify-center gap-2 text-crd-blue mb-2">
            <Settings className="w-4 h-4" />
            <span className="font-medium">Advanced Customization</span>
          </div>
          <p className="text-sm text-crd-lightGray">
            Take advantage of advanced features like custom effects and detailed metadata
          </p>
        </div>
      )}
    </div>
  );
};
