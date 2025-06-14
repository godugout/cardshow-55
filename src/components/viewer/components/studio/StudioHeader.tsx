
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StudioHeaderProps {
  onClose: () => void;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/10">
      <h2 className="text-lg font-semibold text-white">Studio</h2>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-5 w-5 text-white" />
      </Button>
    </div>
  );
};
