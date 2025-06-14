
import React from 'react';
import { Settings, Layout, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PanelLayoutSelectorProps {
  currentLayout: 'original' | 'minimalist';
  onLayoutChange: (layout: 'original' | 'minimalist') => void;
  onMinimize: () => void;
}

export const PanelLayoutSelector: React.FC<PanelLayoutSelectorProps> = ({
  currentLayout,
  onLayoutChange,
  onMinimize
}) => {
  return (
    <div className="flex items-center space-x-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="bg-white bg-opacity-10 hover:bg-opacity-20 border border-white/10"
          >
            <Layout className="w-4 h-4 text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="bg-black bg-opacity-95 backdrop-blur-lg border border-white/10 z-60"
        >
          <DropdownMenuItem
            onClick={() => onLayoutChange('original')}
            className={`text-white hover:bg-white/10 ${
              currentLayout === 'original' ? 'bg-crd-green/20' : ''
            }`}
          >
            <div className="flex flex-col">
              <span className="font-medium">Original</span>
              <span className="text-xs text-gray-400">Tabbed interface</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onLayoutChange('minimalist')}
            className={`text-white hover:bg-white/10 ${
              currentLayout === 'minimalist' ? 'bg-crd-green/20' : ''
            }`}
          >
            <div className="flex flex-col">
              <span className="font-medium">Minimalist</span>
              <span className="text-xs text-gray-400">Scrolling layout</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onMinimize}
        className="bg-white bg-opacity-10 hover:bg-opacity-20 border border-white/10"
        title="Minimize panel"
      >
        <Minimize2 className="w-4 h-4 text-white" />
      </Button>
    </div>
  );
};
