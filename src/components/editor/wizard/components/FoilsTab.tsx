
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Chrome, Star, Zap, Sparkles } from 'lucide-react';

interface FoilsTabProps {
  surface: {
    foil: { enabled: boolean; type: string; intensity: number };
    interference: { enabled: boolean; frequency: number; amplitude: number };
    holographic: { enabled: boolean; intensity: number; pattern: string };
    prism: { enabled: boolean; dispersion: number; refraction: number };
  };
  onUpdate: (surface: FoilsTabProps['surface']) => void;
}

const FOIL_TYPES = [
  { id: 'silver', name: 'Silver Foil', color: '#c0c0c0', icon: Chrome },
  { id: 'gold', name: 'Gold Foil', color: '#ffd700', icon: Star },
  { id: 'rainbow', name: 'Rainbow Foil', color: 'linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080)', icon: Sparkles },
  { id: 'copper', name: 'Copper Foil', color: '#b87333', icon: Zap }
];

export const FoilsTab = ({ surface, onUpdate }: FoilsTabProps) => {
  const updateFoil = (updates: Partial<typeof surface.foil>) => {
    onUpdate({
      ...surface,
      foil: { ...surface.foil, ...updates }
    });
  };

  const updateInterference = (updates: Partial<typeof surface.interference>) => {
    onUpdate({
      ...surface,
      interference: { ...surface.interference, ...updates }
    });
  };

  return (
    <div className="space-y-6">
      {/* Foil Effects */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-white font-medium">Foil Effects</h4>
          <Button
            onClick={() => updateFoil({ enabled: !surface.foil.enabled })}
            variant="outline"
            size="sm"
            className={`${
              surface.foil.enabled
                ? 'bg-crd-green text-black border-crd-green'
                : 'bg-transparent text-white border-crd-mediumGray'
            }`}
          >
            {surface.foil.enabled ? 'On' : 'Off'}
          </Button>
        </div>

        {surface.foil.enabled && (
          <div className="space-y-4">
            {/* Foil Types */}
            <div>
              <Label className="text-sm text-crd-lightGray mb-2 block">Foil Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {FOIL_TYPES.map((foil) => {
                  const Icon = foil.icon;
                  const isActive = surface.foil.type === foil.id;
                  
                  return (
                    <button
                      key={foil.id}
                      onClick={() => updateFoil({ type: foil.id })}
                      className={`p-2 rounded border text-left transition-all ${
                        isActive
                          ? 'border-crd-green bg-crd-green/10 text-white'
                          : 'border-crd-mediumGray bg-crd-mediumGray/10 text-crd-lightGray hover:border-crd-green hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3 h-3" />
                        <span className="text-xs font-medium">{foil.name}</span>
                      </div>
                      <div 
                        className="w-full h-2 rounded mt-1"
                        style={{ 
                          background: foil.color.includes('gradient') ? foil.color : foil.color 
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Foil Intensity */}
            <div>
              <Label className="text-sm text-crd-lightGray mb-2 block">
                Foil Intensity: {Math.round(surface.foil.intensity)}%
              </Label>
              <Slider
                value={[surface.foil.intensity]}
                onValueChange={([value]) => updateFoil({ intensity: value })}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Interference Patterns */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-white font-medium">Interference Patterns</h4>
          <Button
            onClick={() => updateInterference({ enabled: !surface.interference.enabled })}
            variant="outline"
            size="sm"
            className={`${
              surface.interference.enabled
                ? 'bg-crd-green text-black border-crd-green'
                : 'bg-transparent text-white border-crd-mediumGray'
            }`}
          >
            {surface.interference.enabled ? 'On' : 'Off'}
          </Button>
        </div>

        {surface.interference.enabled && (
          <div className="space-y-3">
            <div>
              <Label className="text-sm text-crd-lightGray mb-2 block">
                Wave Frequency: {surface.interference.frequency}
              </Label>
              <Slider
                value={[surface.interference.frequency]}
                onValueChange={([value]) => updateInterference({ frequency: value })}
                min={1}
                max={20}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <Label className="text-sm text-crd-lightGray mb-2 block">
                Wave Amplitude: {surface.interference.amplitude}%
              </Label>
              <Slider
                value={[surface.interference.amplitude]}
                onValueChange={([value]) => updateInterference({ amplitude: value })}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
