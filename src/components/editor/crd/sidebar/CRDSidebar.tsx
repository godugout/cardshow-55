import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DustyAssistant } from '../assistant/DustyAssistant';
import { InteractiveCardData } from '@/types/interactiveCard';

interface CRDSidebarProps {
  cardData: InteractiveCardData;
  onCardDataUpdate: (updates: Partial<InteractiveCardData>) => void;
  cardTitle: string;
  playerImage: string | null;
  selectedTemplate: string;
  colorPalette: string;
  effects: string[];
  previewMode: 'edit' | 'preview' | 'print';
}

export const CRDSidebar: React.FC<CRDSidebarProps> = ({
  cardData,
  onCardDataUpdate,
  cardTitle,
  playerImage,
  selectedTemplate,
  colorPalette,
  effects,
  previewMode
}) => {
  return (
    <div className="w-96 border-l border-crd-mediumGray/20 bg-crd-darker/40 backdrop-blur-sm overflow-y-auto flex-col flex">
      {/* Dusty Assistant - Top Section */}
      <div className="p-4 border-b border-crd-mediumGray/20">
        <DustyAssistant
          cardTitle={cardTitle}
          playerImage={playerImage}
          selectedTemplate={selectedTemplate}
          colorPalette={colorPalette}
          effects={effects}
          previewMode={previewMode}
        />
      </div>

      {/* Card Properties - Bottom Section */}
      <div className="p-4 space-y-4 flex-1">
        <Card className="bg-crd-darker/60 border-crd-mediumGray/20 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-crd-white text-sm">Card Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-crd-lightGray block mb-1">Title</label>
                <input 
                  type="text" 
                  value={cardData.title}
                  onChange={(e) => onCardDataUpdate({ title: e.target.value })}
                  className="w-full bg-crd-darkest/80 border border-crd-mediumGray/20 rounded px-2 py-1 text-sm text-crd-white backdrop-blur-sm"
                  placeholder="Enter card title..."
                />
              </div>
              
              <div>
                <label className="text-xs text-crd-lightGray block mb-1">Description</label>
                <textarea 
                  value={cardData.description || ''}
                  onChange={(e) => onCardDataUpdate({ description: e.target.value })}
                  className="w-full bg-crd-darkest/80 border border-crd-mediumGray/20 rounded px-2 py-1 text-sm text-crd-white backdrop-blur-sm resize-none"
                  rows={3}
                  placeholder="Enter card description..."
                />
              </div>
              
              <div>
                <label className="text-xs text-crd-lightGray block mb-1">Rarity</label>
                <select 
                  value={cardData.rarity}
                  onChange={(e) => onCardDataUpdate({ rarity: e.target.value as any })}
                  className="w-full bg-crd-darkest/80 border border-crd-mediumGray/20 rounded px-2 py-1 text-sm text-crd-white backdrop-blur-sm"
                >
                  <option value="common">Common</option>
                  <option value="uncommon">Uncommon</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-crd-lightGray block mb-1">Card Code</label>
                <div className="text-crd-white bg-crd-darkest/80 border border-crd-mediumGray/20 rounded px-2 py-1 text-sm font-mono">
                  {cardData.card_dna?.genetic_code || 'Generating...'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Properties */}
        <Card className="bg-crd-darker/60 border-crd-mediumGray/20 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-crd-white text-sm">Print Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-crd-lightGray">Dimensions:</span>
                  <div className="text-crd-white">2.5" × 3.5"</div>
                </div>
                <div>
                  <span className="text-crd-lightGray">Resolution:</span>
                  <div className="text-crd-white">300 DPI</div>
                </div>
                <div>
                  <span className="text-crd-lightGray">Color Mode:</span>
                  <div className="text-crd-white">CMYK</div>
                </div>
                <div>
                  <span className="text-crd-lightGray">Version:</span>
                  <div className="text-crd-white">v{cardData.version}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};