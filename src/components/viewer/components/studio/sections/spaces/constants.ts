import type { SpaceEnvironment } from '../../../../spaces/types';

export const SPACE_ENVIRONMENTS: SpaceEnvironment[] = [
  // Basic Spaces
  {
    id: 'void',
    name: 'Void',
    description: 'Infinite starfield space',
    previewUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400',
    type: 'void',
    category: 'basic',
    emoji: '🌌',
    config: {
      backgroundColor: '#000000',
      ambientColor: '#ffffff',
      lightIntensity: 0.8,
      particleCount: 5000
    }
  },
  {
    id: 'cosmic',
    name: 'Cosmic',
    description: 'Colorful nebula space',
    previewUrl: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400',
    type: 'cosmic',
    category: 'basic',
    emoji: '🌠',
    config: {
      backgroundColor: '#1a0033',
      ambientColor: '#ff00ff',
      lightIntensity: 1.0,
      particleCount: 5000
    }
  },
  {
    id: 'studio',
    name: 'Studio',
    description: 'Professional lighting setup',
    previewUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
    type: 'studio',
    category: 'basic',
    emoji: '📸',
    config: {
      backgroundColor: '#f5f5f5',
      ambientColor: '#ffffff',
      lightIntensity: 1.2
    }
  },
  
  // Sports Venues
  {
    id: 'basketball-court',
    name: 'Basketball Court',
    description: 'Professional basketball arena',
    previewUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
    type: 'sports',
    category: 'sports',
    emoji: '🏀',
    config: {
      backgroundColor: '#8b4513',
      ambientColor: '#ffffff',
      lightIntensity: 1.3,
      venue: 'basketball'
    }
  },
  {
    id: 'football-stadium',
    name: 'Football Stadium',
    description: 'Massive football stadium with crowd',
    previewUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400',
    type: 'sports',
    category: 'sports',
    emoji: '🏈',
    config: {
      backgroundColor: '#228b22',
      ambientColor: '#ffffff',
      lightIntensity: 1.4,
      venue: 'football'
    }
  },
  {
    id: 'baseball-diamond',
    name: 'Baseball Diamond',
    description: 'Classic baseball field',
    previewUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400',
    type: 'sports',
    category: 'sports',
    emoji: '⚾',
    config: {
      backgroundColor: '#8b4513',
      ambientColor: '#ffffff',
      lightIntensity: 1.2,
      venue: 'baseball'
    }
  },
  {
    id: 'racing-circuit',
    name: 'Racing Circuit',
    description: 'High-speed racing track',
    previewUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    type: 'sports',
    category: 'sports',
    emoji: '🏎️',
    config: {
      backgroundColor: '#2f4f4f',
      ambientColor: '#ffffff',
      lightIntensity: 1.1,
      venue: 'racing'
    }
  },
  
  // Cultural Spaces
  {
    id: 'art-gallery',
    name: 'Art Gallery',
    description: 'Elegant museum gallery',
    previewUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    type: 'cultural',
    category: 'cultural',
    emoji: '🎨',
    config: {
      backgroundColor: '#f8f8ff',
      ambientColor: '#ffffff',
      lightIntensity: 0.9,
      venue: 'gallery'
    }
  },
  {
    id: 'concert-hall',
    name: 'Concert Hall',
    description: 'Grand concert performance venue',
    previewUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    type: 'cultural',
    category: 'cultural',
    emoji: '🎼',
    config: {
      backgroundColor: '#800020',
      ambientColor: '#ffd700',
      lightIntensity: 0.8,
      venue: 'concert'
    }
  },
  {
    id: 'library',
    name: 'Library',
    description: 'Majestic reading room',
    previewUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    type: 'cultural',
    category: 'cultural',
    emoji: '📚',
    config: {
      backgroundColor: '#8b4513',
      ambientColor: '#daa520',
      lightIntensity: 0.7,
      venue: 'library'
    }
  },
  {
    id: 'theater-stage',
    name: 'Theater Stage',
    description: 'Broadway-style theater',
    previewUrl: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=400',
    type: 'cultural',
    category: 'cultural',
    emoji: '🎭',
    config: {
      backgroundColor: '#000000',
      ambientColor: '#ffffff',
      lightIntensity: 1.0,
      venue: 'theater'
    }
  },
  
  // Retail Environments
  {
    id: 'card-shop',
    name: 'Card Shop',
    description: 'Cozy trading card store',
    previewUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    type: 'retail',
    category: 'retail',
    emoji: '🃏',
    config: {
      backgroundColor: '#f5deb3',
      ambientColor: '#ffa500',
      lightIntensity: 1.0,
      venue: 'cardshop'
    }
  },
  {
    id: 'gaming-lounge',
    name: 'Gaming Lounge',
    description: 'Esports gaming arena',
    previewUrl: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400',
    type: 'retail',
    category: 'retail',
    emoji: '🎮',
    config: {
      backgroundColor: '#000000',
      ambientColor: '#00ffff',
      lightIntensity: 0.9,
      venue: 'gaming'
    }
  },
  {
    id: 'comic-store',
    name: 'Comic Store',
    description: 'Vintage comic book shop',
    previewUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    type: 'retail',
    category: 'retail',
    emoji: '📖',
    config: {
      backgroundColor: '#8b4513',
      ambientColor: '#ffd700',
      lightIntensity: 0.8,
      venue: 'comic'
    }
  },
  {
    id: 'convention-hall',
    name: 'Convention Hall',
    description: 'Large convention center',
    previewUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
    type: 'retail',
    category: 'retail',
    emoji: '🏢',
    config: {
      backgroundColor: '#f0f8ff',
      ambientColor: '#4169e1',
      lightIntensity: 1.1,
      venue: 'convention'
    }
  },
  
  // Natural Settings
  {
    id: 'mountain-vista',
    name: 'Mountain Vista',
    description: 'Majestic mountain peaks',
    previewUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400',
    type: 'natural',
    category: 'natural',
    emoji: '🏔️',
    config: {
      backgroundColor: '#87ceeb',
      ambientColor: '#ffffff',
      lightIntensity: 1.2,
      venue: 'mountain',
      animationSpeed: 0.2
    }
  },
  {
    id: 'beach-sunset',
    name: 'Beach Sunset',
    description: 'Tropical beach at golden hour',
    previewUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
    type: 'natural',
    category: 'natural',
    emoji: '🏖️',
    config: {
      backgroundColor: '#ffa500',
      ambientColor: '#ff6347',
      lightIntensity: 1.3,
      venue: 'beach',
      animationSpeed: 0.8
    }
  },
  {
    id: 'forest-clearing',
    name: 'Forest Clearing',
    description: 'Magical woodland glade',
    previewUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400',
    type: 'natural',
    category: 'natural',
    emoji: '🌲',
    config: {
      backgroundColor: '#228b22',
      ambientColor: '#90ee90',
      lightIntensity: 0.9,
      venue: 'forest',
      animationSpeed: 0.3
    }
  },
  {
    id: 'desert-landscape',
    name: 'Desert Landscape',
    description: 'Vast desert with dramatic rocks',
    previewUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400',
    type: 'natural',
    category: 'natural',
    emoji: '🏜️',
    config: {
      backgroundColor: '#deb887',
      ambientColor: '#ffa500',
      lightIntensity: 1.4,
      venue: 'desert',
      animationSpeed: 1.0
    }
  },
  
  // Professional Spaces
  {
    id: 'modern-office',
    name: 'Modern Office',
    description: 'Sleek corporate boardroom',
    previewUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
    type: 'professional',
    category: 'professional',
    emoji: '🏢',
    config: {
      backgroundColor: '#f5f5f5',
      ambientColor: '#4169e1',
      lightIntensity: 1.0,
      venue: 'office'
    }
  },
  {
    id: 'photo-studio',
    name: 'Photo Studio',
    description: 'Professional photography setup',
    previewUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
    type: 'professional',
    category: 'professional',
    emoji: '📷',
    config: {
      backgroundColor: '#ffffff',
      ambientColor: '#ffffff',
      lightIntensity: 1.5,
      venue: 'studio'
    }
  },
  {
    id: 'broadcast-studio',
    name: 'Broadcast Studio',
    description: 'TV production studio',
    previewUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400',
    type: 'professional',
    category: 'professional',
    emoji: '📺',
    config: {
      backgroundColor: '#000080',
      ambientColor: '#ffffff',
      lightIntensity: 1.2,
      venue: 'broadcast'
    }
  },
  {
    id: 'workshop',
    name: 'Workshop',
    description: 'Creative maker space',
    previewUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400',
    type: 'professional',
    category: 'professional',
    emoji: '🔧',
    config: {
      backgroundColor: '#696969',
      ambientColor: '#ffa500',
      lightIntensity: 1.1,
      venue: 'workshop'
    }
  },
  
  // Keep existing themed spaces
  {
    id: 'matrix',
    name: 'Matrix Code',
    description: 'Digital rain environment',
    previewUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
    type: 'matrix',
    category: 'themed',
    emoji: '💚',
    config: {
      backgroundColor: '#000000',
      ambientColor: '#00ff00',
      lightIntensity: 0.8,
      particleCount: 200,
      animationSpeed: 2.0
    }
  },
  {
    id: 'neon',
    name: 'Neon City',
    description: 'Cyberpunk cityscape',
    previewUrl: 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=400',
    type: 'neon',
    category: 'themed',
    emoji: '🌃',
    config: {
      backgroundColor: '#0a0a23',
      ambientColor: '#ff1493',
      lightIntensity: 1.2,
      particleCount: 150,
      animationSpeed: 1.5
    }
  }
];
