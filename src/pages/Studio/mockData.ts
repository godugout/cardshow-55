
import type { CardData } from '@/hooks/useCardEditor';

export const mockCards: CardData[] = [
  {
    id: 'card-1',
    title: 'LeBron James',
    description: 'Los Angeles Lakers - Forward',
    rarity: 'legendary',
    tags: ['basketball', 'nba', 'lebron', 'lakers'],
    image_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=600&fit=crop',
    design_metadata: {
      player: {
        name: 'LeBron James',
        team: 'Los Angeles Lakers',
        position: 'Forward',
        stats: {
          points: 27.2,
          rebounds: 7.5,
          assists: 7.3
        }
      },
      effects: {
        holographic: true,
        chrome: false,
        foil: true,
        intensity: 0.8
      }
    },
    visibility: 'public',
    creator_attribution: {
      creator_name: 'CRD Studio',
      creator_id: 'crd-studio-1',
      collaboration_type: 'solo'
    },
    publishing_options: {
      marketplace_listing: false,
      crd_catalog_inclusion: true,
      print_available: false,
      pricing: {
        currency: 'USD'
      },
      distribution: {
        limited_edition: false
      }
    }
  },
  {
    id: 'card-2',
    title: 'Stephen Curry',
    description: 'Golden State Warriors - Point Guard',
    rarity: 'legendary', // Changed from 'epic' to 'legendary'
    tags: ['basketball', 'nba', 'curry', 'warriors'],
    image_url: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=400&h=600&fit=crop',
    design_metadata: {
      player: {
        name: 'Stephen Curry',
        team: 'Golden State Warriors',
        position: 'Point Guard',
        stats: {
          points: 29.5,
          rebounds: 5.1,
          assists: 6.3
        }
      },
      effects: {
        holographic: false,
        chrome: true,
        foil: false,
        intensity: 0.6
      }
    },
    visibility: 'public',
    creator_attribution: {
      creator_name: 'CRD Studio',
      creator_id: 'crd-studio-1',
      collaboration_type: 'solo'
    },
    publishing_options: {
      marketplace_listing: false,
      crd_catalog_inclusion: true,
      print_available: false,
      pricing: {
        currency: 'USD'
      },
      distribution: {
        limited_edition: false
      }
    }
  },
  {
    id: 'card-3',
    title: 'Kevin Durant',
    description: 'Phoenix Suns - Forward',
    rarity: 'rare',
    tags: ['basketball', 'nba', 'durant', 'suns'],
    image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=600&fit=crop',
    design_metadata: {
      player: {
        name: 'Kevin Durant',
        team: 'Phoenix Suns',
        position: 'Forward',
        stats: {
          points: 26.8,
          rebounds: 6.7,
          assists: 5.0
        }
      },
      effects: {
        holographic: false,
        chrome: false,
        foil: true,
        intensity: 0.7
      }
    },
    visibility: 'public',
    creator_attribution: {
      creator_name: 'CRD Studio',
      creator_id: 'crd-studio-1',
      collaboration_type: 'solo'
    },
    publishing_options: {
      marketplace_listing: false,
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
