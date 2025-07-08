import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Sparkles, Flame, Droplets, Zap as Lightning, Snowflake, Wind } from 'lucide-react';
import { ParticleSystemConfig } from '@/types/interactiveCard';

interface ParticleSystemDesignerProps {
  systems: ParticleSystemConfig[];
  onUpdate: (systems: ParticleSystemConfig[]) => void;
}

export const ParticleSystemDesigner: React.FC<ParticleSystemDesignerProps> = ({
  systems,
  onUpdate
}) => {
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const presetTypes = [
    { id: 'fire', name: 'Fire', icon: Flame, color: '#ff4444' },
    { id: 'water', name: 'Water', icon: Droplets, color: '#4488ff' },
    { id: 'lightning', name: 'Lightning', icon: Lightning, color: '#ffff44' },
    { id: 'sparkles', name: 'Sparkles', icon: Sparkles, color: '#ff88ff' },
    { id: 'snow', name: 'Snow', icon: Snowflake, color: '#aaffff' },
    { id: 'smoke', name: 'Smoke', icon: Wind, color: '#888888' }
  ];

  const createParticleSystem = (type: string) => {
    const presets = {
      fire: {
        emission_rate: 50,
        particle_count: 100,
        lifetime: 2000,
        size: { min: 2, max: 8 },
        velocity: { min: 20, max: 40 },
        direction: { x: 0, y: -1 },
        gravity: -0.1,
        color_start: '#ff4444',
        color_end: '#ffaa00'
      },
      water: {
        emission_rate: 30,
        particle_count: 80,
        lifetime: 3000,
        size: { min: 1, max: 4 },
        velocity: { min: 10, max: 30 },
        direction: { x: 0, y: 1 },
        gravity: 0.2,
        color_start: '#4488ff',
        color_end: '#88ccff'
      },
      lightning: {
        emission_rate: 10,
        particle_count: 20,
        lifetime: 500,
        size: { min: 3, max: 12 },
        velocity: { min: 50, max: 100 },
        direction: { x: 0, y: 0 },
        gravity: 0,
        color_start: '#ffff44',
        color_end: '#ffffff'
      },
      sparkles: {
        emission_rate: 25,
        particle_count: 50,
        lifetime: 1500,
        size: { min: 1, max: 3 },
        velocity: { min: 5, max: 20 },
        direction: { x: 0, y: 0 },
        gravity: 0,
        color_start: '#ff88ff',
        color_end: '#ffddff'
      }
    };

    const preset = presets[type as keyof typeof presets] || presets.sparkles;
    
    const newSystem: ParticleSystemConfig = {
      id: `particle_${Date.now()}`,
      type: type as any,
      blend_mode: 'normal',
      physics_enabled: true,
      ...preset
    };

    onUpdate([...systems, newSystem]);
    setSelectedSystem(newSystem.id);
    setIsCreating(false);
  };

  const updateSystem = (systemId: string, updates: Partial<ParticleSystemConfig>) => {
    onUpdate(systems.map(system =>
      system.id === systemId ? { ...system, ...updates } : system
    ));
  };

  const removeSystem = (systemId: string) => {
    onUpdate(systems.filter(system => system.id !== systemId));
    setSelectedSystem(null);
  };

  const selectedSystemData = systems.find(s => s.id === selectedSystem);

  return (
    <div className="space-y-4">
      <Card className="bg-crd-darker/80 border-crd-mediumGray/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-crd-white text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Particle Systems
            </CardTitle>
            <CRDButton
              onClick={() => setIsCreating(true)}
              variant="secondary"
              size="sm"
            >
              <Plus className="w-4 h-4" />
            </CRDButton>
          </div>
        </CardHeader>
        <CardContent>
          {isCreating && (
            <div className="mb-4 p-3 bg-crd-green/10 border border-crd-green/30 rounded-lg">
              <h4 className="text-crd-white text-sm font-medium mb-3">Choose Particle Type</h4>
              <div className="grid grid-cols-2 gap-2">
                {presetTypes.map((preset) => {
                  const Icon = preset.icon;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => createParticleSystem(preset.id)}
                      className="p-2 bg-crd-mediumGray/20 hover:bg-crd-mediumGray/40 rounded-lg transition-colors"
                    >
                      <Icon className="w-4 h-4 mx-auto mb-1" style={{ color: preset.color }} />
                      <div className="text-xs text-crd-white">{preset.name}</div>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2 mt-3">
                <CRDButton onClick={() => setIsCreating(false)} variant="secondary" size="sm">
                  Cancel
                </CRDButton>
              </div>
            </div>
          )}

          {systems.length === 0 && !isCreating ? (
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-crd-lightGray opacity-50" />
              <p className="text-crd-lightGray text-sm mb-4">No particle systems yet</p>
              <CRDButton onClick={() => setIsCreating(true)} variant="primary" size="sm">
                Add Particles
              </CRDButton>
            </div>
          ) : (
            <div className="space-y-2">
              {systems.map((system) => {
                const preset = presetTypes.find(p => p.id === system.type);
                const Icon = preset?.icon || Sparkles;
                return (
                  <div
                    key={system.id}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedSystem === system.id
                        ? 'bg-crd-green/10 border-crd-green/50'
                        : 'bg-crd-mediumGray/10 border-crd-mediumGray/30 hover:border-crd-green/30'
                    }`}
                    onClick={() => setSelectedSystem(system.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon 
                          className="w-4 h-4" 
                          style={{ color: preset?.color || '#ffffff' }} 
                        />
                        <span className="text-crd-white text-sm capitalize">{system.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-crd-lightGray">
                          {system.particle_count} particles
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSystem(system.id);
                          }}
                          className="text-crd-lightGray hover:text-crd-red"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedSystemData && (
        <Card className="bg-crd-darker/80 border-crd-mediumGray/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-crd-white text-base">Particle Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-crd-lightGray text-sm mb-2 block">Emission Rate</label>
              <Slider
                value={[selectedSystemData.emission_rate]}
                onValueChange={([value]) => updateSystem(selectedSystemData.id, { emission_rate: value })}
                min={1}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-crd-lightGray mt-1">
                {selectedSystemData.emission_rate} particles/sec
              </div>
            </div>

            <div>
              <label className="text-crd-lightGray text-sm mb-2 block">Particle Count</label>
              <Slider
                value={[selectedSystemData.particle_count]}
                onValueChange={([value]) => updateSystem(selectedSystemData.id, { particle_count: value })}
                min={10}
                max={500}
                step={10}
                className="w-full"
              />
              <div className="text-xs text-crd-lightGray mt-1">
                {selectedSystemData.particle_count} max particles
              </div>
            </div>

            <div>
              <label className="text-crd-lightGray text-sm mb-2 block">Lifetime</label>
              <Slider
                value={[selectedSystemData.lifetime]}
                onValueChange={([value]) => updateSystem(selectedSystemData.id, { lifetime: value })}
                min={100}
                max={5000}
                step={100}
                className="w-full"
              />
              <div className="text-xs text-crd-lightGray mt-1">
                {selectedSystemData.lifetime}ms
              </div>
            </div>

            <div>
              <label className="text-crd-lightGray text-sm mb-2 block">Blend Mode</label>
              <Select
                value={selectedSystemData.blend_mode}
                onValueChange={(value: any) => updateSystem(selectedSystemData.id, { blend_mode: value })}
              >
                <SelectTrigger className="bg-crd-darkest/80 border-crd-mediumGray/40 text-crd-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-crd-darker border-crd-mediumGray/40">
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="multiply">Multiply</SelectItem>
                  <SelectItem value="screen">Screen</SelectItem>
                  <SelectItem value="overlay">Overlay</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};