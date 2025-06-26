
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { CreationMode } from '../../types';
import type { CardData } from '@/hooks/useCardEditor';

interface PublishStepProps {
  mode: CreationMode;
  cardData: CardData;
  onFieldUpdate: (field: keyof CardData, value: any) => void;
}

export const PublishStep = ({ mode, cardData, onFieldUpdate }: PublishStepProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-crd-white mb-2">Publish Your Card</h2>
        <p className="text-crd-lightGray">
          Configure how your card will be shared and distributed
        </p>
      </div>

      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardHeader>
          <CardTitle className="text-crd-white">Publishing Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-crd-white">Make Public</Label>
              <p className="text-xs text-crd-lightGray">Allow others to see your card</p>
            </div>
            <Switch
              checked={cardData.visibility === 'public'}
              onCheckedChange={(checked) => 
                onFieldUpdate('visibility', checked ? 'public' : 'private')
              }
            />
          </div>

          <div className="pt-4 border-t border-crd-mediumGray/20">
            <div className="text-sm text-crd-lightGray space-y-1">
              <p>Title: <span className="text-crd-white">{cardData.title}</span></p>
              <p>Rarity: <span className="text-crd-white capitalize">{cardData.rarity || 'common'}</span></p>
              <p>Status: <span className="text-crd-green">Ready to publish</span></p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
