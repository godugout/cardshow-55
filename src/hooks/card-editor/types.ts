
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
  type?: string; // Added missing property
  series?: string; // Added missing property
  creator_attribution?: {
    creator_name: string;
    creator_id: string;
    collaboration_type: 'solo' | 'collaboration';
  };
  publishing_options?: {
    marketplace_listing: boolean;
    crd_catalog_inclusion: boolean;
    print_available: boolean;
    pricing: {
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

export interface CreatorAttribution {
  creator_name: string;
  creator_id: string;
  collaboration_type: 'solo' | 'collaboration';
}

export interface PublishingOptions {
  marketplace_listing: boolean;
  crd_catalog_inclusion: boolean;
  print_available: boolean;
  pricing: {
    currency: string;
  };
  distribution: {
    limited_edition: boolean;
  };
}
