
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';

export interface MigrationResult {
  success: boolean;
  migratedCount: number;
  errors: string[];
}

// Mock cards data for migration - these will be migrated to the database
const mockCards = [
  {
    id: 'card_1',
    title: 'Lightning Striker',
    description: 'A powerful athlete captured in motion',
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    rarity: 'rare' as const,
    tags: ['sports', 'action', 'athlete'],
    design_metadata: {
      effects: {
        holographic: true,
        chrome: false,
        foil: false,
        intensity: 0.8
      }
    },
    visibility: 'public' as const,
    template_id: 'sports_portrait_001',
    publishing_options: {
      marketplace_listing: true,
      crd_catalog_inclusion: true,
      print_available: true,
      pricing: {
        base_price: 15.99,
        currency: 'USD'
      },
      distribution: {
        limited_edition: true,
        edition_size: 500
      }
    }
  },
  {
    id: 'card_2',
    title: 'Cosmic Wanderer',
    description: 'An explorer of distant galaxies',
    image_url: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400',
    rarity: 'legendary' as const,
    tags: ['space', 'exploration', 'cosmic'],
    design_metadata: {
      effects: {
        holographic: false,
        chrome: true,
        foil: true,
        intensity: 0.9
      }
    },
    visibility: 'public' as const,
    template_id: 'cosmic_portrait_001',
    publishing_options: {
      marketplace_listing: true,
      crd_catalog_inclusion: true,
      print_available: true,
      pricing: {
        base_price: 29.99,
        currency: 'USD'
      },
      distribution: {
        limited_edition: true,
        edition_size: 100
      }
    }
  },
  {
    id: 'card_3',
    title: 'Digital Pioneer',
    description: 'Leading the future of technology',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    rarity: 'epic' as const,
    tags: ['technology', 'innovation', 'future'],
    design_metadata: {
      effects: {
        holographic: true,
        chrome: true,
        foil: false,
        intensity: 0.7
      }
    },
    visibility: 'public' as const,
    template_id: 'tech_portrait_001',
    publishing_options: {
      marketplace_listing: true,
      crd_catalog_inclusion: true,
      print_available: false,
      pricing: {
        base_price: 12.99,
        currency: 'USD'
      },
      distribution: {
        limited_edition: false,
        edition_size: 1000
      }
    }
  }
];

export const migrateMockDataToDatabase = async (creatorId: string): Promise<MigrationResult> => {
  const result: MigrationResult = {
    success: true,
    migratedCount: 0,
    errors: []
  };

  console.log('🔄 Starting mock data migration...');

  for (const mockCard of mockCards) {
    try {
      // Transform mock card data to database format
      const cardData = {
        id: mockCard.id,
        title: mockCard.title,
        description: mockCard.description,
        creator_id: creatorId,
        image_url: mockCard.image_url,
        thumbnail_url: mockCard.image_url, // Use same image as thumbnail for now
        rarity: mockCard.rarity,
        tags: mockCard.tags,
        design_metadata: mockCard.design_metadata,
        edition_size: mockCard.publishing_options.distribution?.edition_size || 1,
        price: mockCard.publishing_options.pricing?.base_price,
        is_public: mockCard.visibility === 'public',
        template_id: mockCard.template_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Check if card already exists
      const { data: existingCard } = await supabase
        .from('cards')
        .select('id')
        .eq('id', mockCard.id)
        .single();

      if (existingCard) {
        console.log(`⚠️ Card ${mockCard.title} already exists, skipping...`);
        continue;
      }

      // Insert the card
      const { error } = await supabase
        .from('cards')
        .insert(cardData);

      if (error) {
        console.error(`❌ Failed to migrate card ${mockCard.title}:`, error);
        result.errors.push(`Failed to migrate ${mockCard.title}: ${error.message}`);
        result.success = false;
      } else {
        console.log(`✅ Successfully migrated card: ${mockCard.title}`);
        result.migratedCount++;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Error migrating card ${mockCard.title}:`, errorMessage);
      result.errors.push(`Error migrating ${mockCard.title}: ${errorMessage}`);
      result.success = false;
    }
  }

  console.log(`🎯 Migration complete. Migrated ${result.migratedCount} cards.`);
  
  if (result.errors.length > 0) {
    console.error('Migration errors:', result.errors);
  }

  return result;
};

export const checkMigrationStatus = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('cards')
      .select('id')
      .in('id', mockCards.map(card => card.id));

    if (error) {
      console.error('Error checking migration status:', error);
      return false;
    }

    return data && data.length === mockCards.length;
  } catch (error) {
    console.error('Error checking migration status:', error);
    return false;
  }
};
