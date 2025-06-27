
export interface CardData {
  id?: string;
  title: string;
  description?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary';
  tags: string[];
  image_url?: string;
  thumbnail_url?: string;
  design_metadata?: Record<string, any>;
  visibility: 'public' | 'private' | 'shared';
  template_id?: string;
  type?: string;
  series?: string;
  creator_attribution?: {
    creator_name: string;
    creator_id: string;
    collaboration_type: 'solo' | 'collaboration';
  };
  publishing_options?: {
    marketplace_listing: boolean;
    crd_catalog_inclusion: boolean;
    print_available: boolean;
    pricing?: {
      base_price?: number;
      currency: string;
    };
    distribution: {
      limited_edition: boolean;
    };
  };
  verification_status?: 'pending' | 'verified' | 'rejected';
  print_metadata?: Record<string, any>;
  creator_id?: string;
  // Add properties for local storage sync management
  needsSync?: boolean;
  isLocal?: boolean;
  // Add database-specific properties
  is_public?: boolean;
  shop_id?: string;
  collection_id?: string;
  team_id?: string;
}

export type CardRarity = 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary';
export type CardVisibility = 'private' | 'public' | 'shared';

export interface CreatorAttribution {
  creator_name?: string;
  creator_id?: string;
  collaboration_type?: 'solo' | 'collaboration' | 'commission';
  additional_credits?: Array<{
    name: string;
    role: string;
  }>;
}

export interface PublishingOptions {
  marketplace_listing: boolean;
  crd_catalog_inclusion: boolean;
  print_available: boolean;
  pricing?: {
    base_price?: number;
    print_price?: number;
    currency: string;
  };
  distribution?: {
    limited_edition: boolean;
    edition_size?: number;
  };
}

export interface DesignTemplate {
  id: string;
  name: string;
  category: string;
  description?: string;
  preview_url?: string;
  template_data: Record<string, any>;
  is_premium: boolean;
  usage_count: number;
  tags: string[];
}
