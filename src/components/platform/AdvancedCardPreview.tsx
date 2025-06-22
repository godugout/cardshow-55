
import React, { useState } from 'react';
import { Advanced3DCardViewer } from '@/components/viewer/Advanced3DCardViewer';
import { CollectionAnalytics } from '@/components/analytics/CollectionAnalytics';
import { AdvancedTradingTools } from '@/components/trading/AdvancedTradingTools';
import { Eye, BarChart3, Search, Settings, Share2, Camera } from 'lucide-react';
import type { CardData } from '@/hooks/useCardEditor';

interface AdvancedCardPreviewProps {
  card: CardData;
  onClose?: () => void;
}

export const AdvancedCardPreview: React.FC<AdvancedCardPreviewProps> = ({
  card,
  onClose
}) => {
  const [activeView, setActiveView] = useState<'3d' | 'analytics' | 'trading'>('3d');
  
  const handleShare = () => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: card.title,
        text: `Check out this amazing card: ${card.title}`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers without native sharing
      navigator.clipboard.writeText(window.location.href);
      // Show toast notification
    }
  };
  
  const handleScreenshot = () => {
    // Implement screenshot functionality
    // This would capture the 3D viewer content
    console.log('Taking screenshot...');
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex">
      {/* Left Sidebar - Navigation */}
      <div className="w-16 bg-[#1a1a1a] border-r border-gray-700 flex flex-col items-center py-4">
        <button
          onClick={onClose}
          className="mb-6 p-2 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
        
        <div className="space-y-2">
          <button
            onClick={() => setActiveView('3d')}
            className={`p-3 rounded-lg transition-colors ${
              activeView === '3d'
                ? 'bg-[#00C851] text-black'
                : 'text-gray-400 hover:text-white hover:bg-[#2d2d2d]'
            }`}
            title="3D Viewer"
          >
            <Eye className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setActiveView('analytics')}
            className={`p-3 rounded-lg transition-colors ${
              activeView === 'analytics'
                ? 'bg-[#00C851] text-black'
                : 'text-gray-400 hover:text-white hover:bg-[#2d2d2d]'
            }`}
            title="Analytics"
          >
            <BarChart3 className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setActiveView('trading')}
            className={`p-3 rounded-lg transition-colors ${
              activeView === 'trading'
                ? 'bg-[#00C851] text-black'
                : 'text-gray-400 hover:text-white hover:bg-[#2d2d2d]'
            }`}
            title="Trading Tools"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-auto space-y-2">
          <button
            onClick={handleShare}
            className="p-3 text-gray-400 hover:text-white hover:bg-[#2d2d2d] rounded-lg transition-colors"
            title="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleScreenshot}
            className="p-3 text-gray-400 hover:text-white hover:bg-[#2d2d2d] rounded-lg transition-colors"
            title="Screenshot"
          >
            <Camera className="w-5 h-5" />
          </button>
          
          <button className="p-3 text-gray-400 hover:text-white hover:bg-[#2d2d2d] rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeView === '3d' && (
            <div className="h-full p-4">
              <Advanced3DCardViewer
                card={card}
                autoRotate={false}
                quality="high"
                showControls={true}
                onShare={handleShare}
                onScreenshot={handleScreenshot}
              />
            </div>
          )}
          
          {activeView === 'analytics' && (
            <div className="h-full overflow-auto">
              <CollectionAnalytics />
            </div>
          )}
          
          {activeView === 'trading' && (
            <div className="h-full overflow-auto">
              <AdvancedTradingTools />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
