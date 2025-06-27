
import React from 'react';
import { Sparkles } from 'lucide-react';
import { CRDIdSystem } from './components/CRDIdSystem';
import { CardInfoFields } from './components/CardInfoFields';
import { CreatorAttributionFields } from './components/CreatorAttributionFields';
import { AIAnalysisSummary } from './components/AIAnalysisSummary';
import type { CardDetailsStepProps } from './components/types';
import type { CardSearchResult } from './hooks/useCardWebSearch';

export const CardDetailsStep = ({ 
  cardData, 
  onFieldUpdate, 
  onCreatorAttributionUpdate,
  aiAnalysisComplete = false 
}: CardDetailsStepProps) => {
  
  const handleCardInfoFound = (result: CardSearchResult) => {
    onFieldUpdate('title', result.title);
    onFieldUpdate('description', result.description);
    onFieldUpdate('rarity', result.rarity);
    onFieldUpdate('tags', result.tags);
    onFieldUpdate('type', result.type);
    onFieldUpdate('series', result.series);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Card Details</h2>
        <p className="text-crd-lightGray">
          {aiAnalysisComplete 
            ? 'Review the AI-suggested details below and make any adjustments'
            : 'Add information about your card or use CRD ID System to auto-fill'
          }
        </p>
        {aiAnalysisComplete && (
          <div className="flex items-center justify-center gap-2 mt-4 text-crd-green text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Fields have been pre-filled with AI suggestions</span>
          </div>
        )}
      </div>

      {/* CRD ID System */}
      <CRDIdSystem 
        imageUrl={cardData.image_url}
        onCardInfoFound={handleCardInfoFound}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CardInfoFields
          cardData={cardData}
          onFieldUpdate={onFieldUpdate}
          aiAnalysisComplete={aiAnalysisComplete}
        />

        <CreatorAttributionFields
          cardData={cardData}
          onFieldUpdate={onFieldUpdate}
          onCreatorAttributionUpdate={onCreatorAttributionUpdate}
        />
      </div>

      {aiAnalysisComplete && (
        <AIAnalysisSummary cardData={cardData} />
      )}
    </div>
  );
};
