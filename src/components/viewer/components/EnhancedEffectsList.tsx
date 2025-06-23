
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Chrome, Gem, Clock } from 'lucide-react';
import { ENHANCED_VISUAL_EFFECTS } from '../hooks/effects/effectConfigs';
import type { EffectValues } from '../hooks/effects/types';

interface EnhancedEffectsListProps {
  effectValues: EffectValues;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  searchQuery?: string;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'prismatic': return Sparkles;
    case 'metallic': return Chrome;
    case 'surface': return Gem;
    case 'vintage': return Clock;
    default: return Sparkles;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'prismatic': return 'text-purple-400';
    case 'metallic': return 'text-yellow-400';
    case 'surface': return 'text-blue-400';
    case 'vintage': return 'text-orange-400';
    default: return 'text-gray-400';
  }
};

export const EnhancedEffectsList: React.FC<EnhancedEffectsListProps> = ({
  effectValues,
  onEffectChange,
  searchQuery = ''
}) => {
  const filteredEffects = ENHANCED_VISUAL_EFFECTS.filter(effect =>
    effect.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    effect.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedEffects = filteredEffects.reduce((acc, effect) => {
    if (!acc[effect.category]) {
      acc[effect.category] = [];
    }
    acc[effect.category].push(effect);
    return acc;
  }, {} as Record<string, typeof filteredEffects>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedEffects).map(([category, effects]) => {
        const Icon = getCategoryIcon(category);
        const colorClass = getCategoryColor(category);
        
        return (
          <div key={category} className="space-y-3">
            <div className="flex items-center space-x-2">
              <Icon className={`w-4 h-4 ${colorClass}`} />
              <h4 className="text-white font-medium capitalize">{category} Effects</h4>
              <Badge variant="outline" className="text-xs">
                {effects.length}
              </Badge>
            </div>
            
            <div className="space-y-4">
              {effects.map(effect => {
                const effectData = effectValues[effect.id] || {};
                const intensity = typeof effectData.intensity === 'number' ? effectData.intensity : 0;
                const isActive = intensity > 0;
                
                return (
                  <div
                    key={effect.id}
                    className={`p-4 rounded-lg border transition-all ${
                      isActive 
                        ? 'bg-white/5 border-crd-green/50' 
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{effect.name}</span>
                          {!effect.mobileSupported && (
                            <Badge variant="secondary" className="text-xs">Desktop Only</Badge>
                          )}
                          <Badge 
                            variant={effect.performanceImpact === 'high' ? 'destructive' : 
                                   effect.performanceImpact === 'medium' ? 'secondary' : 'outline'}
                            className="text-xs"
                          >
                            {effect.performanceImpact} impact
                          </Badge>
                        </div>
                      </div>
                      <Switch
                        checked={isActive}
                        onCheckedChange={(checked) => 
                          onEffectChange(effect.id, 'intensity', checked ? 50 : 0)
                        }
                      />
                    </div>
                    
                    <p className="text-crd-lightGray text-sm mb-4">{effect.description}</p>
                    
                    {/* Parameters */}
                    {isActive && (
                      <div className="space-y-3">
                        {effect.parameters.map(param => {
                          const value = effectData[param.id] ?? param.defaultValue;
                          
                          if (param.type === 'slider') {
                            return (
                              <div key={param.id} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label className="text-white text-sm">{param.name}</Label>
                                  <span className="text-crd-lightGray text-xs">
                                    {typeof value === 'number' ? Math.round(value) : value}
                                    {param.id.includes('direction') ? '°' : 
                                     param.id === 'intensity' ? '%' : ''}
                                  </span>
                                </div>
                                <Slider
                                  value={[value as number]}
                                  onValueChange={([newValue]) => onEffectChange(effect.id, param.id, newValue)}
                                  min={param.min || 0}
                                  max={param.max || 100}
                                  step={param.step || 1}
                                  className="w-full"
                                />
                              </div>
                            );
                          }
                          
                          if (param.type === 'toggle') {
                            return (
                              <div key={param.id} className="flex items-center justify-between">
                                <Label className="text-white text-sm">{param.name}</Label>
                                <Switch
                                  checked={value as boolean}
                                  onCheckedChange={(checked) => onEffectChange(effect.id, param.id, checked)}
                                />
                              </div>
                            );
                          }
                          
                          return null;
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      
      {filteredEffects.length === 0 && (
        <div className="text-center py-8">
          <p className="text-crd-lightGray">No effects found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};
