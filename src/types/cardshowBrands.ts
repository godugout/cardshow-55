
export type BrandRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
export type UnlockMethod = 'starter' | 'achievement' | 'premium' | 'seasonal' | 'special' | 'legacy';
export type BrandCategory = 'Script' | 'Bold' | 'Retro' | 'Modern' | 'Fantasy' | 'SciFi' | 'Classic';
export type FontStyle = 'Script' | 'Block' | 'Sans' | 'Serif' | 'Display' | 'Unknown';

export interface CardshowBrand {
  id: string;
  
  // Core Identification
  dna_code: string;
  file_name: string;
  display_name: string;
  product_name?: string;
  
  // Visual Assets
  image_url: string;
  thumbnail_url?: string;
  file_size?: number;
  image_dimensions?: Record<string, any>;
  
  // Categorization
  category: BrandCategory;
  group_type?: string;
  font_style: FontStyle;
  design_elements: string[];
  style_tags: string[];
  
  // Color System
  color_palette: string[];
  primary_color: string;
  secondary_color: string;
  tertiary_color?: string;
  quaternary_color?: string;
  
  // Theme Integration
  logo_theme: Record<string, any>;
  theme_usage: Record<string, any>;
  
  // Team/Organization Data
  team_code?: string;
  team_name?: string;
  team_city?: string;
  league?: string;
  mascot?: string;
  founded_year?: number;
  decade?: string;
  
  // Gaming/Collectibility Attributes
  rarity: BrandRarity;
  power_level: number;
  unlock_method: UnlockMethod;
  collectibility_score: number;
  is_blendable: boolean;
  is_remixable: boolean;
  total_supply?: number;
  current_supply: number;
  drop_rate: number;
  
  // Metadata & Management
  description?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  is_active: boolean;
  sort_order: number;
}

export interface BrandMintingRules {
  id: string;
  brand_id: string;
  requires_achievement?: string;
  seasonal_only: boolean;
  requires_purchase: boolean;
  pack_exclusive: boolean;
  special_requirements: Record<string, any>;
  created_at: string;
}

export interface BrandUsageStats {
  id: string;
  brand_id: string;
  user_id?: string;
  usage_count: number;
  last_used_at: string;
  usage_context?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBrandRequest {
  dna_code: string;
  file_name: string;
  display_name: string;
  product_name?: string;
  image_url: string;
  category: BrandCategory;
  color_palette: string[];
  primary_color: string;
  secondary_color: string;
  logo_theme: Record<string, any>;
  theme_usage: Record<string, any>;
  team_code?: string;
  team_name?: string;
  league?: string;
  rarity?: BrandRarity;
  description?: string;
}
