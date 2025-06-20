
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
export type CardVisibility = 'private' | 'public' | 'shared';
export type CardType = 'athlete' | 'creature' | 'spell' | 'artifact' | 'vehicle' | 'character';

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
  description: string | null;
  image_url: string | null;
  thumbnail_url: string | null;
  creator_id: string;
  rarity: CardRarity;
  tags: string[];
  design_metadata: Record<string, any> | null;
  visibility: CardVisibility;
  is_public: boolean;
  created_at: string;
  updated_at: string | null;
  template_id: string | null;
  collection_id: string | null;
  team_id: string | null;
  price: number | null;
  edition_size: number | null; // Make this nullable to match database
  marketplace_listing: boolean;
  crd_catalog_inclusion: boolean | null;
  print_available: boolean | null;
  verification_status: 'pending' | 'verified' | 'rejected' | null;
  print_metadata: Record<string, any> | null;
  series: string | null;
  edition_number: number | null;
  total_supply: number | null;
  // Additional database fields
  abilities: string[] | null;
  base_price: number | null;
  card_type: CardType | null;
  current_market_value: number | null;
  favorite_count: number | null;
  view_count: number | null;
  royalty_percentage: number | null;
  serial_number: number | null;
  set_id: string | null;
  mana_cost: Record<string, any> | null;
  toughness: number | null;
  power: number | null;
}

// Update CardCreateParams to match database requirements
export interface CardCreateParams {
  title: string;
  description?: string | null;
  creator_id: string;
  image_url?: string | null;
  thumbnail_url?: string | null;
  rarity: CardRarity;
  tags: string[];
  design_metadata: Record<string, any>;
  visibility: CardVisibility;
  is_public: boolean;
  template_id?: string | null;
  collection_id?: string | null;
  team_id?: string | null;
  price?: number | null;
  edition_size?: number | null;
  marketplace_listing: boolean;
  crd_catalog_inclusion?: boolean | null;
  print_available?: boolean | null;
  verification_status?: 'pending' | 'verified' | 'rejected' | null;
  print_metadata?: Record<string, any> | null;
  series?: string | null;
  edition_number?: number | null;
  total_supply?: number | null;
  updated_at?: string;
  abilities?: string[] | null;
  base_price?: number | null;
  card_type?: CardType | null;
  current_market_value?: number | null;
  favorite_count?: number | null;
  view_count?: number | null;
  royalty_percentage?: number | null;
  serial_number?: number | null;
  set_id?: string | null;
  mana_cost?: Record<string, any> | null;
  toughness?: number | null;
  power?: number | null;
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
  type?: string;
  series?: string;
  edition_number?: number;
  total_supply?: number;
  needsSync?: boolean;
  isLocal?: boolean;
  // Additional fields to match database
  abilities?: string[] | null;
  base_price?: number | null;
  card_type?: CardType | null;
  current_market_value?: number | null;
  favorite_count?: number | null;
  view_count?: number | null;
  royalty_percentage?: number | null;
  serial_number?: number | null;
  set_id?: string | null;
  mana_cost?: Record<string, any> | null;
  toughness?: number | null;
  power?: number | null;
}
