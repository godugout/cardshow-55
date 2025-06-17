
import type { CardCreateParams } from '@/repositories/cardRepository';
import type { User } from '@/types/user';

// Helper function to map AI analysis rarity to valid database rarity types
export const mapRarityToValidType = (rarity: string): 'common' | 'uncommon' | 'rare' | 'legendary' => {
  const rarityMap: Record<string, 'common' | 'uncommon' | 'rare' | 'legendary'> = {
    'common': 'common',
    'uncommon': 'uncommon', 
    'rare': 'rare',
    'epic': 'rare', // Map epic to rare since epic is not in the database type
    'legendary': 'legendary'
  };
  
  return rarityMap[rarity.toLowerCase()] || 'common';
};

// Generate more varied fallback data based on filename
export const generateFallbackData = (filename: string) => {
  const baseName = filename.replace(/\.[^/.]+$/, ""); // Remove extension
  const randomTitles = [
    `${baseName} Trading Card`,
    `Legendary ${baseName}`,
    `Elite ${baseName} Card`,
    `Custom ${baseName} Collectible`,
    `Rare ${baseName} Edition`
  ];
  
  const randomDescriptions = [
    "A unique collectible card featuring custom artwork and distinctive design elements.",
    "An exclusive trading card with premium quality materials and exceptional craftsmanship.",
    "A rare collectible showcasing unique visual appeal and artistic excellence.",
    "A custom-designed card with special characteristics and premium finishing.",
    "An exceptional trading card with distinctive features and collector value."
  ];
  
  const randomRarities: ('common' | 'uncommon' | 'rare' | 'legendary')[] = ['common', 'uncommon', 'rare', 'legendary'];
  const randomTags = [
    ['custom', 'trading-card', 'collectible'],
    ['rare', 'premium', 'exclusive'],
    ['artwork', 'design', 'unique'],
    ['limited-edition', 'special'],
    ['collector', 'vintage', 'classic']
  ];
  
  const randomIndex = Math.floor(Math.random() * randomTitles.length);
  
  return {
    title: randomTitles[randomIndex],
    description: randomDescriptions[randomIndex],
    rarity: randomRarities[Math.floor(Math.random() * randomRarities.length)],
    tags: randomTags[Math.floor(Math.random() * randomTags.length)],
    category: 'Custom Trading Card',
    type: 'Character',
    series: 'Bulk Upload Collection'
  };
};

// Create card data with proper typing for CardCreateParams
export const createCardCreateParams = (
  analysis: any,
  filename: string,
  imageDataUrl: string,
  user: User,
  aiAnalysisWorked: boolean
): CardCreateParams => {
  const fallbackData = generateFallbackData(filename);
  
  return {
    title: analysis.title || fallbackData.title,
    description: analysis.description || fallbackData.description,
    creator_id: user.id,
    image_url: imageDataUrl,
    thumbnail_url: imageDataUrl,
    rarity: mapRarityToValidType(analysis.rarity || 'common'),
    tags: analysis.tags || ['custom', 'bulk-upload'],
    design_metadata: {
      aiGenerated: aiAnalysisWorked,
      originalFilename: filename,
      analysis: analysis,
      processingMethod: 'bulk-upload-v2',
      imageProcessing: {
        scalingMethod: 'fill',
        cardDimensions: { width: 350, height: 490 },
        backgroundColor: '#ffffff',
        compressionQuality: 0.9
      }
    },
    visibility: 'public',
    is_public: true,
    marketplace_listing: false,
    series: 'Bulk Upload Collection'
  };
};
