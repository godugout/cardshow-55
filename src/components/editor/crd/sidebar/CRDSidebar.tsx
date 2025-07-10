import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DustyAssistant } from '../assistant/DustyAssistant';
import { InteractiveCardData } from '@/types/interactiveCard';
import { 
  ChevronDown, 
  ChevronUp, 
  Settings, 
  FileText, 
  Printer, 
  Eye, 
  Palette,
  Type,
  Image,
  Hash,
  Info,
  Zap,
  Crown,
  Gem,
  Star,
  Sparkles
} from 'lucide-react';

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

const getRarityIcon = (rarity: string) => {
  switch (rarity) {
    case 'legendary': return <Crown className="w-4 h-4 text-yellow-400" />;
    case 'epic': return <Gem className="w-4 h-4 text-purple-400" />;
    case 'rare': return <Star className="w-4 h-4 text-blue-400" />;
    case 'uncommon': return <Sparkles className="w-4 h-4 text-green-400" />;
    default: return <Settings className="w-4 h-4 text-gray-400" />;
  }
};

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
  const [isAssistantExpanded, setIsAssistantExpanded] = useState(true);
  const [isPropertiesExpanded, setIsPropertiesExpanded] = useState(true);
  const [isPrintExpanded, setIsPrintExpanded] = useState(false);

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-crd-darker/60 to-crd-darker/80 backdrop-blur-md border-l border-crd-mediumGray/30">
      {/* Dusty Assistant Section */}
      <Collapsible open={isAssistantExpanded} onOpenChange={setIsAssistantExpanded}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-4 hover:bg-crd-mediumGray/10 transition-colors cursor-pointer border-b border-crd-mediumGray/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-crd-blue to-crd-lightBlue flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-crd-white font-medium text-sm">Dusty Assistant</h3>
                <p className="text-crd-lightGray text-xs">AI-powered guidance</p>
              </div>
            </div>
            {isAssistantExpanded ? 
              <ChevronUp className="w-4 h-4 text-crd-lightGray" /> : 
              <ChevronDown className="w-4 h-4 text-crd-lightGray" />
            }
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
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
        </CollapsibleContent>
      </Collapsible>

      {/* Card Properties Section */}
      <Collapsible open={isPropertiesExpanded} onOpenChange={setIsPropertiesExpanded}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-4 hover:bg-crd-mediumGray/10 transition-colors cursor-pointer border-b border-crd-mediumGray/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-crd-white font-medium text-sm">Card Properties</h3>
                <p className="text-crd-lightGray text-xs">Customize your card</p>
              </div>
            </div>
            {isPropertiesExpanded ? 
              <ChevronUp className="w-4 h-4 text-crd-lightGray" /> : 
              <ChevronDown className="w-4 h-4 text-crd-lightGray" />
            }
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-4 space-y-4 border-b border-crd-mediumGray/20">
            {/* Title Input */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-crd-blue" />
                <label className="text-xs text-crd-lightGray font-medium">Card Title</label>
              </div>
              <input 
                type="text" 
                value={cardData.title}
                onChange={(e) => onCardDataUpdate({ title: e.target.value })}
                className="w-full bg-crd-darkest/80 border border-crd-mediumGray/30 rounded-lg px-3 py-2 text-sm text-crd-white backdrop-blur-sm focus:border-crd-blue focus:ring-1 focus:ring-crd-blue/20 transition-all"
                placeholder="Enter card title..."
              />
            </div>
            
            {/* Description Input */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-crd-blue" />
                <label className="text-xs text-crd-lightGray font-medium">Description</label>
              </div>
              <textarea 
                value={cardData.description || ''}
                onChange={(e) => onCardDataUpdate({ description: e.target.value })}
                className="w-full bg-crd-darkest/80 border border-crd-mediumGray/30 rounded-lg px-3 py-2 text-sm text-crd-white backdrop-blur-sm resize-none focus:border-crd-blue focus:ring-1 focus:ring-crd-blue/20 transition-all"
                rows={3}
                placeholder="Enter card description..."
              />
            </div>
            
            {/* Rarity Selector */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {getRarityIcon(cardData.rarity)}
                <label className="text-xs text-crd-lightGray font-medium">Rarity</label>
              </div>
              <select 
                value={cardData.rarity}
                onChange={(e) => onCardDataUpdate({ rarity: e.target.value as any })}
                className="w-full bg-crd-darkest/80 border border-crd-mediumGray/30 rounded-lg px-3 py-2 text-sm text-crd-white backdrop-blur-sm focus:border-crd-blue focus:ring-1 focus:ring-crd-blue/20 transition-all"
              >
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare">Rare</option>
                <option value="epic">Epic</option>
                <option value="legendary">Legendary</option>
              </select>
            </div>

            {/* Card DNA Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-crd-blue" />
                <label className="text-xs text-crd-lightGray font-medium">Card DNA</label>
              </div>
              <div className="bg-crd-darkest/80 border border-crd-mediumGray/30 rounded-lg px-3 py-2">
                <div className="text-crd-white text-sm font-mono font-medium">
                  {cardData.card_dna?.genetic_code || 'Generating...'}
                </div>
                <div className="text-crd-lightGray text-xs mt-1">
                  Unique card identifier
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-crd-darkest/80 to-crd-darkest/60 border border-crd-mediumGray/30 rounded-lg p-3">
                <div className="text-crd-lightGray text-xs">Version</div>
                <div className="text-crd-white font-medium">v{cardData.version}</div>
              </div>
              <div className="bg-gradient-to-br from-crd-darkest/80 to-crd-darkest/60 border border-crd-mediumGray/30 rounded-lg p-3">
                <div className="text-crd-lightGray text-xs">Status</div>
                <div className="text-emerald-400 font-medium flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  Ready
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Print Preview Section */}
      <Collapsible open={isPrintExpanded} onOpenChange={setIsPrintExpanded}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-4 hover:bg-crd-mediumGray/10 transition-colors cursor-pointer border-b border-crd-mediumGray/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Printer className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-crd-white font-medium text-sm">Print Settings</h3>
                <p className="text-crd-lightGray text-xs">Production specifications</p>
              </div>
            </div>
            {isPrintExpanded ? 
              <ChevronUp className="w-4 h-4 text-crd-lightGray" /> : 
              <ChevronDown className="w-4 h-4 text-crd-lightGray" />
            }
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-4 space-y-4">
            {/* Print Specs Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-crd-darkest/80 to-crd-darkest/60 border border-crd-mediumGray/30 rounded-lg p-3">
                <div className="text-crd-lightGray text-xs mb-1">Dimensions</div>
                <div className="text-crd-white text-sm font-medium">2.5" × 3.5"</div>
                <div className="text-crd-lightGray text-xs">Standard card size</div>
              </div>
              <div className="bg-gradient-to-br from-crd-darkest/80 to-crd-darkest/60 border border-crd-mediumGray/30 rounded-lg p-3">
                <div className="text-crd-lightGray text-xs mb-1">Resolution</div>
                <div className="text-crd-white text-sm font-medium">300 DPI</div>
                <div className="text-crd-lightGray text-xs">Print quality</div>
              </div>
              <div className="bg-gradient-to-br from-crd-darkest/80 to-crd-darkest/60 border border-crd-mediumGray/30 rounded-lg p-3">
                <div className="text-crd-lightGray text-xs mb-1">Color Mode</div>
                <div className="text-crd-white text-sm font-medium">CMYK</div>
                <div className="text-crd-lightGray text-xs">Print colors</div>
              </div>
              <div className="bg-gradient-to-br from-crd-darkest/80 to-crd-darkest/60 border border-crd-mediumGray/30 rounded-lg p-3">
                <div className="text-crd-lightGray text-xs mb-1">Finish</div>
                <div className="text-crd-white text-sm font-medium">Matte</div>
                <div className="text-crd-lightGray text-xs">Surface type</div>
              </div>
            </div>

            {/* Quick Print Actions */}
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full bg-crd-darkest/60 border-crd-mediumGray/30 text-crd-white hover:bg-crd-blue hover:border-crd-blue transition-all"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview Print Layout
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-crd-darkest/60 border-crd-mediumGray/30 text-crd-white hover:bg-crd-mediumGray/30 transition-all text-xs"
                >
                  Download PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-crd-darkest/60 border-crd-mediumGray/30 text-crd-white hover:bg-crd-mediumGray/30 transition-all text-xs"
                >
                  Send to Print
                </Button>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Card Info Footer */}
      <div className="mt-auto p-4 border-t border-crd-mediumGray/20 bg-gradient-to-r from-crd-darker/80 to-crd-darker/60">
        <div className="flex items-center gap-2 text-xs text-crd-lightGray">
          <Info className="w-3 h-3" />
          <span>Last saved {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};