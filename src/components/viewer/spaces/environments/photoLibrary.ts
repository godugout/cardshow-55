
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
  // Natural Environments - Using Polyhaven HDRIs (CC0 License)
  {
    id: 'forest-clearing',
    name: 'Forest Clearing',
    category: 'natural',
    url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/forest_slope_1k.hdr',
    thumbnail: 'https://cdn.polyhaven.com/asset_img/primary/forest_slope.png',
    description: 'Sunlit forest clearing with dappled light',
    lighting: { intensity: 0.8, warmth: 0.7, contrast: 0.6 },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.3 }
  },
  {
    id: 'mountain-vista',
    name: 'Mountain Vista',
    category: 'natural',
    url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/kiara_1_dawn_1k.hdr',
    thumbnail: 'https://cdn.polyhaven.com/asset_img/primary/kiara_1_dawn.png',
    description: 'Panoramic mountain landscape with dramatic sky',
    lighting: { intensity: 1.0, warmth: 0.6, contrast: 0.8 },
    camera: { defaultDistance: 10, autoRotateSpeed: 0.2 }
  },
  {
    id: 'ocean-sunset',
    name: 'Ocean Sunset',
    category: 'natural',
    url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr',
    thumbnail: 'https://cdn.polyhaven.com/asset_img/primary/venice_sunset.png',
    description: 'Golden hour ocean view with warm lighting',
    lighting: { intensity: 0.9, warmth: 0.9, contrast: 0.7 },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.4 }
  },

  // Urban Environments
  {
    id: 'city-rooftop',
    name: 'City Rooftop',
    category: 'urban',
    url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/shanghai_bund_1k.hdr',
    thumbnail: 'https://cdn.polyhaven.com/asset_img/primary/shanghai_bund.png',
    description: 'Urban skyline from rooftop perspective',
    lighting: { intensity: 0.7, warmth: 0.5, contrast: 0.9 },
    camera: { defaultDistance: 9, autoRotateSpeed: 0.3 }
  },
  {
    id: 'urban-alley',
    name: 'Urban Alley',
    category: 'urban',
    url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/small_hangar_01_1k.hdr',
    thumbnail: 'https://cdn.polyhaven.com/asset_img/primary/small_hangar_01.png',
    description: 'Industrial urban environment with dramatic lighting',
    lighting: { intensity: 0.6, warmth: 0.3, contrast: 1.0 },
    camera: { defaultDistance: 7, autoRotateSpeed: 0.5 }
  },

  // Interior Spaces
  {
    id: 'modern-studio',
    name: 'Modern Studio',
    category: 'interior',
    url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_03_1k.hdr',
    thumbnail: 'https://cdn.polyhaven.com/asset_img/primary/studio_small_03.png',
    description: 'Clean, modern studio with perfect lighting',
    lighting: { intensity: 1.1, warmth: 0.4, contrast: 0.5 },
    camera: { defaultDistance: 6, autoRotateSpeed: 0.2 }
  },
  {
    id: 'warehouse-loft',
    name: 'Warehouse Loft',
    category: 'interior',
    url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/industrial_workshop_foundry_1k.hdr',
    thumbnail: 'https://cdn.polyhaven.com/asset_img/primary/industrial_workshop_foundry.png',
    description: 'Industrial loft with dramatic windows',
    lighting: { intensity: 0.8, warmth: 0.6, contrast: 0.8 },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.1 }
  },

  // Sports Venues
  {
    id: 'basketball-arena',
    name: 'Basketball Arena',
    category: 'sports',
    url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/royal_esplanade_1k.hdr',
    thumbnail: 'https://cdn.polyhaven.com/asset_img/primary/royal_esplanade.png',
    description: 'Professional sports arena atmosphere',
    lighting: { intensity: 1.0, warmth: 0.5, contrast: 0.8 },
    camera: { defaultDistance: 12, autoRotateSpeed: 0.3 }
  },

  // Cultural Spaces
  {
    id: 'concert-hall',
    name: 'Concert Hall',
    category: 'cultural',
    url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/dancing_hall_1k.hdr',
    thumbnail: 'https://cdn.polyhaven.com/asset_img/primary/dancing_hall.png',
    description: 'Grand concert hall with ornate architecture',
    lighting: { intensity: 0.7, warmth: 0.7, contrast: 0.8 },
    camera: { defaultDistance: 10, autoRotateSpeed: 0.1 }
  },

  // Fantasy Environments (fallback procedural)
  {
    id: 'cosmic-void',
    name: 'Cosmic Void',
    category: 'fantasy',
    url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/starmap_2020_1k.hdr',
    thumbnail: 'https://cdn.polyhaven.com/asset_img/primary/starmap_2020.png',
    description: 'Deep space with stars and nebula',
    lighting: { intensity: 0.5, warmth: 0.3, contrast: 1.0 },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.4 }
  }
];

export const getPhotosByCategory = (category: PanoramicPhoto['category']) => {
  return PANORAMIC_PHOTO_LIBRARY.filter(photo => photo.category === category);
};

export const getPhotoById = (id: string) => {
  const photo = PANORAMIC_PHOTO_LIBRARY.find(photo => photo.id === id);
  console.log('🔍 Looking for photo ID:', id, 'Found:', photo ? photo.name : 'NOT FOUND');
  return photo;
};

// Fallback photo for when specific photo is not found
export const getFallbackPhoto = (): PanoramicPhoto => {
  return PANORAMIC_PHOTO_LIBRARY[0]; // Forest clearing as default
};
