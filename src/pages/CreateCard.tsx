
import React from 'react';
import { ProfessionalWizard } from '@/components/editor/wizard/ProfessionalWizard';
import { useNavigate } from 'react-router-dom';
import type { CardData } from '@/hooks/useCardEditor';

const CreateCard = () => {
  const navigate = useNavigate();

  const handleComplete = (cardData: CardData) => {
    console.log('Card created successfully:', cardData);
    // Navigate to gallery or card detail page
    navigate('/gallery');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <ProfessionalWizard 
      onComplete={handleComplete}
      onCancel={handleCancel}
    />
  );
};

export default CreateCard;
