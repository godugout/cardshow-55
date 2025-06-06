
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';

export const StudioHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/gallery');
  };

  return (
    <div className="absolute top-4 left-4 z-50">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="bg-black bg-opacity-50 hover:bg-opacity-70 backdrop-blur border border-white/10 text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Gallery
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/cards/create')}
          className="bg-black bg-opacity-50 hover:bg-opacity-70 backdrop-blur border border-white/10 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Card
        </Button>
      </div>
    </div>
  );
};
