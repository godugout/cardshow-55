
import type { Card } from '@/types/cardshow';

export const mockCards: Card[] = [
  {
    id: '1',
    name: 'Lightning Dragon',
    image: '/lovable-uploads/069c8fac-95c2-4bdf-8e53-f3a732cd5b41.png',
    rarity: 'legendary',
    type: 'Dragon',
    stats: { attack: 95, defense: 80, speed: 90 },
    description: 'A majestic dragon that commands the power of storms.'
  },
  {
    id: '2',
    name: 'Forest Guardian',
    image: '/lovable-uploads/22ce728b-dbf0-4534-8ee2-2c79bbe6c0de.png',
    rarity: 'epic',
    type: 'Beast',
    stats: { attack: 70, defense: 95, speed: 60 },
    description: 'Ancient protector of the woodland realm.'
  },
  {
    id: '3',
    name: 'Crystal Mage',
    image: '/lovable-uploads/2406a214-0403-4ff0-af81-3aae1a790c62.png',
    rarity: 'rare',
    type: 'Wizard',
    stats: { attack: 85, defense: 65, speed: 75 },
    description: 'Harnesses the power of magical crystals.'
  },
  {
    id: '4',
    name: 'Shadow Warrior',
    image: '/lovable-uploads/25cbcac9-64c0-4969-9baa-7a3fdf9eb00a.png',
    rarity: 'epic',
    type: 'Fighter',
    stats: { attack: 88, defense: 70, speed: 85 },
    description: 'Master of stealth and dark combat arts.'
  },
  {
    id: '5',
    name: 'Fire Sprite',
    image: '/lovable-uploads/356f5580-958c-4da6-9c36-b9931367a794.png',
    rarity: 'common',
    type: 'Elemental',
    stats: { attack: 55, defense: 40, speed: 80 },
    description: 'Small but fierce creature of flame.'
  },
  {
    id: '6',
    name: 'Ice Phoenix',
    image: '/lovable-uploads/49889392-623d-4c17-9677-1b076902479a.png',
    rarity: 'legendary',
    type: 'Phoenix',
    stats: { attack: 90, defense: 85, speed: 95 },
    description: 'Reborn from the eternal frost, this phoenix commands ice.'
  }
];
