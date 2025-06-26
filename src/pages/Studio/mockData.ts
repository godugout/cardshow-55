
import type { CardData } from '@/hooks/useCardEditor';

export const mockCards: CardData[] = [
  {
    id: 'mock-1',
    title: 'Mystic Dragon',
    description: 'A powerful dragon with ancient magic flowing through its veins.',
    image_url: '/lovable-uploads/cd4cf59d-5ff5-461d-92e9-61b6e2c63e2e.png',
    rarity: 'legendary',
    tags: ['dragon', 'magic', 'legendary'],
    design_metadata: {
      effects: {
        holographic: { intensity: 80 },
        chrome: { intensity: 60 }
      }
    },
    visibility: 'public',
    creator_attribution: {
      creator_name: 'Mock Creator',
      creator_id: 'mock-creator',
      collaboration_type: 'solo'
    },
    publishing_options: {
      marketplace_listing: true,
      crd_catalog_inclusion: true,
      print_available: true,
      pricing: {
        currency: 'USD'
      },
      distribution: {
        limited_edition: false
      }
    }
  },
  {
    id: 'mock-2',
    title: 'Crystal Guardian',
    description: 'A guardian spirit made of pure crystal energy.',
    image_url: '/lovable-uploads/49889392-623d-4c17-9677-1b076902479a.png',
    rarity: 'ultra-rare',
    tags: ['crystal', 'guardian', 'spirit'],
    design_metadata: {
      effects: {
        crystal: { intensity: 90 },
        prizm: { intensity: 70 }
      }
    },
    visibility: 'public',
    creator_attribution: {
      creator_name: 'Mock Creator',
      creator_id: 'mock-creator',
      collaboration_type: 'solo'
    },
    publishing_options: {
      marketplace_listing: true,
      crd_catalog_inclusion: true,
      print_available: true,
      pricing: {
        currency: 'USD'
      },
      distribution: {
        limited_edition: false
      }
    }
  },
  {
    id: 'mock-3',
    title: 'Shadow Assassin',
    description: 'A stealthy warrior that strikes from the darkness.',
    image_url: '/lovable-uploads/25cbcac9-64c0-4969-9baa-7a3fdf9eb00a.png',
    rarity: 'rare',
    tags: ['assassin', 'shadow', 'stealth'],
    design_metadata: {
      effects: {
        vintage: { intensity: 50 },
        gold: { intensity: 30 }
      }
    },
    visibility: 'public',
    creator_attribution: {
      creator_name: 'Mock Creator',
      creator_id: 'mock-creator',
      collaboration_type: 'solo'
    },
    publishing_options: {
      marketplace_listing: true,
      crd_catalog_inclusion: true,
      print_available: false,
      pricing: {
        currency: 'USD'
      },
      distribution: {
        limited_edition: false
      }
    }
  }
];
