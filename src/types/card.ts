
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
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

// Add the missing Card interface that other files are trying to import
export interface Card {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  creator_id: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  tags: string[];
  design_metadata: Record<string, any>;
  visibility: CardVisibility;
  is_public?: boolean;
  created_at: string;
  updated_at: string;
  template_id?: string;
  collection_id?: string;
  team_id?: string;
  price?: number;
  edition_size?: number;
  marketplace_listing?: boolean;
  crd_catalog_inclusion?: boolean;
  print_available?: boolean;
  verification_status?: 'pending' | 'verified' | 'rejected';
  print_metadata?: Record<string, any>;
  series?: string;
  edition_number?: number;
  total_supply?: number;
}

// Add CardCreateParams interface for repository
export interface CardCreateParams {
  title: string;
  description?: string;
  creator_id: string;
  image_url?: string;
  thumbnail_url?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  tags: string[];
  design_metadata: Record<string, any>;
  visibility: CardVisibility;
  is_public?: boolean;
  template_id?: string;
  collection_id?: string;
  team_id?: string;
  price?: number;
  edition_size?: number;
  marketplace_listing?: boolean;
  crd_catalog_inclusion?: boolean;
  print_available?: boolean;
  verification_status?: 'pending' | 'verified' | 'rejected';
  print_metadata?: Record<string, any>;
  series?: string;
  edition_number?: number;
  total_supply?: number;
  updated_at?: string;
}

export interface CardData {
  id?: string;
  title: string;
  description?: string;
  rarity: CardRarity;
  tags: string[];
  image_url?: string;
  thumbnail_url?: string;
  design_metadata: Record<string, any>;
  visibility: CardVisibility;
  is_public?: boolean;
  template_id?: string;
  collection_id?: string;
  team_id?: string;
  creator_attribution: CreatorAttribution;
  publishing_options: PublishingOptions;
  verification_status?: 'pending' | 'verified' | 'rejected';
  print_metadata?: Record<string, any>;
  creator_id?: string;
  price?: number;
  edition_size?: number;
  marketplace_listing?: boolean;
  crd_catalog_inclusion?: boolean;
  print_available?: boolean;
}
