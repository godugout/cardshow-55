
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CreationMode } from '../../types';
import type { CardData } from '@/hooks/useCardEditor';

interface DesignStepProps {
  mode: CreationMode;
  cardData: CardData;
  onFieldUpdate: (field: keyof CardData, value: any) => void;
}

export const DesignStep = ({ mode, cardData, onFieldUpdate }: DesignStepProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-crd-white mb-2">Design Your Card</h2>
        <p className="text-crd-lightGray">
          Customize the appearance and effects for your card
        </p>
      </div>

      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardHeader>
          <CardTitle className="text-crd-white">Card Design</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-crd-lightGray">
            <p>Design tools will be available here</p>
            <p>Current mode: {mode}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
