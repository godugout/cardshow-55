
import type { CardData } from '@/hooks/useCardEditor';

export const mockCards: CardData[] = [
  {
    id: '1',
    title: 'Legendary Dragon',
    description: 'A rare and powerful dragon card with mystical abilities',
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80',
    rarity: 'legendary',
    category: 'fantasy',
    tags: ['dragon', 'fire', 'legendary'],
    design_metadata: {},
    visibility: 'public',
    effects: {
      holographic: true,
      foil: false,
      chrome: false
    },
    creator_attribution: {
      collaboration_type: 'solo'
    },
    publishing_options: {
      marketplace_listing: false,
      crd_catalog_inclusion: true,
      print_available: false,
      pricing: { currency: 'USD' },
      distribution: { limited_edition: false }
    }
  },
  {
    id: '2',
    title: 'Crystal Warrior',
    description: 'A mystical warrior forged from pure crystal',
    image_url: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&q=80',
    rarity: 'rare',
    category: 'fantasy',
    tags: ['warrior', 'crystal', 'magic'],
    design_metadata: {},
    visibility: 'public',
    effects: {
      holographic: false,
      foil: true,
      chrome: false
    },
    creator_attribution: {
      collaboration_type: 'solo'
    },
    publishing_options: {
      marketplace_listing: false,
      crd_catalog_inclusion: true,
      print_available: false,
      pricing: { currency: 'USD' },
      distribution: { limited_edition: false }
    }
  },
  {
    id: '3',
    title: 'Space Explorer',
    description: 'A brave explorer venturing into the unknown cosmos',
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
    rarity: 'uncommon',
    category: 'sci-fi',
    tags: ['space', 'explorer', 'adventure'],
    design_metadata: {},
    visibility: 'public',
    effects: {
      holographic: false,
      foil: false,
      chrome: true
    },
    creator_attribution: {
      collaboration_type: 'solo'
    },
    publishing_options: {
      marketplace_listing: false,
      crd_catalog_inclusion: true,
      print_available: false,
      pricing: { currency: 'USD' },
      distribution: { limited_edition: false }
    }
  },
  {
    id: '4',
    title: 'Neon Samurai',
    description: 'A cyberpunk warrior wielding ancient techniques in a digital world',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    rarity: 'epic',
    category: 'cyberpunk',
    tags: ['samurai', 'neon', 'cyberpunk'],
    design_metadata: {},
    visibility: 'public',
    effects: {
      holographic: true,
      foil: true,
      chrome: false
    },
    creator_attribution: {
      collaboration_type: 'solo'
    },
    publishing_options: {
      marketplace_listing: false,
      crd_catalog_inclusion: true,
      print_available: false,
      pricing: { currency: 'USD' },
      distribution: { limited_edition: false }
    }
  },
  {
    id: '5',
    title: 'Digital Phoenix',
    description: 'A majestic phoenix reborn in the digital realm',
    image_url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&q=80',
    rarity: 'legendary',
    category: 'digital',
    tags: ['phoenix', 'digital', 'rebirth'],
    design_metadata: {},
    visibility: 'public',
    effects: {
      holographic: true,
      foil: false,
      chrome: true
    },
    creator_attribution: {
      collaboration_type: 'solo'
    },
    publishing_options: {
      marketplace_listing: false,
      crd_catalog_inclusion: true,
      print_available: false,
      pricing: { currency: 'USD' },
      distribution: { limited_edition: false }
    }
  }
];
