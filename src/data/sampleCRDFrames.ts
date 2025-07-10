import type { CRDFrame } from '@/types/crd-frame';

export const SAMPLE_CRD_FRAMES: CRDFrame[] = [
  {
    id: 'classic-baseball-1',
    name: 'Classic Baseball Card',
    category: 'sports',
    version: '1.0.0',
    description: 'Traditional baseball card layout with vintage styling',
    frame_config: {
      dimensions: {
        width: 400,
        height: 560
      },
      regions: [
        {
          id: 'player-photo',
          type: 'photo',
          name: 'Player Photo',
          bounds: { x: 20, y: 20, width: 360, height: 300 },
          shape: 'rectangle',
          constraints: {
            aspectRatio: 6/5,
            minSize: { width: 200, height: 150 },
            position: 'flexible',
            scalable: true
          },
          styling: {
            border: { width: 2, style: 'solid', color: '#333333', radius: 8 },
            background: { type: 'color', value: '#f5f5f5' }
          },
          cropSettings: {
            enabled: true,
            aspectRatio: 6/5,
            allowRotation: true,
            allowBackgroundRemoval: true
          }
        },
        {
          id: 'team-logo',
          type: 'logo',
          name: 'Team Logo',
          bounds: { x: 300, y: 340, width: 80, height: 80 },
          shape: 'circle',
          constraints: {
            minSize: { width: 40, height: 40 },
            maxSize: { width: 120, height: 120 },
            position: 'flexible'
          },
          styling: {
            border: { width: 2, style: 'solid', color: '#ffffff' }
          }
        },
        {
          id: 'player-name',
          type: 'text',
          name: 'Player Name',
          bounds: { x: 20, y: 340, width: 270, height: 40 },
          shape: 'rectangle',
          constraints: {
            position: 'flexible'
          },
          styling: {}
        },
        {
          id: 'stats-area',
          type: 'stats',
          name: 'Player Stats',
          bounds: { x: 20, y: 390, width: 360, height: 120 },
          shape: 'rectangle',
          constraints: {
            position: 'flexible'
          },
          styling: {
            background: { type: 'color', value: '#f8f9fa', opacity: 0.9 },
            border: { width: 1, style: 'solid', color: '#dee2e6', radius: 4 }
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
        },
        {
          id: 'team-colors-stripe',
          type: 'shape',
          name: 'Team Colors',
          properties: {
            position: { x: 0, y: 520 },
            size: { width: 400, height: 40 },
            color: '#0066cc'
          },
          behavior: { responsive: true },
          variations: [
            { name: 'red', properties: { color: '#cc0000' } },
            { name: 'blue', properties: { color: '#0066cc' } },
            { name: 'green', properties: { color: '#006600' } }
          ]
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
    description: 'Dynamic soccer card with gradient background and modern typography',
    frame_config: {
      dimensions: {
        width: 400,
        height: 600
      },
      regions: [
        {
          id: 'player-photo',
          type: 'photo',
          name: 'Player Photo',
          bounds: { x: 0, y: 0, width: 400, height: 400 },
          shape: 'rectangle',
          constraints: {
            aspectRatio: 1,
            position: 'fixed'
          },
          styling: {
            clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)'
          },
          cropSettings: {
            enabled: true,
            aspectRatio: 1,
            allowRotation: true,
            allowBackgroundRemoval: true
          }
        },
        {
          id: 'player-name',
          type: 'text',
          name: 'Player Name',
          bounds: { x: 20, y: 420, width: 360, height: 50 },
          shape: 'rectangle',
          constraints: { position: 'flexible' },
          styling: {}
        },
        {
          id: 'team-info',
          type: 'text',
          name: 'Team & Position',
          bounds: { x: 20, y: 480, width: 360, height: 80 },
          shape: 'rectangle',
          constraints: { position: 'flexible' },
          styling: {}
        }
      ],
      elements: [
        {
          id: 'gradient-overlay',
          type: 'gradient',
          name: 'Background Gradient',
          properties: {
            position: { x: 0, y: 350 },
            size: { width: 400, height: 250 }
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