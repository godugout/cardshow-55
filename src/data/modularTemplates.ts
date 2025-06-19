import type { ModularTemplate } from '@/types/modularTemplate';

export const MODULAR_TEMPLATES: ModularTemplate[] = [
  {
    id: 'crd-full-bleed',
    name: 'CRD Full Bleed',
    description: 'Full image display with CRD branding and minimal effects',
    category: 'minimal',
    aesthetic: 'minimal-grid',
    is_premium: false,
    elements: [
      {
        id: 'fullbleed-bg',
        type: 'background',
        name: 'Full Background',
        position: { x: 0, y: 0, width: 100, height: 100 },
        style: {
          backgroundColor: '#000000',
          borderRadius: 12
        },
        layer: 0,
        isCustomizable: true
      },
      {
        id: 'fullbleed-image',
        type: 'imageZone',
        name: 'Full Image Area',
        position: { x: 0, y: 0, width: 100, height: 100 },
        style: {
          borderRadius: 12
        },
        layer: 1,
        isCustomizable: false
      },
      {
        id: 'crd-logo',
        type: 'logoPatch',
        name: 'CRD Logo',
        position: { x: 85, y: 5, width: 12, height: 12 },
        style: {
          backgroundColor: 'rgba(16, 185, 129, 0.9)',
          borderRadius: 50,
          color: '#000000'
        },
        content: 'CRD',
        layer: 3,
        isCustomizable: true
      }
    ],
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
      allowedElements: ['logoPatch'],
      presets: ['default']
    },
    usage_count: 2500,
    tags: ['full-bleed', 'default', 'crd', 'minimal']
  },
  {
    id: 'minimal-grid',
    name: 'Minimal Grid',
    description: 'Clean geometric layout with customizable sections and modern typography',
    category: 'minimal',
    aesthetic: 'minimal-grid',
    is_premium: false,
    elements: [
      {
        id: 'bg-layer',
        type: 'background',
        name: 'Background Layer',
        position: { x: 0, y: 0, width: 100, height: 100 },
        style: {
          backgroundColor: '#ffffff',
          borderRadius: 12
        },
        layer: 0,
        isCustomizable: true,
        variants: [
          { backgroundColor: '#f8f9fa' },
          { backgroundColor: '#000000' },
          { backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
        ]
      },
      {
        id: 'main-frame',
        type: 'frame',
        name: 'Grid Frame',
        position: { x: 5, y: 5, width: 90, height: 90 },
        style: {
          borderColor: '#e0e0e0',
          borderWidth: 2,
          borderRadius: 8
        },
        layer: 1,
        isCustomizable: true,
        variants: [
          { borderColor: '#10B981', borderWidth: 3 },
          { borderColor: '#3B82F6', borderWidth: 1 },
          { borderColor: '#F59E0B', borderWidth: 4 }
        ]
      },
      {
        id: 'image-main',
        type: 'imageZone',
        name: 'Main Photo Area',
        position: { x: 10, y: 20, width: 80, height: 50 },
        style: {
          borderRadius: 6,
          shadow: '0 4px 12px rgba(0,0,0,0.1)'
        },
        layer: 2,
        isCustomizable: true
      },
      {
        id: 'nameplate-top',
        type: 'nameplate',
        name: 'Top Nameplate',
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
        isCustomizable: true,
        variants: [
          { backgroundColor: '#10B981', color: '#000000' },
          { backgroundColor: 'transparent', color: '#000000', borderColor: '#000000', borderWidth: 2 }
        ]
      },
      {
        id: 'stats-bottom',
        type: 'textOverlay',
        name: 'Stats Section',
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
    colorSchemes: [
      {
        name: 'Monochrome',
        primary: '#000000',
        secondary: '#ffffff',
        accent: '#10B981',
        background: '#f8f9fa',
        text: '#333333'
      },
      {
        name: 'Ocean',
        primary: '#0ea5e9',
        secondary: '#0284c7',
        accent: '#0891b2',
        background: '#f0f9ff',
        text: '#0c4a6e'
      }
    ],
    customization: {
      allowedElements: ['frame', 'nameplate', 'background', 'textOverlay'],
      presets: ['clean', 'bordered', 'filled']
    },
    usage_count: 1200,
    tags: ['minimal', 'clean', 'modern', 'geometric']
  },
  {
    id: 'cinematic-frame',
    name: 'Cinematic Frame',
    description: 'Movie poster inspired design with dramatic lighting and bold typography',
    category: 'entertainment',
    aesthetic: 'cinematic',
    is_premium: false,
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
        isCustomizable: true,
        variants: [
          { backgroundColor: 'linear-gradient(135deg, #000000 0%, #434343 100%)' },
          { backgroundColor: 'linear-gradient(135deg, #2d1b4e 0%, #8b5a2b 100%)' }
        ]
      },
      {
        id: 'spotlight-overlay',
        type: 'background',
        name: 'Spotlight Effect',
        position: { x: 15, y: 15, width: 70, height: 70 },
        style: {
          backgroundColor: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: 50
        },
        layer: 1,
        isCustomizable: true
      },
      {
        id: 'main-image',
        type: 'imageZone',
        name: 'Hero Image',
        position: { x: 8, y: 25, width: 84, height: 45 },
        style: {
          borderRadius: 8,
          shadow: '0 8px 32px rgba(0,0,0,0.4)'
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
          borderRadius: 6,
          shadow: '0 4px 16px rgba(255,107,107,0.3)'
        },
        content: 'FEATURE PRESENTATION',
        layer: 4,
        isCustomizable: true
      },
      {
        id: 'credits-bar',
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
    colorSchemes: [
      {
        name: 'Hollywood',
        primary: '#ff6b6b',
        secondary: '#ffd93d',
        accent: '#4ecdc4',
        background: '#1a1a1a',
        text: '#ffffff'
      },
      {
        name: 'Noir',
        primary: '#ffffff',
        secondary: '#cccccc',
        accent: '#ff4757',
        background: '#000000',
        text: '#ffffff'
      }
    ],
    customization: {
      allowedElements: ['nameplate', 'textOverlay', 'background'],
      presets: ['dramatic', 'noir', 'colorful']
    },
    usage_count: 890,
    tags: ['cinematic', 'dramatic', 'movie', 'bold']
  },
  {
    id: 'neon-cyber',
    name: 'Neon Cyber',
    description: 'Futuristic design with glowing accents and cyberpunk aesthetics',
    category: 'entertainment',
    aesthetic: 'neon-cyber',
    is_premium: true,
    elements: [
      {
        id: 'cyber-bg',
        type: 'background',
        name: 'Cyber Background',
        position: { x: 0, y: 0, width: 100, height: 100 },
        style: {
          backgroundColor: 'linear-gradient(135deg, #0f0f23 0%, #1a0033 50%, #0f0f23 100%)',
          borderRadius: 12
        },
        layer: 0,
        isCustomizable: true
      },
      {
        id: 'neon-frame',
        type: 'frame',
        name: 'Neon Border',
        position: { x: 3, y: 3, width: 94, height: 94 },
        style: {
          borderColor: '#00ffff',
          borderWidth: 2,
          borderRadius: 8,
          shadow: '0 0 20px #00ffff'
        },
        layer: 1,
        isCustomizable: true,
        variants: [
          { borderColor: '#ff00ff', shadow: '0 0 20px #ff00ff' },
          { borderColor: '#00ff00', shadow: '0 0 20px #00ff00' }
        ]
      },
      {
        id: 'holo-image',
        type: 'imageZone',
        name: 'Holographic Image',
        position: { x: 10, y: 20, width: 80, height: 50 },
        style: {
          borderRadius: 6,
          shadow: '0 0 30px rgba(0,255,255,0.3)'
        },
        layer: 2,
        isCustomizable: true
      },
      {
        id: 'cyber-title',
        type: 'nameplate',
        name: 'Cyber Title',
        position: { x: 10, y: 8, width: 80, height: 8 },
        style: {
          backgroundColor: 'rgba(0,255,255,0.1)',
          borderColor: '#00ffff',
          borderWidth: 1,
          color: '#00ffff',
          fontSize: 12,
          fontWeight: 'bold',
          textAlign: 'center',
          borderRadius: 4,
          shadow: '0 0 10px rgba(0,255,255,0.5)'
        },
        content: 'NEURAL LINK',
        layer: 3,
        isCustomizable: true
      },
      {
        id: 'data-stream',
        type: 'textOverlay',
        name: 'Data Stream',
        position: { x: 10, y: 75, width: 80, height: 15 },
        style: {
          backgroundColor: 'rgba(255,0,255,0.1)',
          borderColor: '#ff00ff',
          borderWidth: 1,
          color: '#ff00ff',
          fontSize: 8,
          textAlign: 'center',
          borderRadius: 4,
          fontFamily: 'monospace'
        },
        content: 'DATA_STREAM.EXE',
        layer: 3,
        isCustomizable: true
      }
    ],
    colorSchemes: [
      {
        name: 'Cyberpunk',
        primary: '#00ffff',
        secondary: '#ff00ff',
        accent: '#ffff00',
        background: '#0f0f23',
        text: '#ffffff'
      },
      {
        name: 'Matrix',
        primary: '#00ff00',
        secondary: '#003300',
        accent: '#66ff66',
        background: '#000000',
        text: '#00ff00'
      }
    ],
    customization: {
      allowedElements: ['frame', 'nameplate', 'textOverlay'],
      presets: ['neon', 'matrix', 'synthwave']
    },
    usage_count: 567,
    tags: ['cyberpunk', 'futuristic', 'neon', 'tech']
  },
  {
    id: 'vintage-trading',
    name: 'Vintage Trading',
    description: 'Classic trading card look with aged textures and retro typography',
    category: 'sports',
    aesthetic: 'vintage',
    is_premium: false,
    elements: [
      {
        id: 'aged-bg',
        type: 'background',
        name: 'Aged Background',
        position: { x: 0, y: 0, width: 100, height: 100 },
        style: {
          backgroundColor: 'linear-gradient(135deg, #f4e4bc 0%, #e8d5a3 100%)',
          borderRadius: 8
        },
        layer: 0,
        isCustomizable: true,
        variants: [
          { backgroundColor: 'linear-gradient(135deg, #d4a574 0%, #b8956a 100%)' }
        ]
      },
      {
        id: 'vintage-border',
        type: 'frame',
        name: 'Ornate Border',
        position: { x: 5, y: 5, width: 90, height: 90 },
        style: {
          borderColor: '#8b4513',
          borderWidth: 4,
          borderRadius: 12,
          shadow: 'inset 0 0 20px rgba(139,69,19,0.3)'
        },
        layer: 1,
        isCustomizable: true
      },
      {
        id: 'portrait-area',
        type: 'imageZone',
        name: 'Portrait Area',
        position: { x: 15, y: 25, width: 70, height: 45 },
        style: {
          borderColor: '#654321',
          borderWidth: 3,
          borderRadius: 4,
          shadow: '0 4px 8px rgba(0,0,0,0.3)'
        },
        layer: 2,
        isCustomizable: true
      },
      {
        id: 'vintage-nameplate',
        type: 'nameplate',
        name: 'Classic Nameplate',
        position: { x: 15, y: 12, width: 70, height: 10 },
        style: {
          backgroundColor: '#8b4513',
          color: '#f4e4bc',
          fontSize: 14,
          fontWeight: 'bold',
          textAlign: 'center',
          borderRadius: 6,
          borderColor: '#654321',
          borderWidth: 2
        },
        content: 'CLASSIC PLAYER',
        layer: 3,
        isCustomizable: true
      },
      {
        id: 'stats-banner',
        type: 'textOverlay',
        name: 'Stats Banner',
        position: { x: 15, y: 75, width: 70, height: 12 },
        style: {
          backgroundColor: '#654321',
          color: '#f4e4bc',
          fontSize: 10,
          textAlign: 'center',
          borderRadius: 4,
          borderColor: '#8b4513',
          borderWidth: 1
        },
        content: 'SEASON STATS',
        layer: 3,
        isCustomizable: true
      }
    ],
    colorSchemes: [
      {
        name: 'Classic',
        primary: '#8b4513',
        secondary: '#654321',
        accent: '#d2691e',
        background: '#f4e4bc',
        text: '#2f1b14'
      },
      {
        name: 'Sepia',
        primary: '#8b7355',
        secondary: '#6b5b47',
        accent: '#a0916d',
        background: '#f5f2e8',
        text: '#4a3c2a'
      }
    ],
    customization: {
      allowedElements: ['frame', 'nameplate', 'textOverlay', 'background'],
      presets: ['classic', 'sepia', 'worn']
    },
    usage_count: 734,
    tags: ['vintage', 'classic', 'retro', 'trading']
  },
  {
    id: 'magazine-cover',
    name: 'Magazine Cover',
    description: 'Editorial style layout with customizable masthead and article elements',
    category: 'entertainment',
    aesthetic: 'magazine',
    is_premium: false,
    elements: [
      {
        id: 'mag-bg',
        type: 'background',
        name: 'Magazine Background',
        position: { x: 0, y: 0, width: 100, height: 100 },
        style: {
          backgroundColor: '#ffffff',
          borderRadius: 0
        },
        layer: 0,
        isCustomizable: true,
        variants: [
          { backgroundColor: '#f8f9fa' },
          { backgroundColor: 'linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%)' }
        ]
      },
      {
        id: 'masthead',
        type: 'nameplate',
        name: 'Magazine Masthead',
        position: { x: 5, y: 5, width: 90, height: 12 },
        style: {
          backgroundColor: '#dc2626',
          color: '#ffffff',
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
          borderRadius: 0
        },
        content: 'SPOTLIGHT',
        layer: 4,
        isCustomizable: true,
        variants: [
          { backgroundColor: '#2563eb' },
          { backgroundColor: '#059669' },
          { backgroundColor: '#7c3aed' }
        ]
      },
      {
        id: 'cover-story',
        type: 'imageZone',
        name: 'Cover Story Image',
        position: { x: 5, y: 20, width: 90, height: 55 },
        style: {
          borderRadius: 0,
          shadow: '0 2px 8px rgba(0,0,0,0.1)'
        },
        layer: 2,
        isCustomizable: true
      },
      {
        id: 'headline',
        type: 'textOverlay',
        name: 'Main Headline',
        position: { x: 8, y: 78, width: 84, height: 8 },
        style: {
          backgroundColor: 'rgba(220,38,38,0.9)',
          color: '#ffffff',
          fontSize: 12,
          fontWeight: 'bold',
          textAlign: 'center',
          borderRadius: 0
        },
        content: 'EXCLUSIVE STORY',
        layer: 3,
        isCustomizable: true
      },
      {
        id: 'subheadline',
        type: 'textOverlay',
        name: 'Subheadline',
        position: { x: 8, y: 88, width: 84, height: 6 },
        style: {
          backgroundColor: 'transparent',
          color: '#374151',
          fontSize: 9,
          textAlign: 'center',
          borderRadius: 0
        },
        content: 'Inside this exclusive feature',
        layer: 3,
        isCustomizable: true
      }
    ],
    colorSchemes: [
      {
        name: 'Classic Red',
        primary: '#dc2626',
        secondary: '#991b1b',
        accent: '#fef2f2',
        background: '#ffffff',
        text: '#374151'
      },
      {
        name: 'Fashion Blue',
        primary: '#2563eb',
        secondary: '#1d4ed8',
        accent: '#eff6ff',
        background: '#ffffff',
        text: '#1f2937'
      }
    ],
    customization: {
      allowedElements: ['nameplate', 'textOverlay', 'background'],
      presets: ['classic', 'modern', 'fashion']
    },
    usage_count: 456,
    tags: ['magazine', 'editorial', 'professional', 'layout']
  },
  {
    id: 'polaroid-stack',
    name: 'Polaroid Stack',
    description: 'Layered instant photo aesthetic with authentic polaroid styling',
    category: 'minimal',
    aesthetic: 'polaroid',
    is_premium: false,
    elements: [
      {
        id: 'polaroid-bg',
        type: 'background',
        name: 'Paper Background',
        position: { x: 0, y: 0, width: 100, height: 100 },
        style: {
          backgroundColor: '#f8f6f0',
          borderRadius: 0
        },
        layer: 0,
        isCustomizable: true
      },
      {
        id: 'polaroid-frame',
        type: 'frame',
        name: 'Polaroid Frame',
        position: { x: 10, y: 8, width: 80, height: 84 },
        style: {
          backgroundColor: '#ffffff',
          borderColor: '#e5e5e5',
          borderWidth: 1,
          borderRadius: 2,
          shadow: '0 4px 16px rgba(0,0,0,0.1)'
        },
        layer: 1,
        isCustomizable: true
      },
      {
        id: 'photo-area',
        type: 'imageZone',
        name: 'Photo Area',
        position: { x: 15, y: 13, width: 70, height: 60 },
        style: {
          borderRadius: 0,
          shadow: 'inset 0 0 4px rgba(0,0,0,0.1)'
        },
        layer: 2,
        isCustomizable: true
      },
      {
        id: 'handwritten-note',
        type: 'textOverlay',
        name: 'Handwritten Note',
        position: { x: 15, y: 78, width: 70, height: 12 },
        style: {
          backgroundColor: 'transparent',
          color: '#4a5568',
          fontSize: 11,
          textAlign: 'center',
          fontFamily: 'cursive',
          borderRadius: 0
        },
        content: 'memories...',
        layer: 3,
        isCustomizable: true
      }
    ],
    colorSchemes: [
      {
        name: 'Vintage White',
        primary: '#ffffff',
        secondary: '#f7fafc',
        accent: '#e2e8f0',
        background: '#f8f6f0',
        text: '#4a5568'
      },
      {
        name: 'Cream',
        primary: '#fef5e7',
        secondary: '#faf0e6',
        accent: '#f4e4bc',
        background: '#fdf6e3',
        text: '#8b7355'
      }
    ],
    customization: {
      allowedElements: ['frame', 'textOverlay', 'background'],
      presets: ['classic', 'vintage', 'modern']
    },
    usage_count: 623,
    tags: ['polaroid', 'instant', 'vintage', 'photo']
  }
];

// Convert modular templates to the existing DesignTemplate format for compatibility
export const convertToDesignTemplate = (modularTemplate: ModularTemplate) => {
  const imageElement = modularTemplate.elements.find(e => e.type === 'imageZone');
  const nameplateElement = modularTemplate.elements.find(e => e.type === 'nameplate');
  const backgroundElement = modularTemplate.elements.find(e => e.type === 'background');

  return {
    id: modularTemplate.id,
    name: modularTemplate.name,
    description: modularTemplate.description,
    category: modularTemplate.category,
    is_premium: modularTemplate.is_premium,
    template_data: {
      layout: 'portrait' as const,
      elements: {
        background: { 
          type: 'solid', 
          color: backgroundElement?.style.backgroundColor || '#ffffff' 
        },
        image: imageElement ? {
          position: {
            x: imageElement.position.x,
            y: imageElement.position.y,
            width: imageElement.position.width,
            height: imageElement.position.height
          },
          borderRadius: imageElement.style.borderRadius || 8
        } : {
          position: { x: 10, y: 20, width: 80, height: 50 },
          borderRadius: 8
        },
        title: nameplateElement ? {
          position: {
            x: nameplateElement.position.x,
            y: nameplateElement.position.y
          },
          style: {
            fontSize: nameplateElement.style.fontSize || 14,
            fontWeight: nameplateElement.style.fontWeight || 'bold',
            color: nameplateElement.style.color || '#000000',
            background: nameplateElement.style.backgroundColor || 'transparent'
          }
        } : undefined
      },
      colors: modularTemplate.colorSchemes[0],
      effects: {
        borderRadius: backgroundElement?.style.borderRadius || 8,
        shadow: true
      }
    },
    usage_count: modularTemplate.usage_count,
    tags: modularTemplate.tags
  };
};
