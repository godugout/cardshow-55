
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
