import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Users, Dna, Share, Lock, Crown, Copy } from 'lucide-react';
import { CardDNA } from '@/types/interactiveCard';

interface CollaborativeFusionProps {
  cardDna: CardDNA;
  onUpdate: (dna: CardDNA) => void;
}

export const CollaborativeFusion: React.FC<CollaborativeFusionProps> = ({
  cardDna,
  onUpdate
}) => {
  const [showDnaDetails, setShowDnaDetails] = useState(false);

  const updatePermissions = (updates: Partial<CardDNA['remix_permissions']>) => {
    onUpdate({
      ...cardDna,
      remix_permissions: { ...cardDna.remix_permissions, ...updates }
    });
  };

  const copyGeneticCode = () => {
    navigator.clipboard.writeText(cardDna.genetic_code);
  };

  const addInheritanceTrait = () => {
    const newTrait = {
      trait_name: 'custom_trait',
      trait_value: 'default',
      dominance: 0.5
    };
    onUpdate({
      ...cardDna,
      inheritance_traits: [...cardDna.inheritance_traits, newTrait]
    });
  };

  return (
    <div className="space-y-4">
      <Card className="bg-crd-darker/80 border-crd-mediumGray/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-crd-white text-base flex items-center gap-2">
            <Users className="w-4 h-4" />
            Collaborative Fusion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share className="w-4 h-4 text-crd-lightGray" />
                <Label className="text-crd-white text-sm">Allow Visual Remix</Label>
              </div>
              <Switch
                checked={cardDna.remix_permissions.allow_visual_remix}
                onCheckedChange={(checked) => updatePermissions({ allow_visual_remix: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dna className="w-4 h-4 text-crd-lightGray" />
                <Label className="text-crd-white text-sm">Allow Behavior Remix</Label>
              </div>
              <Switch
                checked={cardDna.remix_permissions.allow_behavior_remix}
                onCheckedChange={(checked) => updatePermissions({ allow_behavior_remix: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-crd-lightGray" />
                <Label className="text-crd-white text-sm">Require Attribution</Label>
              </div>
              <Switch
                checked={cardDna.remix_permissions.require_attribution}
                onCheckedChange={(checked) => updatePermissions({ require_attribution: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-crd-lightGray" />
                <Label className="text-crd-white text-sm">Commercial Use</Label>
              </div>
              <Switch
                checked={cardDna.remix_permissions.commercial_use}
                onCheckedChange={(checked) => updatePermissions({ commercial_use: checked })}
              />
            </div>
          </div>

          <div className="border-t border-crd-mediumGray/30 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-crd-white text-sm font-medium">Card DNA</h4>
              <CRDButton
                onClick={() => setShowDnaDetails(!showDnaDetails)}
                variant="secondary"
                size="sm"
              >
                {showDnaDetails ? 'Hide' : 'Show'} Details
              </CRDButton>
            </div>

            <div className="flex items-center gap-2 p-2 bg-crd-mediumGray/20 rounded">
              <span className="text-crd-lightGray text-xs font-mono">
                {cardDna.genetic_code}
              </span>
              <button
                onClick={copyGeneticCode}
                className="text-crd-lightGray hover:text-crd-white"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>

            {showDnaDetails && (
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-crd-lightGray">Generation</span>
                  <span className="text-crd-white">#{cardDna.generation}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-crd-lightGray">Parent Cards</span>
                  <span className="text-crd-white">{cardDna.parent_cards.length}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-crd-lightGray">Inheritance Traits</span>
                  <span className="text-crd-white">{cardDna.inheritance_traits.length}</span>
                </div>
              </div>
            )}
          </div>

          {cardDna.inheritance_traits.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-crd-white text-sm font-medium">Inheritance Traits</h4>
              {cardDna.inheritance_traits.map((trait, idx) => (
                <div key={idx} className="p-2 bg-crd-mediumGray/20 rounded">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-crd-white text-xs">{trait.trait_name}</span>
                    <span className="text-crd-lightGray text-xs">{trait.dominance * 100}%</span>
                  </div>
                  <Progress 
                    value={trait.dominance * 100} 
                    className="h-1"
                  />
                </div>
              ))}
              <CRDButton
                onClick={addInheritanceTrait}
                variant="secondary"
                size="sm"
                className="w-full"
              >
                Add Trait
              </CRDButton>
            </div>
          )}

          <div className="p-3 bg-crd-green/10 border border-crd-green/30 rounded-lg">
            <h4 className="text-crd-white text-sm font-medium mb-2">Fusion Features</h4>
            <div className="space-y-1 text-xs text-crd-lightGray">
              <div>• Cross-platform card remixing</div>
              <div>• Trait inheritance system</div>
              <div>• Collaborative editing sessions</div>
              <div>• Attribution tracking</div>
              <div>• Version history</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};