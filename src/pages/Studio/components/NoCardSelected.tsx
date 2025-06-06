
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const NoCardSelected: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">No card selected</h2>
        <p className="text-gray-400 mb-6">Choose a card to view in the studio</p>
        <Button onClick={() => navigate('/gallery')} className="bg-crd-purple hover:bg-crd-purple/90">
          Browse Cards
        </Button>
      </div>
    </div>
  );
};
