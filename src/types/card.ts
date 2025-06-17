
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

// Update Card interface to match database schema exactly
export interface Card {
  id: string;
  title: string;
  description: string; // Required in database
  image_url: string; // Required in database
  thumbnail_url: string; // Required in database
  creator_id: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'; // Include 'epic' to match database
  tags: string[];
  design_metadata: Record<string, any>;
  visibility: CardVisibility;
  is_public: boolean; // Required in database
  created_at: string;
  updated_at: string;
  template_id: string | null; // Match database nullable fields
  collection_id: string | null;
  team_id: string | null;
  price: number | null;
  edition_size: number | null;
  marketplace_listing: boolean; // Required in database
  crd_catalog_inclusion: boolean | null;
  print_available: boolean | null;
  verification_status: 'pending' | 'verified' | 'rejected' | null;
  print_metadata: Record<string, any>;
  series: string | null;
  edition_number: number | null;
  total_supply: number | null;
}

// Update CardCreateParams to match database requirements
export interface CardCreateParams {
  title: string;
  description: string; // Required in database
  creator_id: string;
  image_url: string; // Required in database
  thumbnail_url: string; // Required in database
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  tags: string[];
  design_metadata: Record<string, any>;
  visibility: CardVisibility;
  is_public: boolean; // Required in database
  template_id?: string | null;
  collection_id?: string | null;
  team_id?: string | null;
  price?: number | null;
  edition_size?: number | null;
  marketplace_listing: boolean; // Required in database
  crd_catalog_inclusion?: boolean | null;
  print_available?: boolean | null;
  verification_status?: 'pending' | 'verified' | 'rejected' | null;
  print_metadata?: Record<string, any>;
  series?: string | null;
  edition_number?: number | null;
  total_supply?: number | null;
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
  // Add missing fields that are used in the codebase
  type?: string;
  series?: string;
  edition_number?: number;
  total_supply?: number;
  // Add properties for local storage sync management
  needsSync?: boolean;
  isLocal?: boolean;
}
