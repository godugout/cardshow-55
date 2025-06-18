
import type { DesignTemplate } from '@/hooks/useCardEditor';

export const SPORTS_TEMPLATES: DesignTemplate[] = [
  {
    id: 'baseball-classic',
    name: 'Baseball Classic',
    category: 'sports',
    description: 'Traditional baseball card layout perfect for player stats',
    usage_count: 1250,
    is_premium: false,
    preview_url: '/templates/baseball-classic.jpg',
    tags: ['baseball', 'sports', 'classic', 'stats'],
    template_data: {
      colors: {
        primary: '#1e40af',
        secondary: '#ffffff',
        accent: '#dc2626',
        background: '#f8fafc',
        text: '#1f2937'
      },
      regions: {
        playerName: { x: 20, y: 20, width: 260, height: 40 },
        image: { x: 20, y: 70, width: 260, height: 180 },
        team: { x: 20, y: 260, width: 120, height: 30 },
        position: { x: 160, y: 260, width: 120, height: 30 },
        stats: { x: 20, y: 300, width: 260, height: 40 }
      },
      layout: 'portrait',
      effects: {
        borderRadius: 12,
        shadow: true,
        gradient: false
      }
    }
  },
  {
    id: 'basketball-modern',
    name: 'Basketball Modern',
    category: 'sports',
    description: 'Dynamic basketball card with action-focused design',
    usage_count: 980,
    is_premium: false,
    preview_url: '/templates/basketball-modern.jpg',
    tags: ['basketball', 'sports', 'modern', 'dynamic'],
    template_data: {
      colors: {
        primary: '#ea580c',
        secondary: '#000000',
        accent: '#f59e0b',
        background: '#0f172a',
        text: '#ffffff'
      },
      regions: {
        playerName: { x: 15, y: 15, width: 270, height: 45 },
        image: { x: 15, y: 70, width: 270, height: 200 },
        team: { x: 15, y: 280, width: 130, height: 25 },
        position: { x: 155, y: 280, width: 130, height: 25 },
        stats: { x: 15, y: 315, width: 270, height: 30 }
      },
      layout: 'portrait',
      effects: {
        borderRadius: 16,
        shadow: true,
        gradient: true
      }
    }
  },
  {
    id: 'football-pro',
    name: 'Football Pro',
    category: 'sports',
    description: 'Professional football card with team colors',
    usage_count: 1450,
    is_premium: true,
    preview_url: '/templates/football-pro.jpg',
    tags: ['football', 'sports', 'professional', 'team'],
    template_data: {
      colors: {
        primary: '#059669',
        secondary: '#ffffff',
        accent: '#fbbf24',
        background: '#064e3b',
        text: '#ffffff'
      },
      regions: {
        playerName: { x: 25, y: 25, width: 250, height: 35 },
        image: { x: 25, y: 70, width: 250, height: 170 },
        team: { x: 25, y: 250, width: 120, height: 28 },
        position: { x: 155, y: 250, width: 120, height: 28 },
        stats: { x: 25, y: 288, width: 250, height: 50 }
      },
      layout: 'portrait',
      effects: {
        borderRadius: 20,
        shadow: true,
        gradient: true
      }
    }
  },
  {
    id: 'soccer-international',
    name: 'Soccer International',
    category: 'sports',
    description: 'International soccer card with club and country stats',
    usage_count: 750,
    is_premium: false,
    preview_url: '/templates/soccer-international.jpg',
    tags: ['soccer', 'football', 'international', 'club'],
    template_data: {
      colors: {
        primary: '#7c3aed',
        secondary: '#ffffff',
        accent: '#10b981',
        background: '#1e1b4b',
        text: '#ffffff'
      },
      regions: {
        playerName: { x: 20, y: 20, width: 260, height: 40 },
        image: { x: 20, y: 70, width: 260, height: 180 },
        team: { x: 20, y: 260, width: 85, height: 25 },
        position: { x: 115, y: 260, width: 80, height: 25 },
        country: { x: 205, y: 260, width: 75, height: 25 },
        stats: { x: 20, y: 295, width: 260, height: 45 }
      },
      layout: 'portrait',
      effects: {
        borderRadius: 14,
        shadow: true,
        gradient: true
      }
    }
  }
];

export const ENTERTAINMENT_TEMPLATES: DesignTemplate[] = [
  {
    id: 'musician-spotlight',
    name: 'Musician Spotlight',
    category: 'entertainment',
    description: 'Perfect for showcasing musicians and artists',
    usage_count: 650,
    is_premium: false,
    preview_url: '/templates/musician-spotlight.jpg',
    tags: ['music', 'artist', 'entertainment', 'spotlight'],
    template_data: {
      colors: {
        primary: '#ec4899',
        secondary: '#000000',
        accent: '#fbbf24',
        background: '#1f2937',
        text: '#ffffff'
      },
      regions: {
        artistName: { x: 20, y: 20, width: 260, height: 45 },
        image: { x: 20, y: 75, width: 260, height: 180 },
        genre: { x: 20, y: 265, width: 120, height: 25 },
        label: { x: 150, y: 265, width: 130, height: 25 },
        achievements: { x: 20, y: 300, width: 260, height: 40 }
      },
      layout: 'portrait',
      effects: {
        borderRadius: 18,
        shadow: true,
        gradient: true
      }
    }
  },
  {
    id: 'actor-premiere',
    name: 'Actor Premiere',
    category: 'entertainment',
    description: 'Elegant design for actors and film personalities',
    usage_count: 420,
    is_premium: true,
    preview_url: '/templates/actor-premiere.jpg',
    tags: ['actor', 'film', 'entertainment', 'premiere'],
    template_data: {
      colors: {
        primary: '#dc2626',
        secondary: '#ffffff',
        accent: '#fbbf24',
        background: '#0f172a',
        text: '#ffffff'
      },
      regions: {
        actorName: { x: 25, y: 25, width: 250, height: 40 },
        image: { x: 25, y: 75, width: 250, height: 170 },
        genre: { x: 25, y: 255, width: 110, height: 25 },
        studio: { x: 145, y: 255, width: 130, height: 25 },
        filmography: { x: 25, y: 290, width: 250, height: 50 }
      },
      layout: 'portrait',
      effects: {
        borderRadius: 16,
        shadow: true,
        gradient: true
      }
    }
  }
];

export const ALL_TEMPLATES = [...SPORTS_TEMPLATES, ...ENTERTAINMENT_TEMPLATES];

export const getTemplatesByCategory = (category: string) => {
  switch (category) {
    case 'sports':
      return SPORTS_TEMPLATES;
    case 'entertainment':
      return ENTERTAINMENT_TEMPLATES;
    default:
      return ALL_TEMPLATES;
  }
};

export const getTemplateById = (id: string): DesignTemplate | null => {
  return ALL_TEMPLATES.find(template => template.id === id) || null;
};
