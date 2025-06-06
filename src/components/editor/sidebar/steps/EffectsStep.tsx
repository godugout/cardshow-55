
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { EffectsTab } from '../EffectsTab';
import { useCardEditor } from '@/hooks/useCardEditor';

interface EffectsStepProps {
  searchQuery: string;
  onEffectsComplete: () => void;
  cardEditor?: ReturnType<typeof useCardEditor>;
}

export const EffectsStep = ({ searchQuery, onEffectsComplete, cardEditor }: EffectsStepProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <EffectsTab 
          searchQuery={searchQuery} 
          onEffectsComplete={onEffectsComplete}
          cardEditor={cardEditor}
        />
      </div>
    </div>
  );
};
