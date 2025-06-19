import type { DesignTemplate } from '@/hooks/useCardEditor';

export const ESSENTIAL_FRAMES: DesignTemplate[] = [
  {
    id: 'full-bleed',
    name: 'Full Bleed',
    description: 'Clean, edge-to-edge design with no borders',
    category: 'sports',
    is_premium: false,
    template_data: {
      layout: 'portrait',
      elements: {
        background: { type: 'solid', color: '#ffffff' },
        image: { 
          position: { x: 0, y: 0, width: 100, height: 100 },
          borderRadius: 8 
        }
      },
      colors: {
        primary: '#000000',
        secondary: '#ffffff',
        background: 'transparent'
      },
      effects: {
        borderRadius: 8,
        shadow: false
      }
    },
    usage_count: 1000,
    tags: ['clean', 'minimal', 'edge-to-edge']
  },
  {
    id: 'graded-slab-2d',
    name: 'Graded Slab (2D)',
    description: 'Professional grading slab with clean 2D design',
    category: 'sports',
    is_premium: false,
    template_data: {
      layout: 'portrait',
      elements: {
        background: { type: 'gradient', from: '#f3f4f6', to: '#e5e7eb' },
        border: { width: 2, color: '#d1d5db', style: 'solid' },
        gradeLabel: {
          position: { x: 5, y: 5 },
          text: 'CRD',
          style: { fontSize: 12, fontWeight: 'bold', color: '#ffffff', background: '#000000' }
        },
        gradeScore: {
          position: { x: 85, y: 5 },
          text: '10',
          style: { fontSize: 12, fontWeight: 'bold', color: '#000000', background: '#45B26B' }
        },
        image: {
          position: { x: 8, y: 15, width: 84, height: 60 },
          borderRadius: 4
        },
        title: {
          position: { x: 8, y: 80 },
          style: { fontSize: 10, fontWeight: 'bold', textAlign: 'center' }
        }
      },
      colors: {
        primary: '#000000',
        secondary: '#45B26B',
        background: '#f9fafb'
      },
      effects: {
        borderRadius: 8,
        shadow: true
      }
    },
    usage_count: 800,
    tags: ['graded', 'professional', 'slab', '2d']
  },
  {
    id: 'graded-slab-3d',
    name: 'Graded Slab (3D)',
    description: 'Premium 3D grading slab with depth and perspective',
    category: 'sports',
    is_premium: false,
    template_data: {
      layout: 'portrait',
      elements: {
        background: { 
          type: 'gradient', 
          from: '#f3f4f6', 
          to: '#e5e7eb',
          transform: 'perspective(500px) rotateY(-3deg) rotateX(1deg)'
        },
        border: { width: 3, color: '#d1d5db', style: 'solid' },
        gradeLabel: {
          position: { x: 5, y: 5 },
          text: 'CRD',
          style: { fontSize: 12, fontWeight: 'bold', color: '#ffffff', background: '#000000' }
        },
        gradeScore: {
          position: { x: 85, y: 5 },
          text: '10',
          style: { fontSize: 12, fontWeight: 'bold', color: '#000000', background: '#45B26B' }
        },
        image: {
          position: { x: 8, y: 15, width: 84, height: 60 },
          borderRadius: 4
        },
        title: {
          position: { x: 8, y: 80 },
          style: { fontSize: 10, fontWeight: 'bold', textAlign: 'center' }
        }
      },
      colors: {
        primary: '#000000',
        secondary: '#45B26B',
        background: '#f9fafb'
      },
      effects: {
        borderRadius: 8,
        shadow: true,
        perspective: '500px',
        transform: 'rotateY(-3deg) rotateX(1deg)'
      }
    },
    usage_count: 600,
    tags: ['graded', 'professional', 'slab', '3d', 'premium']
  }
];

// Sports templates
export const SPORTS_FRAMES: DesignTemplate[] = [
  {
    id: 'baseball-classic',
    name: 'Baseball Classic',
    description: 'Traditional baseball card design with team colors',
    category: 'sports',
    is_premium: false,
    template_data: {
      layout: 'portrait',
      colors: {
        primary: '#1f2937',
        secondary: '#f3f4f6',
        accent: '#dc2626',
        background: '#ffffff',
        text: '#000000'
      },
      regions: {
        title: { x: 10, y: 10, width: 280, height: 30 },
        image: { x: 10, y: 50, width: 280, height: 200 },
        stats: { x: 10, y: 260, width: 280, height: 80 }
      },
      effects: {
        borderRadius: 8,
        shadow: true
      }
    },
    usage_count: 450,
    tags: ['baseball', 'classic', 'traditional']
  },
  {
    id: 'basketball-modern',
    name: 'Basketball Modern',
    description: 'Sleek modern design for basketball players',
    category: 'sports',
    is_premium: false,
    template_data: {
      layout: 'portrait',
      colors: {
        primary: '#ea580c',
        secondary: '#f97316',
        accent: '#fed7aa',
        background: '#0c0a09',
        text: '#ffffff'
      },
      regions: {
        playerName: { x: 10, y: 10, width: 280, height: 35 },
        image: { x: 10, y: 55, width: 280, height: 220 },
        stats: { x: 10, y: 285, width: 280, height: 55 }
      },
      effects: {
        borderRadius: 12,
        shadow: true
      }
    },
    usage_count: 320,
    tags: ['basketball', 'modern', 'sleek']
  }
];

// Entertainment templates
export const ENTERTAINMENT_FRAMES: DesignTemplate[] = [
  {
    id: 'musician-spotlight',
    name: 'Musician Spotlight',
    description: 'Perfect for showcasing musical artists and performers',
    category: 'entertainment',
    is_premium: false,
    template_data: {
      layout: 'portrait',
      colors: {
        primary: '#7c3aed',
        secondary: '#a855f7',
        accent: '#fbbf24',
        background: '#1f1827',
        text: '#ffffff'
      },
      regions: {
        title: { x: 10, y: 10, width: 280, height: 35 },
        image: { x: 10, y: 55, width: 280, height: 220 },
        stats: { x: 10, y: 285, width: 280, height: 55 }
      },
      effects: {
        borderRadius: 12,
        shadow: true
      }
    },
    usage_count: 280,
    tags: ['music', 'artist', 'performer']
  },
  {
    id: 'actor-premiere',
    name: 'Actor Premiere',
    description: 'Elegant design for actors and film personalities',
    category: 'entertainment',
    is_premium: false,
    template_data: {
      layout: 'portrait',
      colors: {
        primary: '#dc2626',
        secondary: '#991b1b',
        accent: '#fbbf24',
        background: '#0f0f0f',
        text: '#ffffff'
      },
      regions: {
        name: { x: 10, y: 10, width: 280, height: 35 },
        image: { x: 10, y: 55, width: 280, height: 220 },
        credits: { x: 10, y: 285, width: 280, height: 55 }
      },
      effects: {
        borderRadius: 12,
        shadow: true
      }
    },
    usage_count: 190,
    tags: ['actor', 'film', 'cinema']
  }
];

// Combined exports for convenience
export const ALL_FRAMES: DesignTemplate[] = [
  ...ESSENTIAL_FRAMES,
  ...SPORTS_FRAMES,
  ...ENTERTAINMENT_FRAMES
];
