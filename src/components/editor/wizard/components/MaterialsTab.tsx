
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Chrome, Gem, Circle, Square } from 'lucide-react';

interface MaterialsTabProps {
  material: {
    type: 'matte' | 'glossy' | 'satin' | 'metallic' | 'chrome' | 'glass';
    roughness: number;
    metalness: number;
    clearcoat: number;
    reflectivity: number;
    opacity: number;
  };
  onUpdate: (material: MaterialsTabProps['material']) => void;
}

const MATERIAL_PRESETS = [
  { 
    id: 'matte', 
    name: 'Matte', 
    icon: Circle,
    description: 'Non-reflective finish',
    values: { type: 'matte' as const, roughness: 0.8, metalness: 0, clearcoat: 0, reflectivity: 0.2, opacity: 1 }
  },
  { 
    id: 'glossy', 
    name: 'Glossy', 
    icon: Gem,
    description: 'High-shine finish',
    values: { type: 'glossy' as const, roughness: 0.1, metalness: 0, clearcoat: 0.8, reflectivity: 0.9, opacity: 1 }
  },
  { 
    id: 'satin', 
    name: 'Satin', 
    icon: Square,
    description: 'Semi-gloss finish',
    values: { type: 'satin' as const, roughness: 0.4, metalness: 0, clearcoat: 0.3, reflectivity: 0.6, opacity: 1 }
  },
  { 
    id: 'metallic', 
    name: 'Metallic', 
    icon: Chrome,
    description: 'Metal-like surface',
    values: { type: 'metallic' as const, roughness: 0.3, metalness: 0.8, clearcoat: 0.5, reflectivity: 0.9, opacity: 1 }
  },
  { 
    id: 'chrome', 
    name: 'Chrome', 
    icon: Chrome,
    description: 'Mirror chrome finish',
    values: { type: 'chrome' as const, roughness: 0.05, metalness: 1, clearcoat: 1, reflectivity: 1, opacity: 1 }
  },
  { 
    id: 'glass', 
    name: 'Glass', 
    icon: Gem,
    description: 'Transparent glass',
    values: { type: 'glass' as const, roughness: 0.1, metalness: 0, clearcoat: 1, reflectivity: 0.9, opacity: 0.8 }
  }
];

export const MaterialsTab = ({ material, onUpdate }: MaterialsTabProps) => {
  const updateProperty = (property: keyof typeof material, value: number | string) => {
    onUpdate({ ...material, [property]: value });
  };

  const applyPreset = (preset: typeof MATERIAL_PRESETS[0]) => {
    onUpdate({ ...material, ...preset.values });
  };

  return (
    <div className="space-y-6">
      {/* Material Presets */}
      <div>
        <h4 className="text-white font-medium mb-3">Material Presets</h4>
        <div className="grid grid-cols-2 gap-2">
          {MATERIAL_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isActive = material.type === preset.id;
            
            return (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isActive
                    ? 'border-crd-green bg-crd-green/10 text-white'
                    : 'border-crd-mediumGray bg-crd-mediumGray/10 text-crd-lightGray hover:border-crd-green hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{preset.name}</span>
                </div>
                <p className="text-xs opacity-75">{preset.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Properties */}
      <div className="space-y-4">
        <h4 className="text-white font-medium">Advanced Properties</h4>
        
        <div className="space-y-3">
          <div>
            <Label className="text-sm text-crd-lightGray mb-2 block">
              Roughness: {Math.round(material.roughness * 100)}%
            </Label>
            <Slider
              value={[material.roughness]}
              onValueChange={([value]) => updateProperty('roughness', value)}
              min={0}
              max={1}
              step={0.05}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm text-crd-lightGray mb-2 block">
              Metalness: {Math.round(material.metalness * 100)}%
            </Label>
            <Slider
              value={[material.metalness]}
              onValueChange={([value]) => updateProperty('metalness', value)}
              min={0}
              max={1}
              step={0.05}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm text-crd-lightGray mb-2 block">
              Clearcoat: {Math.round(material.clearcoat * 100)}%
            </Label>
            <Slider
              value={[material.clearcoat]}
              onValueChange={([value]) => updateProperty('clearcoat', value)}
              min={0}
              max={1}
              step={0.05}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm text-crd-lightGray mb-2 block">
              Reflectivity: {Math.round(material.reflectivity * 100)}%
            </Label>
            <Slider
              value={[material.reflectivity]}
              onValueChange={([value]) => updateProperty('reflectivity', value)}
              min={0}
              max={1}
              step={0.05}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm text-crd-lightGray mb-2 block">
              Opacity: {Math.round(material.opacity * 100)}%
            </Label>
            <Slider
              value={[material.opacity]}
              onValueChange={([value]) => updateProperty('opacity', value)}
              min={0}
              max={1}
              step={0.05}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
