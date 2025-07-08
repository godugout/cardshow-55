import React, { useState } from 'react';
import { ChevronUp, Settings, Share2, Download, X, Palette, Camera, Grid3X3 } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { StudioCaseSelector, type CaseStyle } from './StudioCaseSelector';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useIsMobile } from '@/hooks/use-mobile';
import type { CardData } from '@/types/card';

interface MobileStudioControlsRedesignedProps {
  selectedCard: CardData;
  selectedCase: CaseStyle;
  onCaseChange: (caseStyle: CaseStyle) => void;
  onShare: (card: CardData) => void;
  onDownload: (card: CardData) => void;
  onClose: () => void;
  use3DMode?: boolean;
  onToggle3D?: () => void;
}

export const MobileStudioControlsRedesigned: React.FC<MobileStudioControlsRedesignedProps> = ({
  selectedCard,
  selectedCase,
  onCaseChange,
  onShare,
  onDownload,
  onClose,
  use3DMode = true,
  onToggle3D
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useIsMobile();
  const { medium, light } = useHapticFeedback();

  const handleActionWithHaptic = (action: () => void) => {
    light();
    action();
  };

  if (!isMobile) {
    return null; // Only show on mobile
  }

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-6 right-6 z-50 lg:hidden">
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetTrigger asChild>
            <CRDButton
              variant="primary"
              size="lg"
              className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-themed-accent/20"
              onClick={() => {
                medium();
                setIsDrawerOpen(true);
              }}
            >
              <Settings className="w-6 h-6" />
            </CRDButton>
          </SheetTrigger>

          <SheetContent 
            side="bottom" 
            className="bg-themed-base border-t-2 border-themed-accent/20 rounded-t-2xl"
            style={{
              maxHeight: '85vh',
              paddingBottom: 'env(safe-area-inset-bottom, 1rem)'
            }}
          >
            <SheetHeader className="pb-4 border-b border-themed-light">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-themed-primary text-lg font-semibold">
                  Studio Controls
                </SheetTitle>
                <CRDButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-8 h-8 p-0 text-themed-secondary hover:text-themed-primary"
                >
                  <X className="w-4 h-4" />
                </CRDButton>
              </div>
              
              {/* Card Summary */}
              <div className="flex items-center gap-3 pt-3">
                <div className="w-12 h-16 bg-themed-light rounded-lg overflow-hidden">
                  <img 
                    src={selectedCard.image_url || '/placeholder.svg'} 
                    alt={selectedCard.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-themed-primary font-semibold text-sm truncate">
                    {selectedCard.title}
                  </h3>
                  <p className="text-themed-secondary text-xs truncate">
                    {selectedCard.description || 'No description'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-block px-2 py-0.5 bg-themed-accent/20 rounded text-xs text-themed-strong capitalize">
                      {selectedCard.rarity || 'common'}
                    </span>
                  </div>
                </div>
              </div>
            </SheetHeader>

            <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
              <div className="space-y-6 py-4">
                {/* Quick Actions */}
                <div>
                  <h4 className="text-themed-primary font-medium mb-3 flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Quick Actions
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <CRDButton
                      variant="outline"
                      onClick={() => handleActionWithHaptic(() => onShare(selectedCard))}
                      className="min-h-[52px] flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </CRDButton>
                    
                    <CRDButton
                      variant="outline"
                      onClick={() => handleActionWithHaptic(() => onDownload(selectedCard))}
                      className="min-h-[52px] flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </CRDButton>
                  </div>
                </div>

                {/* View Mode Toggle */}
                {onToggle3D && (
                  <div>
                    <h4 className="text-themed-primary font-medium mb-3 flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      View Mode
                    </h4>
                    <CRDButton
                      variant={use3DMode ? "primary" : "outline"}
                      onClick={() => handleActionWithHaptic(onToggle3D)}
                      className="w-full min-h-[52px] flex items-center justify-center gap-2"
                    >
                      <Grid3X3 className="w-4 h-4" />
                      {use3DMode ? '3D Studio Mode' : '2D Viewer Mode'}
                    </CRDButton>
                  </div>
                )}

                {/* Display Case */}
                <div>
                  <h4 className="text-themed-primary font-medium mb-3 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Display Case
                  </h4>
                  <StudioCaseSelector
                    selectedCase={selectedCase}
                    onCaseChange={(caseStyle) => {
                      light();
                      onCaseChange(caseStyle);
                    }}
                  />
                </div>

                {/* Advanced Options */}
                <div>
                  <h4 className="text-themed-primary font-medium mb-3 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Advanced Options
                  </h4>
                  <div className="space-y-3">
                    <CRDButton
                      variant="ghost"
                      className="w-full justify-start min-h-[52px] text-themed-secondary hover:text-themed-primary"
                    >
                      Export Settings
                    </CRDButton>
                    <CRDButton
                      variant="ghost"
                      className="w-full justify-start min-h-[52px] text-themed-secondary hover:text-themed-primary"
                    >
                      Lighting Controls
                    </CRDButton>
                    <CRDButton
                      variant="ghost"
                      className="w-full justify-start min-h-[52px] text-themed-secondary hover:text-themed-primary"
                    >
                      Background Options
                    </CRDButton>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Safe Area */}
            <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Quick Access Mini Panel */}
      <div 
        className="fixed bottom-6 left-6 z-40 lg:hidden bg-themed-base/90 backdrop-blur-sm border border-themed-light rounded-2xl p-3 shadow-lg"
        style={{
          marginBottom: 'env(safe-area-inset-bottom, 0px)'
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-10 bg-themed-light rounded overflow-hidden">
            <img 
              src={selectedCard.image_url || '/placeholder.svg'} 
              alt={selectedCard.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-themed-primary text-xs font-medium truncate max-w-[120px]">
              {selectedCard.title}
            </span>
            <span className="text-themed-secondary text-xs capitalize">
              {selectedCard.rarity || 'common'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};