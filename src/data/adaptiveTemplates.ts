
import type { AdaptiveTemplate } from '@/types/adaptiveTemplate';

export const ADAPTIVE_TEMPLATES: AdaptiveTemplate[] = [
  {
    id: 'crd-adaptive-full-bleed',
    name: 'CRD Full Bleed',
    description: 'Adaptive full image display with smart frame adjustment',
    category: 'minimal',
    aesthetic: 'minimal-grid',
    is_premium: false,
    supportedFormats: ['square', 'circle', 'fullBleed'],
    elements: [
      {
        id: 'adaptive-bg',
        type: 'background',
        name: 'Adaptive Background',
        position: { x: 0, y: 0, width: 100, height: 100 },
        style: {
          backgroundColor: '#000000',
          borderRadius: 12
        },
        layer: 0,
        isCustomizable: true
      },
      {
        id: 'adaptive-image',
        type: 'imageZone',
        name: 'Adaptive Image Area',
        position: { x: 0, y: 0, width: 100, height: 100 },
        style: {
          borderRadius: 12
        },
        layer: 1,
        isCustomizable: false
      },
      {
        id: 'adaptive-title',
        type: 'nameplate',
        name: 'Adaptive Title',
        position: { x: 10, y: 5, width: 60, height: 8 },
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#ffffff',
          fontSize: 12,
          fontWeight: 'bold',
          textAlign: 'left',
          borderRadius: 4
        },
        content: 'CARD TITLE',
        layer: 3,
        isCustomizable: true
      },
      {
        id: 'adaptive-logo',
        type: 'logoPatch',
        name: 'Adaptive Logo',
        position: { x: 85, y: 5, width: 12, height: 12 },
        style: {
          backgroundColor: 'rgba(16, 185, 129, 0.9)',
          borderRadius: 50,
          color: '#000000'
        },
        content: 'CRD',
        layer: 4,
        isCustomizable: true
      }
    ],
    adaptiveLayout: {
      square: {
        imagePosition: { x: 15, y: 15, width: 70, height: 70 },
        infoZones: [
          {
            id: 'title-zone',
            position: { x: 10, y: 5, width: 60, height: 8 },
            type: 'title',
            priority: 5
          },
          {
            id: 'logo-zone',
            position: { x: 75, y: 5, width: 20, height: 8 },
            type: 'logo',
            priority: 4
          },
          {
            id: 'stats-zone',
            position: { x: 10, y: 87, width: 80, height: 8 },
            type: 'stats',
            priority: 3
          }
        ]
      },
      fullBleed: {
        imagePosition: { x: 0, y: 0, width: 100, height: 100 },
        infoZones: [
          {
            id: 'title-zone',
            position: { x: 10, y: 5, width: 60, height: 8 },
            type: 'title',
            priority: 5
          },
          {
            id: 'logo-zone',
            position: { x: 85, y: 5, width: 12, height: 12 },
            type: 'logo',
            priority: 4
          }
        ]
      }
    },
    centerProtection: {
      radius: 40,
      minVisibleArea: 80
    },
    colorSchemes: [
      {
        name: 'CRD Default',
        primary: '#10B981',
        secondary: '#000000',
        accent: '#ffffff',
        background: '#000000',
        text: '#ffffff'
      }
    ],
    customization: {
      allowedElements: ['nameplate', 'logoPatch', 'textOverlay'],
      presets: ['default']
    },
    usage_count: 2500,
    tags: ['adaptive', 'full-bleed', 'crd', 'minimal']
  },
  {
    id: 'adaptive-minimal-grid',
    name: 'Minimal Grid',
    description: 'Clean adaptive layout with smart border utilization',
    category: 'minimal',
    aesthetic: 'minimal-grid',
    is_premium: false,
    supportedFormats: ['square', 'circle', 'fullBleed'],
    elements: [
      {
        id: 'grid-bg',
        type: 'background',
        name: 'Grid Background',
        position: { x: 0, y: 0, width: 100, height: 100 },
        style: {
          backgroundColor: '#ffffff',
          borderRadius: 12
        },
        layer: 0,
        isCustomizable: true
      },
      {
        id: 'grid-frame',
        type: 'frame',
        name: 'Grid Frame',
        position: { x: 5, y: 5, width: 90, height: 90 },
        style: {
          borderColor: '#e0e0e0',
          borderWidth: 2,
          borderRadius: 8
        },
        layer: 1,
        isCustomizable: true
      },
      {
        id: 'grid-image',
        type: 'imageZone',
        name: 'Grid Image Area',
        position: { x: 10, y: 20, width: 80, height: 50 },
        style: {
          borderRadius: 6
        },
        layer: 2,
        isCustomizable: true
      },
      {
        id: 'grid-title',
        type: 'nameplate',
        name: 'Grid Title',
        position: { x: 10, y: 8, width: 80, height: 8 },
        style: {
          backgroundColor: '#000000',
          color: '#ffffff',
          fontSize: 14,
          fontWeight: 'bold',
          textAlign: 'center',
          borderRadius: 4
        },
        content: 'CARD TITLE',
        layer: 3,
        isCustomizable: true
      },
      {
        id: 'grid-stats',
        type: 'textOverlay',
        name: 'Grid Stats',
        position: { x: 10, y: 75, width: 80, height: 15 },
        style: {
          backgroundColor: '#f8f9fa',
          fontSize: 10,
          color: '#666666',
          textAlign: 'center',
          borderRadius: 4
        },
        content: 'STATS & INFO',
        layer: 3,
        isCustomizable: true
      }
    ],
    adaptiveLayout: {
      square: {
        imagePosition: { x: 20, y: 20, width: 60, height: 60 },
        infoZones: [
          {
            id: 'title-zone',
            position: { x: 10, y: 8, width: 80, height: 8 },
            type: 'title',
            priority: 5
          },
          {
            id: 'stats-zone',
            position: { x: 10, y: 84, width: 80, height: 8 },
            type: 'stats',
            priority: 3
          }
        ]
      },
      fullBleed: {
        imagePosition: { x: 0, y: 0, width: 100, height: 100 },
        infoZones: [
          {
            id: 'title-zone',
            position: { x: 10, y: 8, width: 80, height: 8 },
            type: 'title',
            priority: 5
          },
          {
            id: 'subtitle-zone',
            position: { x: 10, y: 85, width: 80, height: 10 },
            type: 'subtitle',
            priority: 4
          }
        ]
      }
    },
    centerProtection: {
      radius: 35,
      minVisibleArea: 75
    },
    colorSchemes: [
      {
        name: 'Monochrome',
        primary: '#000000',
        secondary: '#ffffff',
        accent: '#10B981',
        background: '#f8f9fa',
        text: '#333333'
      }
    ],
    customization: {
      allowedElements: ['frame', 'nameplate', 'textOverlay'],
      presets: ['clean', 'bordered', 'filled']
    },
    usage_count: 1200,
    tags: ['adaptive', 'minimal', 'clean', 'modern']
  },
  {
    id: 'adaptive-cinematic',
    name: 'Cinematic Frame',
    description: 'Dramatic adaptive layout with smart overlay positioning',
    category: 'entertainment',
    aesthetic: 'cinematic',
    is_premium: false,
    supportedFormats: ['square', 'circle', 'fullBleed'],
    elements: [
      {
        id: 'cinema-bg',
        type: 'background',
        name: 'Cinematic Background',
        position: { x: 0, y: 0, width: 100, height: 100 },
        style: {
          backgroundColor: 'linear-gradient(135deg, #1a1a1a 0%, #2d1b4e 50%, #1a1a1a 100%)',
          borderRadius: 16
        },
        layer: 0,
        isCustomizable: true
      },
      {
        id: 'cinema-image',
        type: 'imageZone',
        name: 'Cinematic Image',
        position: { x: 8, y: 25, width: 84, height: 45 },
        style: {
          borderRadius: 8
        },
        layer: 2,
        isCustomizable: true
      },
      {
        id: 'cinema-title',
        type: 'nameplate',
        name: 'Cinematic Title',
        position: { x: 8, y: 8, width: 84, height: 12 },
        style: {
          backgroundColor: 'linear-gradient(90deg, #ff6b6b, #ffd93d)',
          color: '#000000',
          fontSize: 16,
          fontWeight: 'bold',
          textAlign: 'center',
          borderRadius: 6
        },
        content: 'FEATURE PRESENTATION',
        layer: 4,
        isCustomizable: true
      },
      {
        id: 'cinema-credits',
        type: 'textOverlay',
        name: 'Credits Bar',
        position: { x: 8, y: 75, width: 84, height: 18 },
        style: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: '#ffffff',
          fontSize: 9,
          textAlign: 'center',
          borderRadius: 4
        },
        content: 'CREDITS & DETAILS',
        layer: 3,
        isCustomizable: true
      }
    ],
    adaptiveLayout: {
      square: {
        imagePosition: { x: 15, y: 20, width: 70, height: 60 },
        infoZones: [
          {
            id: 'title-zone',
            position: { x: 8, y: 8, width: 84, height: 8 },
            type: 'title',
            priority: 5
          },
          {
            id: 'credits-zone',
            position: { x: 8, y: 84, width: 84, height: 8 },
            type: 'subtitle',
            priority: 3
          }
        ]
      },
      fullBleed: {
        imagePosition: { x: 0, y: 0, width: 100, height: 100 },
        infoZones: [
          {
            id: 'title-zone',
            position: { x: 8, y: 8, width: 84, height: 12 },
            type: 'title',
            priority: 5
          },
          {
            id: 'credits-zone',
            position: { x: 8, y: 80, width: 84, height: 12 },
            type: 'subtitle',
            priority: 4
          }
        ]
      }
    },
    centerProtection: {
      radius: 45,
      minVisibleArea: 70
    },
    colorSchemes: [
      {
        name: 'Hollywood',
        primary: '#ff6b6b',
        secondary: '#ffd93d',
        accent: '#4ecdc4',
        background: '#1a1a1a',
        text: '#ffffff'
      }
    ],
    customization: {
      allowedElements: ['nameplate', 'textOverlay'],
      presets: ['dramatic', 'noir', 'colorful']
    },
    usage_count: 890,
    tags: ['adaptive', 'cinematic', 'dramatic', 'movie']
  }
];

// Convert adaptive templates to legacy format for backward compatibility
export const convertAdaptiveToDesignTemplate = (adaptiveTemplate: AdaptiveTemplate) => {
  return {
    id: adaptiveTemplate.id,
    name: adaptiveTemplate.name,
    description: adaptiveTemplate.description,
    category: adaptiveTemplate.category,
    is_premium: adaptiveTemplate.is_premium,
    template_data: {
      layout: 'portrait' as const,
      elements: {
        background: { 
          type: 'solid', 
          color: adaptiveTemplate.elements.find(e => e.type === 'background')?.style.backgroundColor || '#ffffff' 
        },
        image: {
          position: { x: 0, y: 0, width: 100, height: 100 },
          borderRadius: 8
        }
      },
      colors: adaptiveTemplate.colorSchemes[0],
      effects: {
        borderRadius: 8,
        shadow: true
      }
    },
    usage_count: adaptiveTemplate.usage_count,
    tags: adaptiveTemplate.tags
  };
};
