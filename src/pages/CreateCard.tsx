
import React from 'react';
import { ProfessionalWizard } from '@/components/editor/wizard/ProfessionalWizard';
import { useNavigate } from 'react-router-dom';
import type { CardData } from '@/hooks/useCardEditor';

const CreateCard = () => {
  const navigate = useNavigate();

  console.log('CreateCard component rendered');

  const handleComplete = (cardData: CardData) => {
    console.log('Card created successfully:', cardData);
    navigate('/gallery');
  };

  const handleCancel = () => {
    console.log('Card creation cancelled');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      <ProfessionalWizard 
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default CreateCard;
