
import type { CardRarityConfig } from '../types/cardTypes';

export const CARD_RARITIES: Record<string, CardRarityConfig> = {
  common: {
    value: 'common',
    label: 'Common',
    color: '#9CA3AF',
    gradient: 'from-gray-400 to-gray-500',
    glow: 'shadow-gray-400/20',
    border: 'border-gray-400',
    effect: 'matte'
  },
  uncommon: {
    value: 'uncommon',
    label: 'Uncommon',
    color: '#10B981',
    gradient: 'from-green-400 to-green-600',
    glow: 'shadow-green-400/30',
    border: 'border-green-400'
  },
  rare: {
    value: 'rare',
    label: 'Rare',
    color: '#3B82F6',
    gradient: 'from-blue-400 to-blue-600',
    glow: 'shadow-blue-400/40',
    border: 'border-blue-400',
    effect: 'foil'
  },
  epic: {
    value: 'epic',
    label: 'Epic',
    color: '#8B5CF6',
    gradient: 'from-purple-400 to-purple-600',
    glow: 'shadow-purple-400/50',
    border: 'border-purple-400',
    effect: 'holographic'
  },
  legendary: {
    value: 'legendary',
    label: 'Legendary',
    color: '#F59E0B',
    gradient: 'from-amber-400 to-orange-500',
    glow: 'shadow-amber-400/60',
    border: 'border-amber-400',
    effect: 'chrome'
  },
  mythic: {
    value: 'mythic',
    label: 'Mythic',
    color: '#EF4444',
    gradient: 'from-red-400 via-pink-500 to-purple-600',
    glow: 'shadow-red-400/70',
    border: 'border-red-400',
    effect: 'holographic'
  }
};

export const getRarityConfig = (rarity: string): CardRarityConfig => {
  return CARD_RARITIES[rarity] || CARD_RARITIES.common;
};
