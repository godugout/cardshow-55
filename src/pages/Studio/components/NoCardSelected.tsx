
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { mockCards } from '../mockData';

export const NoCardSelected: React.FC = () => {
  const navigate = useNavigate();

  const handleViewSampleCard = () => {
    // Navigate to the first mock card
    if (mockCards.length > 0) {
      navigate(`/studio/${mockCards[0].id}`);
    } else {
      navigate('/gallery');
    }
  };

  return (
    <div className="min-h-screen bg-crd-darkest flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">No card selected</h2>
        <p className="text-gray-400 mb-6">
          Choose a card to view in the studio, or check out our sample cards
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={handleViewSampleCard}
            className="w-full bg-crd-green hover:bg-crd-green/90 text-surface-dark"
          >
            View Sample Card
          </Button>
          
          <Button 
            onClick={() => navigate('/gallery')} 
            variant="outline"
            className="w-full border-crd-green text-crd-green hover:bg-crd-green hover:text-surface-dark"
          >
            Browse All Cards
          </Button>
        </div>
        
        {mockCards.length > 0 && (
          <div className="mt-6 text-sm text-gray-500">
            <p>Sample cards available:</p>
            <ul className="mt-2 space-y-1">
              {mockCards.slice(0, 3).map((card, index) => (
                <li key={card.id}>
                  <button
                    onClick={() => navigate(`/studio/${card.id}`)}
                    className="text-crd-green hover:text-crd-green/80 underline"
                  >
                    {card.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
