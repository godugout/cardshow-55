
import { CardRepository } from '@/repositories/cardRepository';
import { CardStorageService } from './cardStorage';
import type { CardData } from '@/hooks/card-editor/types';

export interface MigrationResult {
  success: boolean;
  totalCards: number;
  migratedCount: number;
  failedCount: number;
  errors: Array<{
    cardId: string;
    cardTitle: string;
    error: string;
  }>;
  warnings: string[];
}

export interface CardValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class CardMigrationService {
  // Validate card data before migration
  static validateCard(card: CardData): CardValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!card.title?.trim()) {
      errors.push('Card title is required');
    }
    
    if (!card.id) {
      warnings.push('Card ID is missing, will be generated');
    }

    // Validate rarity
    const validRarities = ['common', 'uncommon', 'rare', 'ultra-rare', 'legendary'];
    if (card.rarity && !validRarities.includes(card.rarity)) {
      warnings.push(`Invalid rarity "${card.rarity}", will be mapped to common`);
    }

    // Validate visibility
    const validVisibilities = ['public', 'private', 'shared'];
    if (card.visibility && !validVisibilities.includes(card.visibility)) {
      warnings.push(`Invalid visibility "${card.visibility}", will be set to private`);
    }

    // Validate arrays
    if (card.tags && !Array.isArray(card.tags)) {
      errors.push('Tags must be an array');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Convert card data for database insertion
  static prepareCardForDatabase(card: CardData, userId: string): any {
    // Map rarity to database enum
    const rarityMap: Record<string, string> = {
      'common': 'common',
      'uncommon': 'uncommon',
      'rare': 'rare',
      'ultra-rare': 'legendary', // Map ultra-rare to legendary
      'legendary': 'legendary'
    };

    const dbRarity = rarityMap[card.rarity] || 'common';

    return {
      title: card.title?.trim() || 'Untitled Card',
      description: card.description?.trim() || '',
      creator_id: userId,
      image_url: card.image_url || null,
      thumbnail_url: card.thumbnail_url || null,
      rarity: dbRarity,
      tags: Array.isArray(card.tags) ? card.tags : [],
      design_metadata: card.design_metadata || {},
      is_public: card.visibility === 'public',
      visibility: card.visibility || 'private',
      marketplace_listing: card.publishing_options?.marketplace_listing || false,
      print_available: card.publishing_options?.print_available || false,
      series: card.series || null,
      verification_status: 'pending'
    };
  }

  // Preview migration without executing
  static async previewMigration(userId: string): Promise<{
    report: any;
    validCards: number;
    invalidCards: number;
    validationIssues: Array<{
      cardId: string;
      cardTitle: string;
      errors: string[];
      warnings: string[];
    }>;
  }> {
    // First consolidate storage
    CardStorageService.consolidateStorage();
    
    const report = CardStorageService.getStorageReport();
    const allCards = CardStorageService.getAllCards();
    
    let validCards = 0;
    let invalidCards = 0;
    const validationIssues: Array<{
      cardId: string;
      cardTitle: string;
      errors: string[];
      warnings: string[];
    }> = [];

    for (const card of allCards) {
      const validation = this.validateCard(card);
      
      if (validation.isValid) {
        validCards++;
      } else {
        invalidCards++;
      }

      if (validation.errors.length > 0 || validation.warnings.length > 0) {
        validationIssues.push({
          cardId: card.id || 'unknown',
          cardTitle: card.title || 'Untitled',
          errors: validation.errors,
          warnings: validation.warnings
        });
      }
    }

    return {
      report,
      validCards,
      invalidCards,
      validationIssues
    };
  }

  // Execute migration
  static async executeMigration(userId: string): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: false,
      totalCards: 0,
      migratedCount: 0,
      failedCount: 0,
      errors: [],
      warnings: []
    };

    try {
      // First consolidate storage
      const consolidation = CardStorageService.consolidateStorage();
      if (consolidation.errors.length > 0) {
        result.warnings.push(...consolidation.errors);
      }

      const allCards = CardStorageService.getAllCards();
      result.totalCards = allCards.length;

      if (allCards.length === 0) {
        result.success = true;
        result.warnings.push('No cards found to migrate');
        return result;
      }

      console.log(`🔄 Starting migration of ${allCards.length} cards...`);

      // Process each card
      for (const card of allCards) {
        try {
          // Validate card
          const validation = this.validateCard(card);
          if (!validation.isValid) {
            result.errors.push({
              cardId: card.id || 'unknown',
              cardTitle: card.title || 'Untitled',
              error: `Validation failed: ${validation.errors.join(', ')}`
            });
            result.failedCount++;
            continue;
          }

          if (validation.warnings.length > 0) {
            result.warnings.push(`${card.title}: ${validation.warnings.join(', ')}`);
          }

          // Prepare for database
          const dbCard = this.prepareCardForDatabase(card, userId);
          
          // Attempt database insertion
          const dbResult = await CardRepository.createCard(dbCard);
          
          if (dbResult) {
            result.migratedCount++;
            console.log(`✅ Migrated "${card.title}" to database`);
          } else {
            result.errors.push({
              cardId: card.id || 'unknown',
              cardTitle: card.title || 'Untitled',
              error: 'Database insertion failed - no result returned'
            });
            result.failedCount++;
          }
        } catch (error) {
          result.errors.push({
            cardId: card.id || 'unknown',
            cardTitle: card.title || 'Untitled',
            error: error instanceof Error ? error.message : 'Unknown error'
          });
          result.failedCount++;
          console.error(`❌ Failed to migrate "${card.title}":`, error);
        }
      }

      result.success = result.migratedCount > 0;
      
      console.log(`🎯 Migration completed: ${result.migratedCount} success, ${result.failedCount} failed`);
      
      return result;
    } catch (error) {
      result.errors.push({
        cardId: 'system',
        cardTitle: 'Migration System',
        error: error instanceof Error ? error.message : 'Unknown system error'
      });
      return result;
    }
  }
}
