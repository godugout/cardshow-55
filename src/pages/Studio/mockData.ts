import type { CardData } from '@/hooks/useCardEditor';

export const mockCards: CardData[] = [
  {
    id: 'default-card',
    title: 'Default Card',
    description: 'A plain card with no effects. Start creating!',
    rarity: 'common',
    image_url: '/lovable-uploads/25cbcac9-64c0-4969-9baa-7a3fdf9eb00a.png', // plain placeholder
    template_id: 'default',
    tags: [],
    design_metadata: {
      effects: {
        // All effects set to 0 for a clean look (matches Editor's built-in effects)
        holographic: 0,
        gold: 0,
        chrome: 0,
        refractor: 0,
        foil: 0,
        prizm: 0,
        rainbow: 0,
        black: 0,
        brushedmetal: 0,
        vintage: 0,
        interference: 0,
        foilspray: 0,
        crystal: 0,
        ice: 0,
        waves: 0,
        aurora: 0,
        lunar: 0,
      },
    },
    visibility: 'public',
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
    id: 'card-1',
    title: 'Legendary Dragon',
    description: 'A powerful ancient dragon with mystical powers',
    rarity: 'legendary',
    image_url: '/lovable-uploads/25cbcac9-64c0-4969-9baa-7a3fdf9eb00a.png',
    template_id: 'premium',
    tags: ['dragon', 'legendary', 'fire'],
    design_metadata: {
      effects: {
        holographic: 70,
        gold: 50,
        chrome: 30
      }
    },
    visibility: 'public',
    creator_attribution: {
      collaboration_type: 'solo'
    },
    publishing_options: {
      marketplace_listing: true,
      crd_catalog_inclusion: true,
      print_available: true,
      pricing: { currency: 'USD', base_price: 25 },
      distribution: { limited_edition: true, edition_size: 100 }
    }
  },
  {
    id: 'card-2',
    title: 'Mystic Warrior',
    description: 'A brave warrior wielding ancient magic',
    rarity: 'rare',
    image_url: '/lovable-uploads/4db063a6-f43a-42c6-8670-41f27f772be8.png',
    template_id: 'neon',
    tags: ['warrior', 'magic', 'rare'],
    design_metadata: {
      effects: {
        holographic: 40,
        refractor: 60,
        prizm: 30
      }
    },
    visibility: 'public',
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
    id: 'card-3',
    title: 'Forest Guardian',
    description: 'Ancient protector of the enchanted forest',
    rarity: 'uncommon',
    image_url: '/lovable-uploads/b3f6335f-9e0a-4a64-a665-15d04f456d50.png',
    template_id: 'vintage',
    tags: ['nature', 'guardian', 'forest'],
    design_metadata: {
      effects: {
        vintage: 80,
        brushedmetal: 20
      }
    },
    visibility: 'public',
    creator_attribution: {
      collaboration_type: 'solo'
    },
    publishing_options: {
      marketplace_listing: true,
      crd_catalog_inclusion: true,
      print_available: true,
      pricing: { currency: 'USD', base_price: 15 },
      distribution: { limited_edition: false }
    }
  }
];
