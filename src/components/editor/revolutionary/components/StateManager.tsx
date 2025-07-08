import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Slider } from '@/components/ui/slider';
import { Plus, Layers, Star, Eye, RotateCcw, Palette } from 'lucide-react';
import { CardState } from '@/types/interactiveCard';

interface StateManagerProps {
  states: CardState[];
  defaultStateId: string;
  onAddState: (state: CardState) => void;
  onUpdateState: (stateId: string, updates: Partial<CardState>) => void;
  onSetDefault: (stateId: string) => void;
}

export const StateManager: React.FC<StateManagerProps> = ({
  states,
  defaultStateId,
  onAddState,
  onUpdateState,
  onSetDefault
}) => {
  const [selectedState, setSelectedState] = useState<string | null>(defaultStateId);
  const [isCreating, setIsCreating] = useState(false);

  const createNewState = () => {
    const newState: CardState = {
      id: `state_${Date.now()}`,
      name: `State ${states.length + 1}`,
      description: '',
      visual_properties: {
        opacity: 1,
        scale: 1,
        rotation: 0,
        filter: 'none'
      },
      transition_rules: []
    };

    onAddState(newState);
    setSelectedState(newState.id);
    setIsCreating(false);
  };

  const selectedStateData = states.find(s => s.id === selectedState);

  const stateIcons = {
    default: '🏠',
    hover: '👆',
    active: '⚡',
    hidden: '👻',
    glowing: '✨',
    damaged: '💥',
    healing: '💚',
    powered: '🔋'
  };

  const getStateIcon = (stateName: string) => {
    const lowerName = stateName.toLowerCase();
    for (const [key, icon] of Object.entries(stateIcons)) {
      if (lowerName.includes(key)) return icon;
    }
    return '🎯';
  };

  return (
    <div className="space-y-4">
      <Card className="bg-crd-darker/80 border-crd-mediumGray/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-crd-white text-base flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Card States
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
              <div className="flex items-center justify-between mb-2">
                <span className="text-crd-white text-sm font-medium">Create New State</span>
                <div className="flex gap-2">
                  <CRDButton onClick={createNewState} variant="primary" size="sm">
                    Create
                  </CRDButton>
                  <CRDButton onClick={() => setIsCreating(false)} variant="secondary" size="sm">
                    Cancel
                  </CRDButton>
                </div>
              </div>
              <p className="text-crd-lightGray text-xs">
                Create different visual states for your card (hover, active, special effects, etc.)
              </p>
            </div>
          )}

          <div className="space-y-2">
            {states.map((state) => (
              <div
                key={state.id}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedState === state.id
                    ? 'bg-crd-green/10 border-crd-green/50'
                    : 'bg-crd-mediumGray/10 border-crd-mediumGray/30 hover:border-crd-green/30'
                }`}
                onClick={() => setSelectedState(state.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getStateIcon(state.name)}</span>
                    <span className="text-crd-white font-medium text-sm">{state.name}</span>
                    {state.id === defaultStateId && (
                      <Star className="w-3 h-3 text-crd-green fill-crd-green" />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetDefault(state.id);
                      }}
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        state.id === defaultStateId
                          ? 'bg-crd-green/20 text-crd-green'
                          : 'bg-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white'
                      }`}
                    >
                      Default
                    </button>
                  </div>
                </div>
                
                {state.description && (
                  <p className="text-crd-lightGray text-xs mb-2">{state.description}</p>
                )}
                
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 bg-crd-mediumGray/20 px-2 py-1 rounded">
                    <Eye className="w-3 h-3" />
                    <span className="text-crd-lightGray">
                      {Math.round((state.visual_properties.opacity || 1) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-crd-mediumGray/20 px-2 py-1 rounded">
                    <RotateCcw className="w-3 h-3" />
                    <span className="text-crd-lightGray">
                      {state.visual_properties.rotation || 0}°
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-crd-mediumGray/20 px-2 py-1 rounded">
                    <span className="text-crd-lightGray">
                      {state.transition_rules.length} rules
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {states.length === 0 && !isCreating && (
            <div className="text-center py-8">
              <Layers className="w-12 h-12 mx-auto mb-4 text-crd-lightGray opacity-50" />
              <p className="text-crd-lightGray text-sm mb-4">No states created yet</p>
              <CRDButton onClick={() => setIsCreating(true)} variant="primary" size="sm">
                Create First State
              </CRDButton>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedStateData && (
        <Card className="bg-crd-darker/80 border-crd-mediumGray/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-crd-white text-base flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Edit State: {selectedStateData.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-crd-lightGray text-sm mb-2 block">State Name</label>
              <Input
                value={selectedStateData.name}
                onChange={(e) => onUpdateState(selectedStateData.id, { name: e.target.value })}
                className="bg-crd-darkest/80 border-crd-mediumGray/40 text-crd-white"
                placeholder="State name..."
              />
            </div>

            <div>
              <label className="text-crd-lightGray text-sm mb-2 block">Description</label>
              <Textarea
                value={selectedStateData.description || ''}
                onChange={(e) => onUpdateState(selectedStateData.id, { description: e.target.value })}
                className="bg-crd-darkest/80 border-crd-mediumGray/40 text-crd-white resize-none"
                rows={2}
                placeholder="Describe this state..."
              />
            </div>

            <div>
              <label className="text-crd-lightGray text-sm mb-2 block">Opacity</label>
              <Slider
                value={[selectedStateData.visual_properties.opacity || 1]}
                onValueChange={([value]) => {
                  onUpdateState(selectedStateData.id, {
                    visual_properties: {
                      ...selectedStateData.visual_properties,
                      opacity: value
                    }
                  });
                }}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
              <div className="text-xs text-crd-lightGray mt-1">
                {Math.round((selectedStateData.visual_properties.opacity || 1) * 100)}%
              </div>
            </div>

            <div>
              <label className="text-crd-lightGray text-sm mb-2 block">Scale</label>
              <Slider
                value={[selectedStateData.visual_properties.scale || 1]}
                onValueChange={([value]) => {
                  onUpdateState(selectedStateData.id, {
                    visual_properties: {
                      ...selectedStateData.visual_properties,
                      scale: value
                    }
                  });
                }}
                min={0.1}
                max={2}
                step={0.1}
                className="w-full"
              />
              <div className="text-xs text-crd-lightGray mt-1">
                {selectedStateData.visual_properties.scale || 1}x
              </div>
            </div>

            <div>
              <label className="text-crd-lightGray text-sm mb-2 block">Rotation</label>
              <Slider
                value={[selectedStateData.visual_properties.rotation || 0]}
                onValueChange={([value]) => {
                  onUpdateState(selectedStateData.id, {
                    visual_properties: {
                      ...selectedStateData.visual_properties,
                      rotation: value
                    }
                  });
                }}
                min={-180}
                max={180}
                step={5}
                className="w-full"
              />
              <div className="text-xs text-crd-lightGray mt-1">
                {selectedStateData.visual_properties.rotation || 0}°
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};