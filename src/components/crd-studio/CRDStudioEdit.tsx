import React from 'react';
import { useParams } from 'react-router-dom';

export const CRDStudioEdit: React.FC = () => {
  const { cardId } = useParams();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-crd-white mb-2">Edit Card</h1>
      <p className="text-crd-lightGray">Card ID: {cardId}</p>
      <div className="mt-8 p-8 bg-crd-dark rounded-lg border border-crd-mediumGray">
        <p className="text-crd-lightGray">Card editor interface coming soon...</p>
      </div>
    </div>
  );
};