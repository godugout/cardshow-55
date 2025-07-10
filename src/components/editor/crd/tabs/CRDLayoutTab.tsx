import React from 'react';
import { CRDFrameIntegration } from '../frame/CRDFrameIntegration';

interface CRDLayoutTabProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  cardData?: any;
  updateCardData?: (data: any) => void;
}

export const CRDLayoutTab: React.FC<CRDLayoutTabProps> = ({
  selectedTemplate,
  onTemplateSelect,
  cardData,
  updateCardData
}) => {
  const handleCardComplete = (cardData: any) => {
    if (updateCardData) {
      updateCardData(cardData);
    }
  };

  return (
    <div className="h-full">
      <CRDFrameIntegration 
        onCardComplete={handleCardComplete}
        className="h-full"
      />
    </div>
  );
};