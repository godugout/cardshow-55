import React from 'react';
import { Sparkles } from 'lucide-react';
interface ViewerInfoPanelProps {
  showStats: boolean;
  isFlipped: boolean;
  shouldShowPanel: boolean;
  hasMultipleCards: boolean;
}
export const ViewerInfoPanel: React.FC<ViewerInfoPanelProps> = ({
  showStats,
  isFlipped,
  shouldShowPanel,
  hasMultipleCards
}) => {
  if (!showStats || isFlipped || shouldShowPanel) return null;
  return <div className="absolute bottom-4 left-4 right-4 max-w-2xl mx-auto z-10" style={{
    marginRight: hasMultipleCards ? '180px' : '100px',
    marginLeft: '280px'
  }}>
      
    </div>;
};