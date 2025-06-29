
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Plus, X } from 'lucide-react';

interface CreatorAttributionProps {
  creatorName: string;
  setCreatorName: (name: string) => void;
  collaborationType: 'solo' | 'collaboration' | 'commission';
  setCollaborationType: (type: 'solo' | 'collaboration' | 'commission') => void;
  additionalCredits: Array<{ name: string; role: string; }>;
  setAdditionalCredits: (credits: Array<{ name: string; role: string; }>) => void;
}

export const CreatorAttribution = ({
  creatorName,
  setCreatorName,
  collaborationType,
  setCollaborationType,
  additionalCredits,
  setAdditionalCredits
}: CreatorAttributionProps) => {
  const addCredit = () => {
    setAdditionalCredits([...additionalCredits, { name: '', role: '' }]);
  };

  const removeCredit = (index: number) => {
    setAdditionalCredits(additionalCredits.filter((_, i) => i !== index));
  };

  const updateCredit = (index: number, field: 'name' | 'role', value: string) => {
    const updated = [...additionalCredits];
    updated[index][field] = value;
    setAdditionalCredits(updated);
  };

  return (
    <Card className="bg-crd-darker border-crd-mediumGray/20">
      <CardHeader className="pb-4">
        <CardTitle className="text-crd-white">Creator Attribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="creator-name" className="text-crd-white">
            Creator Name
          </Label>
          <Input
            id="creator-name"
            type="text"
            placeholder="Your name"
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
            className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white"
          />
        </div>

        <div>
          <Label htmlFor="collaboration-type" className="text-crd-white">
            Collaboration Type
          </Label>
          <Select value={collaborationType} onValueChange={setCollaborationType}>
            <SelectTrigger className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solo">Solo Creation</SelectItem>
              <SelectItem value="collaboration">Collaboration</SelectItem>
              <SelectItem value="commission">Commission</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {collaborationType !== 'solo' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-crd-white">Additional Credits</Label>
              <CRDButton size="sm" variant="outline" onClick={addCredit}>
                <Plus className="w-4 h-4 mr-1" />
                Add Credit
              </CRDButton>
            </div>

            {additionalCredits.map((credit, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  placeholder="Name"
                  value={credit.name}
                  onChange={(e) => updateCredit(index, 'name', e.target.value)}
                  className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white"
                />
                <Input
                  placeholder="Role"
                  value={credit.role}
                  onChange={(e) => updateCredit(index, 'role', e.target.value)}
                  className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white"
                />
                <CRDButton
                  size="sm"
                  variant="outline"
                  onClick={() => removeCredit(index)}
                >
                  <X className="w-4 h-4" />
                </CRDButton>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
