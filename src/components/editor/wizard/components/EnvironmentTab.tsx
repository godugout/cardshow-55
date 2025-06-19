
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Camera, Globe, Sparkles, RotateCw } from 'lucide-react';

interface EnvironmentTabProps {
  lighting: {
    environment: string;
  };
  physics: {
    float: number;
    autoRotate: boolean;
    gravity: number;
  };
  onLightingUpdate: (lighting: Partial<EnvironmentTabProps['lighting']>) => void;
  onPhysicsUpdate: (physics: Partial<EnvironmentTabProps['physics']>) => void;
}

const ENVIRONMENTS = [
  { id: 'studio', name: 'Studio', description: 'Clean studio backdrop', preview: '🎬' },
  { id: 'gallery', name: 'Gallery', description: 'Art gallery setting', preview: '🖼️' },
  { id: 'crystal', name: 'Crystal Caverns', description: 'Mystical crystal cave', preview: '💎' },
  { id: 'cosmic', name: 'Cosmic Space', description: 'Deep space environment', preview: '🌌' },
  { id: 'neon', name: 'Neon City', description: 'Cyberpunk cityscape', preview: '🌃' },
  { id: 'nature', name: 'Nature', description: 'Natural outdoor setting', preview: '🌿' }
];

export const EnvironmentTab = ({ 
  lighting, 
  physics, 
  onLightingUpdate, 
  onPhysicsUpdate 
}: EnvironmentTabProps) => {
  const updatePhysicsProperty = (property: keyof typeof physics, value: number | boolean) => {
    onPhysicsUpdate({ [property]: value });
  };

  return (
    <div className="space-y-6">
      {/* Environment Selection */}
      <div>
        <h4 className="text-white font-medium mb-3">Environment Scene</h4>
        <div className="grid grid-cols-2 gap-2">
          {ENVIRONMENTS.map((env) => {
            const isActive = lighting.environment === env.id;
            
            return (
              <button
                key={env.id}
                onClick={() => onLightingUpdate({ environment: env.id })}
                className={`p-2 rounded border text-left transition-all ${
                  isActive
                    ? 'border-crd-green bg-crd-green/10 text-white'
                    : 'border-crd-mediumGray bg-crd-mediumGray/10 text-crd-lightGray hover:border-crd-green hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{env.preview}</span>
                  <span className="font-medium text-xs">{env.name}</span>
                </div>
                <p className="text-xs opacity-75">{env.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Physics Controls */}
      <div className="space-y-4">
        <h4 className="text-white font-medium">Physics & Animation</h4>
        
        <div className="space-y-3">
          <div>
            <Label className="text-sm text-crd-lightGray mb-2 block">
              Float Intensity: {Math.round(physics.float)}%
            </Label>
            <Slider
              value={[physics.float]}
              onValueChange={([value]) => updatePhysicsProperty('float', value)}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm text-crd-lightGray mb-2 block">
              Gravity Effect: {Math.round(physics.gravity)}%
            </Label>
            <Slider
              value={[physics.gravity]}
              onValueChange={([value]) => updatePhysicsProperty('gravity', value)}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        </div>

        {/* Auto Rotate Toggle */}
        <div className="flex items-center justify-between p-3 bg-crd-mediumGray/20 rounded-lg">
          <div className="flex items-center gap-2">
            <RotateCw className="w-4 h-4 text-crd-lightGray" />
            <div>
              <Label className="text-white font-medium">Auto Rotate</Label>
              <p className="text-xs text-crd-lightGray">Continuous rotation</p>
            </div>
          </div>
          <Button
            onClick={() => updatePhysicsProperty('autoRotate', !physics.autoRotate)}
            variant="outline"
            size="sm"
            className={`${
              physics.autoRotate
                ? 'bg-crd-green text-black border-crd-green'
                : 'bg-transparent text-white border-crd-mediumGray'
            }`}
          >
            {physics.autoRotate ? 'On' : 'Off'}
          </Button>
        </div>
      </div>
    </div>
  );
};
