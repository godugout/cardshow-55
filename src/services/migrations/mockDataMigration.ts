
import { supabase } from '@/lib/supabase-client';
import { mockCards } from '@/pages/Studio/mockData';
import { toast } from 'sonner';

export interface MigrationResult {
  success: boolean;
  migratedCount: number;
  errors: string[];
}

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
