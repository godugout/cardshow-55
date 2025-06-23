
export interface CardImageData {
  id: string;
  original_url: string;
  thumbnail_url: string;
  display_url: string;
  high_res_url: string;
  webp_url?: string;
  avif_url?: string;
  width: number;
  height: number;
  file_size: number;
  format: string;
  alt_text?: string;
}

export interface CardTemplate {
  id: string;
  name: string;
  category: 'sports' | 'gaming' | 'entertainment' | 'custom';
  layout: Record<string, any>;
  default_attributes: Record<string, any>;
  preview_url: string;
  is_premium: boolean;
}

export interface CardAttribute {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'date' | 'boolean';
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface CardRarityConfig {
  value: string;
  label: string;
  color: string;
  gradient: string;
  glow: string;
  border: string;
  effect?: 'holographic' | 'foil' | 'chrome' | 'matte';
}

export interface CardViewMode {
  mode: 'thumbnail' | 'preview' | 'detail' | 'grid';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  layout: 'list' | 'grid' | 'masonry';
}

export interface CardFilterOptions {
  rarity?: string[];
  type?: string[];
  creator?: string[];
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  sortBy: 'created_at' | 'updated_at' | 'price' | 'rarity' | 'popularity';
  sortOrder: 'asc' | 'desc';
}
