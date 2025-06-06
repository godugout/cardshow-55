
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Palette, Zap, Layers, Eye, EyeOff } from 'lucide-react';
import { ENHANCED_VISUAL_EFFECTS } from '../hooks/effects/effectConfigs';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface EnhancedEffectsListProps {
  effectValues: EffectValues;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  selectedPresetId?: string;
  searchQuery?: string;
}

const EFFECT_EMOJIS: Record<string, string> = {
  holographic: '🌈',
  chrome: '🪞',
  crystal: '💎',
  gold: '🏆',
  vintage: '📜',
  aurora: '🌌',
  waves: '🌊',
  interference: '🫧',
  prizm: '🔮',
  brushedmetal: '⚙️',
  foilspray: '✨',
  ice: '❄️',
  lunar: '🌙'
};

const CATEGORY_INFO = {
  prismatic: { name: 'Holographic & Light', icon: Palette, color: 'text-purple-500' },
  metallic: { name: 'Metallic Finishes', icon: Zap, color: 'text-blue-500' },
  surface: { name: 'Surface Effects', icon: Layers, color: 'text-green-500' },
  vintage: { name: 'Vintage & Classic', icon: Eye, color: 'text-amber-500' }
};

export const EnhancedEffectsList: React.FC<EnhancedEffectsListProps> = ({
  effectValues,
  onEffectChange,
  selectedPresetId,
  searchQuery = ''
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['prismatic']));
  const [showOnlyActive, setShowOnlyActive] = useState(false);

  // Group effects by category
  const effectsByCategory = useMemo(() => {
    const grouped = ENHANCED_VISUAL_EFFECTS.reduce((acc, effect) => {
      if (!acc[effect.category]) {
        acc[effect.category] = [];
      }
      acc[effect.category].push(effect);
      return acc;
    }, {} as Record<string, typeof ENHANCED_VISUAL_EFFECTS>);

    // Filter by search query
    if (searchQuery) {
      Object.keys(grouped).forEach(category => {
        grouped[category] = grouped[category].filter(effect =>
          effect.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          effect.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    return grouped;
  }, [searchQuery]);

  // Get active effects
  const activeEffects = useMemo(() => {
    return Object.entries(effectValues).filter(([_, params]) => 
      params && typeof params === 'object' && 'intensity' in params && 
      typeof params.intensity === 'number' && params.intensity > 0
    );
  }, [effectValues]);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getEffectIntensity = (effectId: string): number => {
    const params = effectValues[effectId];
    if (params && typeof params === 'object' && 'intensity' in params) {
      const intensity = params.intensity;
      return typeof intensity === 'number' ? intensity : 0;
    }
    return 0;
  };

  const isEffectActive = (effectId: string): boolean => {
    return getEffectIntensity(effectId) > 0;
  };

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium text-sm">Effects Library</h4>
        <Button
          onClick={() => setShowOnlyActive(!showOnlyActive)}
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
        >
          {showOnlyActive ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
          {showOnlyActive ? 'All' : 'Active'}
        </Button>
      </div>

      {/* Active Effects Section */}
      {activeEffects.length > 0 && !showOnlyActive && (
        <div className="space-y-2">
          <h5 className="text-crd-green font-medium text-xs uppercase tracking-wide">
            Active Effects ({activeEffects.length})
          </h5>
          <div className="space-y-1">
            {activeEffects.map(([effectId]) => {
              const effect = ENHANCED_VISUAL_EFFECTS.find(e => e.id === effectId);
              if (!effect) return null;

              const intensity = getEffectIntensity(effectId);
              const emoji = EFFECT_EMOJIS[effectId] || '⚡';

              return (
                <div
                  key={effectId}
                  className="flex items-center justify-between p-2 rounded bg-crd-green/10 border border-crd-green/30"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{emoji}</span>
                    <span className="text-white text-sm font-medium">{effect.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-crd-green text-xs">{Math.round(intensity)}%</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={intensity}
                      onChange={(e) => onEffectChange(effectId, 'intensity', parseInt(e.target.value))}
                      className="w-16 h-1 accent-crd-green"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Effects by Category */}
      {Object.entries(effectsByCategory).map(([category, effects]) => {
        if (effects.length === 0) return null;
        if (showOnlyActive && !effects.some(e => isEffectActive(e.id))) return null;

        const categoryInfo = CATEGORY_INFO[category as keyof typeof CATEGORY_INFO];
        const isExpanded = expandedCategories.has(category);
        const activeCount = effects.filter(e => isEffectActive(e.id)).length;

        return (
          <Collapsible key={category} open={isExpanded} onOpenChange={() => toggleCategory(category)}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-2 h-auto text-left hover:bg-white/5"
              >
                <div className="flex items-center space-x-2">
                  {categoryInfo && <categoryInfo.icon className={`w-4 h-4 ${categoryInfo.color}`} />}
                  <span className="text-white font-medium text-sm">
                    {categoryInfo?.name || category}
                  </span>
                  {activeCount > 0 && (
                    <Badge variant="outline" className="text-xs px-1 py-0 h-4 bg-crd-green/20 border-crd-green text-crd-green">
                      {activeCount}
                    </Badge>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`} />
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-2 mt-2">
              {effects.map((effect) => {
                if (showOnlyActive && !isEffectActive(effect.id)) return null;

                const intensity = getEffectIntensity(effect.id);
                const isActive = intensity > 0;
                const emoji = EFFECT_EMOJIS[effect.id] || '⚡';

                return (
                  <div
                    key={effect.id}
                    className={`p-3 rounded-lg border transition-all ${
                      isActive 
                        ? 'border-crd-green bg-crd-green/10' 
                        : 'border-editor-border bg-editor-tool hover:border-crd-green/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{emoji}</span>
                        <span className="text-white font-medium text-sm">{effect.name}</span>
                        {isActive && (
                          <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                            {Math.round(intensity)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-crd-lightGray text-xs mb-3">{effect.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-crd-lightGray text-xs">Intensity</span>
                        <span className="text-white text-xs">{Math.round(intensity)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={intensity}
                        onChange={(e) => onEffectChange(effect.id, 'intensity', parseInt(e.target.value))}
                        className="w-full h-1 accent-crd-green"
                      />
                    </div>
                  </div>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
};
