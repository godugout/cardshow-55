
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Upload, Palette } from 'lucide-react';

interface WallpaperSectionProps {
  selectedWallpaper: string | null;
  onWallpaperChange: (wallpaper: string | null) => void;
}

const WALLPAPER_PRESETS = [
  { id: 'gradient-1', name: 'Aurora', preview: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)' },
  { id: 'gradient-2', name: 'Sunset', preview: 'linear-gradient(45deg, #ff6b6b 0%, #ffa726 100%)' },
  { id: 'gradient-3', name: 'Ocean', preview: 'linear-gradient(45deg, #4ecdc4 0%, #44a08d 100%)' },
  { id: 'gradient-4', name: 'Forest', preview: 'linear-gradient(45deg, #11998e 0%, #38ef7d 100%)' },
  { id: 'solid-1', name: 'Pure Black', preview: '#000000' },
  { id: 'solid-2', name: 'Deep Purple', preview: '#2d1b69' },
  { id: 'solid-3', name: 'Midnight Blue', preview: '#0f0e23' },
  { id: 'solid-4', name: 'Rich Gold', preview: '#b8860b' },
];

export const WallpaperSection: React.FC<WallpaperSectionProps> = ({
  selectedWallpaper,
  onWallpaperChange
}) => {
  return (
    <div className="space-y-4">
      {/* Wallpaper Presets */}
      <div>
        <h4 className="text-white font-medium text-sm mb-3">Preset Wallpapers</h4>
        <div className="grid grid-cols-2 gap-2">
          {WALLPAPER_PRESETS.map((wallpaper) => {
            const isSelected = selectedWallpaper === wallpaper.id;
            
            return (
              <Button
                key={wallpaper.id}
                onClick={() => onWallpaperChange(wallpaper.id)}
                variant="ghost"
                className={cn(
                  "h-auto p-3 flex flex-col items-center space-y-2 transition-all duration-200",
                  isSelected
                    ? "bg-crd-green/20 border-crd-green text-white shadow-md"
                    : "bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30"
                )}
                style={isSelected ? {
                  borderColor: '#00C851',
                  backgroundColor: '#00C85120',
                  boxShadow: '0 0 15px #00C85130'
                } : {}}
              >
                <div 
                  className="w-8 h-8 rounded-md border border-white/20"
                  style={{ background: wallpaper.preview }}
                />
                <div className="text-center">
                  <div className="text-xs font-medium text-white">{wallpaper.name}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Custom Upload */}
      <div>
        <h4 className="text-white font-medium text-sm mb-3">Custom Wallpaper</h4>
        <div className="space-y-2">
          <Button
            onClick={() => {/* TODO: Implement file upload */}}
            variant="outline"
            size="sm"
            className="w-full flex items-center space-x-2 text-white border-white/20 hover:border-white/40"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Image</span>
          </Button>
          
          <Button
            onClick={() => {/* TODO: Implement color picker */}}
            variant="outline"
            size="sm"
            className="w-full flex items-center space-x-2 text-white border-white/20 hover:border-white/40"
          >
            <Palette className="w-4 h-4" />
            <span>Custom Color</span>
          </Button>
        </div>
      </div>

      {selectedWallpaper && (
        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="text-xs text-gray-400 mb-2">Selected Wallpaper</div>
          <div className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded border border-white/20"
              style={{ 
                background: WALLPAPER_PRESETS.find(w => w.id === selectedWallpaper)?.preview || '#000'
              }}
            />
            <span className="text-white text-sm">
              {WALLPAPER_PRESETS.find(w => w.id === selectedWallpaper)?.name || 'Custom'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
