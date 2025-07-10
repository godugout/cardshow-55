import type { CRDFrame } from '@/types/crd-frame';

export const SAMPLE_CRD_FRAMES: CRDFrame[] = [
  {
    id: 'classic-baseball-1',
    name: 'Classic Baseball Card',
    category: 'sports',
    version: '1.0.0',
    description: 'Traditional baseball card layout with full-surface image',
    frame_config: {
      dimensions: {
        width: 400,
        height: 560
      },
      regions: [
        {
          id: 'main-photo',
          type: 'photo',
          name: 'Card Image',
          bounds: { x: 0, y: 0, width: 400, height: 560 },
          shape: 'rectangle',
          constraints: {
            aspectRatio: 400/560, // 2.5:3.5 ratio
            position: 'fixed',
            scalable: false
          },
          styling: {
            border: { width: 0, style: 'solid', color: 'transparent' },
            background: { type: 'color', value: 'transparent' }
          },
          cropSettings: {
            enabled: true,
            aspectRatio: 400/560,
            allowRotation: true,
            allowBackgroundRemoval: false
          }
        }
      ],
      elements: [
        {
          id: 'card-border',
          type: 'shape',
          name: 'Card Border',
          properties: {
            position: { x: 0, y: 0 },
            size: { width: 400, height: 560 },
            color: '#333333'
          },
          behavior: { responsive: true },
          variations: []
        }
      ]
    },
    included_elements: [],
    is_public: true,
    price_cents: 0,
    rating_average: 4.5,
    rating_count: 127,
    download_count: 1543,
    tags: ['sports', 'baseball', 'classic'],
    creator_id: undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'modern-soccer-1',
    name: 'Modern Soccer Card',
    category: 'sports',
    version: '1.0.0',
    description: 'Dynamic soccer card with full-surface image and modern styling',
    frame_config: {
      dimensions: {
        width: 400,
        height: 600
      },
      regions: [
        {
          id: 'main-photo',
          type: 'photo',
          name: 'Card Image',
          bounds: { x: 0, y: 0, width: 400, height: 600 },
          shape: 'rectangle',
          constraints: {
            aspectRatio: 400/600, // 2.5:3.75 ratio for modern card
            position: 'fixed',
            scalable: false
          },
          styling: {
            border: { width: 0, style: 'solid', color: 'transparent' },
            background: { type: 'color', value: 'transparent' }
          },
          cropSettings: {
            enabled: true,
            aspectRatio: 400/600,
            allowRotation: true,
            allowBackgroundRemoval: false
          }
        }
      ],
      elements: [
        {
          id: 'gradient-overlay',
          type: 'gradient',
          name: 'Background Gradient',
          properties: {
            position: { x: 0, y: 450 },
            size: { width: 400, height: 150 }
          },
          behavior: { responsive: true },
          variations: []
        }
      ]
    },
    included_elements: [],
    is_public: true,
    price_cents: 0,
    rating_average: 4.8,
    rating_count: 89,
    download_count: 756,
    tags: ['sports', 'soccer', 'modern', 'gradient'],
    creator_id: undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];