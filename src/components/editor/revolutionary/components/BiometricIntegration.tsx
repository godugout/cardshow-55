import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Heart, Activity, Brain, Zap, AlertTriangle } from 'lucide-react';
import { BiometricTrigger } from '@/types/interactiveCard';

interface BiometricIntegrationProps {
  triggers: BiometricTrigger[];
  onUpdate: (triggers: BiometricTrigger[]) => void;
}

export const BiometricIntegration: React.FC<BiometricIntegrationProps> = ({
  triggers,
  onUpdate
}) => {
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const biometricTypes = [
    { id: 'heartbeat', name: 'Heart Rate', icon: Heart, unit: 'BPM', min: 40, max: 200 },
    { id: 'breathing', name: 'Breathing Rate', icon: Activity, unit: 'BPM', min: 8, max: 30 },
    { id: 'stress_level', name: 'Stress Level', icon: Brain, unit: '%', min: 0, max: 100 },
    { id: 'activity_level', name: 'Activity Level', icon: Zap, unit: '%', min: 0, max: 100 }
  ];

  const createBiometricTrigger = (type: string) => {
    const typeData = biometricTypes.find(t => t.id === type);
    if (!typeData) return;

    const newTrigger: BiometricTrigger = {
      id: `biometric_${Date.now()}`,
      type: type as any,
      threshold_low: typeData.min + (typeData.max - typeData.min) * 0.3,
      threshold_high: typeData.min + (typeData.max - typeData.min) * 0.7,
      actions_on_trigger: [{
        id: `action_${Date.now()}`,
        type: 'particle_effect',
        parameters: { type: 'heartbeat_glow', intensity: 0.8 }
      }]
    };

    onUpdate([...triggers, newTrigger]);
    setSelectedTrigger(newTrigger.id);
    setIsCreating(false);
  };

  const updateTrigger = (triggerId: string, updates: Partial<BiometricTrigger>) => {
    onUpdate(triggers.map(trigger =>
      trigger.id === triggerId ? { ...trigger, ...updates } : trigger
    ));
  };

  const removeTrigger = (triggerId: string) => {
    onUpdate(triggers.filter(trigger => trigger.id !== triggerId));
    setSelectedTrigger(null);
  };

  const selectedTriggerData = triggers.find(t => t.id === selectedTrigger);
  const selectedTypeData = selectedTriggerData 
    ? biometricTypes.find(t => t.id === selectedTriggerData.type)
    : null;

  return (
    <div className="space-y-4">
      <Card className="bg-crd-darker/80 border-crd-mediumGray/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-crd-white text-base flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Biometric Integration
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
          <div className="mb-4 p-3 bg-crd-orange/10 border border-crd-orange/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-crd-orange" />
              <span className="text-crd-white text-sm font-medium">Privacy Notice</span>
            </div>
            <p className="text-crd-lightGray text-xs">
              Biometric features require user permission and only work on supported devices. 
              Data is processed locally and never stored.
            </p>
          </div>

          {isCreating && (
            <div className="mb-4 p-3 bg-crd-green/10 border border-crd-green/30 rounded-lg">
              <h4 className="text-crd-white text-sm font-medium mb-3">Choose Biometric Trigger</h4>
              <div className="grid grid-cols-1 gap-2">
                {biometricTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => createBiometricTrigger(type.id)}
                      className="p-2 bg-crd-mediumGray/20 hover:bg-crd-mediumGray/40 rounded-lg transition-colors text-left"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-crd-green" />
                        <div>
                          <div className="text-sm text-crd-white">{type.name}</div>
                          <div className="text-xs text-crd-lightGray">
                            Range: {type.min}-{type.max} {type.unit}
                          </div>
                        </div>
                      </div>
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

          {triggers.length === 0 && !isCreating ? (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 mx-auto mb-4 text-crd-lightGray opacity-50" />
              <p className="text-crd-lightGray text-sm mb-4">No biometric triggers set</p>
              <CRDButton onClick={() => setIsCreating(true)} variant="primary" size="sm">
                Add Biometric Response
              </CRDButton>
            </div>
          ) : (
            <div className="space-y-2">
              {triggers.map((trigger) => {
                const typeData = biometricTypes.find(t => t.id === trigger.type);
                const Icon = typeData?.icon || Heart;
                return (
                  <div
                    key={trigger.id}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedTrigger === trigger.id
                        ? 'bg-crd-green/10 border-crd-green/50'
                        : 'bg-crd-mediumGray/10 border-crd-mediumGray/30 hover:border-crd-green/30'
                    }`}
                    onClick={() => setSelectedTrigger(trigger.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-crd-green" />
                        <span className="text-crd-white text-sm">{typeData?.name}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTrigger(trigger.id);
                        }}
                        className="text-crd-lightGray hover:text-crd-red"
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="text-xs text-crd-lightGray">
                      Triggers when {trigger.threshold_low}-{trigger.threshold_high} {typeData?.unit}
                      • {trigger.actions_on_trigger.length} actions
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedTriggerData && selectedTypeData && (
        <Card className="bg-crd-darker/80 border-crd-mediumGray/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-crd-white text-base">
              Configure {selectedTypeData.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-crd-lightGray text-sm mb-2 block">
                Low Threshold ({selectedTypeData.unit})
              </label>
              <Slider
                value={[selectedTriggerData.threshold_low]}
                onValueChange={([value]) => updateTrigger(selectedTriggerData.id, { threshold_low: value })}
                min={selectedTypeData.min}
                max={selectedTypeData.max}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-crd-lightGray mt-1">
                {selectedTriggerData.threshold_low} {selectedTypeData.unit}
              </div>
            </div>

            <div>
              <label className="text-crd-lightGray text-sm mb-2 block">
                High Threshold ({selectedTypeData.unit})
              </label>
              <Slider
                value={[selectedTriggerData.threshold_high]}
                onValueChange={([value]) => updateTrigger(selectedTriggerData.id, { threshold_high: value })}
                min={selectedTypeData.min}
                max={selectedTypeData.max}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-crd-lightGray mt-1">
                {selectedTriggerData.threshold_high} {selectedTypeData.unit}
              </div>
            </div>

            <div className="p-3 bg-crd-blue/10 border border-crd-blue/30 rounded-lg">
              <h4 className="text-crd-white text-sm font-medium mb-2">Trigger Actions</h4>
              <div className="space-y-2">
                {selectedTriggerData.actions_on_trigger.map((action, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-crd-lightGray capitalize">
                      {action.type.replace('_', ' ')}
                    </span>
                    <span className="text-crd-green">
                      {action.parameters.type || 'Default'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};