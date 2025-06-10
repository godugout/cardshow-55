
export interface PanoramicPhoto {
  id: string;
  name: string;
  category: 'natural' | 'urban' | 'interior' | 'sports' | 'cultural' | 'fantasy';
  url: string;
  thumbnail: string;
  description: string;
  lighting: {
    intensity: number;
    warmth: number;
    contrast: number;
  };
  camera: {
    defaultDistance: number;
    autoRotateSpeed: number;
  };
  credits?: string;
}

export const PANORAMIC_PHOTO_LIBRARY: PanoramicPhoto[] = [
  // Natural Environments - Using high-quality HDRIs (4K)
  {
    id: 'forest-clearing',
    name: 'Forest Clearing',
    category: 'natural',
    url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/forest_slope_4k.hdr',
    thumbnail: 'https://cdn.polyhaven.com/asset_img/primary/forest_slope.png',
    description: 'Sunlit forest clearing with dappled light',
    lighting: { intensity: 1.2, warmth: 0.7, contrast: 0.6 },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.3 }
  },
  {
    id: 'mountain-vista',
    name: 'Mountain Vista',
    category: 'natural',
    url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/kiara_1_dawn_4k.hdr',
    thumbnail: 'https://cdn.polyhaven.com/asset_img/primary/kiara_1_dawn.png',
    description: 'Panoramic mountain landscape with dramatic sky',
    lighting: { intensity: 1.4, warmth: 0.6, contrast: 0.8 },
    camera: { defaultDistance: 10, autoRotateSpeed: 0.2 }
  },
  {
    id: 'ocean-sunset',
    name: 'Ocean Sunset',
    category: 'natural',
    url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/venice_sunset_4k.hdr',
    thumbnail: 'https://cdn.polyhaven.com/asset_img/primary/venice_sunset.png',
    description: 'Golden hour ocean view with warm lighting',
    lighting: { intensity: 1.3, warmth: 0.9, contrast: 0.7 },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.4 }
  },
  {
    id: 'alpine-meadow',
    name: 'Alpine Meadow',
    category: 'natural',
    url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/kloofendal_48d_partly_cloudy_puresky_4k.hdr',
    thumbnail: 'https://cdn.polyhaven.com/asset_img/primary/kloofendal_48d_partly_cloudy_puresky.png',
    description: 'Open meadow with dramatic clouds',
    lighting: { intensity: 1.1, warmth: 0.6, contrast: 0.8 },
    camera: { defaultDistance: 9, autoRotateSpeed: 0.3 }
  },

  // Urban Environments - 4K quality
  {
    id: 'city-rooftop',
    name: 'City Rooftop',
    category: 'urban',
    url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/shanghai_bund_4k.hdr',
    thumbnail: 'https://cdn.polyhaven.com/asset_img/primary/shanghai_bund.png',
    description: 'Urban skyline from rooftop perspective',
    lighting: { intensity: 1.0, warmth: 0.5, contrast: 0.9 },
    camera: { defaultDistance: 9, autoRotateSpeed: 0.3 }
  },
  {
    id: 'urban-street',
    name: 'Urban Street',
    category: 'urban',
    url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/potsdamer_platz_4k.hdr',
    thumbnail: 'https://cdn.polyhaven.com/asset_img/primary/potsdamer_platz.png',
    description: 'Busy city street with modern architecture',
    lighting: { intensity: 0.9, warmth: 0.4, contrast: 0.8 },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.4 }
  },

  // Interior Spaces - 4K quality
  {
    id: 'modern-studio',
    name: 'Modern Studio',
    category: 'interior',
    url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/studio_small_03_4k.hdr',
    thumbnail: 'https://cdn.polyhaven.com/asset_img/primary/studio_small_03.png',
    description: 'Clean, modern studio with perfect lighting',
    lighting: { intensity: 1.5, warmth: 0.4, contrast: 0.5 },
    camera: { defaultDistance: 6, autoRotateSpeed: 0.2 }
  },
  {
    id: 'warehouse-loft',
    name: 'Warehouse Loft',
    category: 'interior',
    url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/industrial_workshop_foundry_4k.hdr',
    thumbnail: 'https://cdn.polyhaven.com/asset_img/primary/industrial_workshop_foundry.png',
    description: 'Industrial loft with dramatic windows',
    lighting: { intensity: 1.2, warmth: 0.6, contrast: 0.8 },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.1 }
  },

  // Sports Venues - 4K quality
  {
    id: 'sports-arena',
    name: 'Sports Arena',
    category: 'sports',
    url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/royal_esplanade_4k.hdr',
    thumbnail: 'https://cdn.polyhaven.com/asset_img/primary/royal_esplanade.png',
    description: 'Professional sports arena atmosphere',
    lighting: { intensity: 1.3, warmth: 0.5, contrast: 0.8 },
    camera: { defaultDistance: 12, autoRotateSpeed: 0.3 }
  },

  // Cultural Spaces - 4K quality
  {
    id: 'concert-hall',
    name: 'Concert Hall',
    category: 'cultural',
    url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/dancing_hall_4k.hdr',
    thumbnail: 'https://cdn.polyhaven.com/asset_img/primary/dancing_hall.png',
    description: 'Grand concert hall with ornate architecture',
    lighting: { intensity: 1.1, warmth: 0.7, contrast: 0.8 },
    camera: { defaultDistance: 10, autoRotateSpeed: 0.1 }
  },

  // Fantasy Environments - 4K quality
  {
    id: 'cosmic-void',
    name: 'Cosmic Void',
    category: 'fantasy',
    url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/starmap_2020_4k.hdr',
    thumbnail: 'https://cdn.polyhaven.com/asset_img/primary/starmap_2020.png',
    description: 'Deep space with stars and nebula',
    lighting: { intensity: 0.8, warmth: 0.3, contrast: 1.0 },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.4 }
  }
];

// Fallback photos with 2K versions for faster loading
export const FALLBACK_PHOTOS: PanoramicPhoto[] = [
  {
    id: 'fallback-studio',
    name: 'Studio Fallback',
    category: 'interior',
    url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/studio_small_03_2k.hdr',
    thumbnail: 'https://cdn.polyhaven.com/asset_img/primary/studio_small_03.png',
    description: 'Clean studio environment',
    lighting: { intensity: 1.2, warmth: 0.4, contrast: 0.5 },
    camera: { defaultDistance: 6, autoRotateSpeed: 0.2 }
  },
  {
    id: 'fallback-forest',
    name: 'Forest Fallback',
    category: 'natural',
    url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/forest_slope_2k.hdr',
    thumbnail: 'https://cdn.polyhaven.com/asset_img/primary/forest_slope.png',
    description: 'Natural forest environment',
    lighting: { intensity: 1.0, warmth: 0.7, contrast: 0.6 },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.3 }
  }
];

export const getPhotosByCategory = (category: PanoramicPhoto['category']) => {
  return PANORAMIC_PHOTO_LIBRARY.filter(photo => photo.category === category);
};

export const getPhotoById = (id: string): PanoramicPhoto | null => {
  console.log('🔍 Looking for photo ID:', id);
  const photo = PANORAMIC_PHOTO_LIBRARY.find(photo => photo.id === id);
  console.log('📸 Photo lookup result:', photo ? photo.name : 'NOT FOUND');
  return photo || null;
};

// Enhanced fallback system
export const getFallbackPhoto = (): PanoramicPhoto => {
  console.log('⚠️ Using fallback photo');
  return FALLBACK_PHOTOS[0]; // Studio fallback as primary
};

export const getBackupFallbackPhoto = (): PanoramicPhoto => {
  console.log('🚨 Using backup fallback photo');
  return FALLBACK_PHOTOS[1]; // Forest fallback as secondary
};
