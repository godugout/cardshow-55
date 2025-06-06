
import React, { useState } from 'react';
import { Sparkles, Zap, Sun, Palette, Eye, Waves, Moon } from 'lucide-react';
import { toast } from 'sonner';
import { EffectItem } from './EffectItem';
import { ENHANCED_VISUAL_EFFECTS } from '../../../viewer/hooks/useEnhancedCardEffects';

interface VisualEffectsListProps {
  searchQuery: string;
}

// Icon mapping for effects
const getEffectIcon = (effectId: string) => {
  const iconMap = {
    holographic: Sparkles,
    foilspray: Zap,
    prizm: Eye,
    chrome: Sun,
    interference: Sparkles,
    brushedmetal: Palette,
    crystal: Sparkles,
    vintage: Palette,
    gold: Sun,
    aurora: Sparkles,
    ice: Sparkles,
    lunar: Moon,
    waves: Waves
  };
  return iconMap[effectId] || Sparkles;
};

// Color mapping for effects
const getEffectColor = (category: string) => {
  const colorMap = {
    prismatic: 'from-purple-500 to-cyan-500',
    metallic: 'from-yellow-400 to-orange-500',
    surface: 'from-blue-500 to-green-500',
    vintage: 'from-amber-600 to-orange-600'
  };
  return colorMap[category] || 'from-gray-500 to-gray-600';
};

export const VisualEffectsList = ({ searchQuery }: VisualEffectsListProps) => {
  const [activeEffects, setActiveEffects] = useState<{[key: string]: boolean}>({});

  // Use the dynamic effects from configuration
  const effects = ENHANCED_VISUAL_EFFECTS.map(effect => ({
    id: effect.id,
    name: effect.name,
    icon: getEffectIcon(effect.id),
    color: getEffectColor(effect.category),
    description: effect.description
  }));

  const filteredEffects = effects.filter(effect => 
    effect.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEffectToggle = (effectId: string) => {
    const newState = !activeEffects[effectId];
    setActiveEffects(prev => ({ ...prev, [effectId]: newState }));
    
    window.dispatchEvent(new CustomEvent('effectChange', {
      detail: { effectType: effectId, enabled: newState }
    }));
    
    toast.success(`${effects.find(e => e.id === effectId)?.name} ${newState ? 'enabled' : 'disabled'}`);
  };

  const handleIntensityChange = (effectId: string, intensity: number) => {
    window.dispatchEvent(new CustomEvent('effectChange', {
      detail: { effectType: `${effectId}Intensity`, value: intensity }
    }));
  };

  return (
    <div className="space-y-4">
      <h4 className="text-white font-medium text-sm uppercase tracking-wide">Visual Effects</h4>
      <div className="space-y-3">
        {filteredEffects.map((effect) => (
          <EffectItem
            key={effect.id}
            id={effect.id}
            name={effect.name}
            icon={effect.icon}
            color={effect.color}
            description={effect.description}
            isActive={activeEffects[effect.id] || false}
            onToggle={handleEffectToggle}
            onIntensityChange={handleIntensityChange}
          />
        ))}
      </div>
    </div>
  );
};
