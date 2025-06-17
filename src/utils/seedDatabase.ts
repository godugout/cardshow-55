
import { supabase } from '@/integrations/supabase/client';
import type { CardData } from '@/hooks/useCardEditor';

export const sampleCards: Partial<CardData>[] = [
  {
    title: 'LeBron James',
    description: 'Los Angeles Lakers - Forward',
    rarity: 'legendary',
    tags: ['basketball', 'nba', 'lebron', 'lakers'],
    image_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=600&fit=crop',
    design_metadata: {
      player: {
        name: 'LeBron James',
        team: 'Los Angeles Lakers',
        position: 'Forward',
        stats: {
          points: 27.2,
          rebounds: 7.5,
          assists: 7.3
        }
      },
      effects: {
        holographic: true,
        chrome: false,
        foil: true,
        intensity: 0.8
      }
    },
    visibility: 'public',
    is_public: true
  },
  {
    title: 'Stephen Curry',
    description: 'Golden State Warriors - Point Guard',
    rarity: 'epic',
    tags: ['basketball', 'nba', 'curry', 'warriors'],
    image_url: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=400&h=600&fit=crop',
    design_metadata: {
      player: {
        name: 'Stephen Curry',
        team: 'Golden State Warriors',
        position: 'Point Guard',
        stats: {
          points: 29.5,
          rebounds: 5.1,
          assists: 6.3
        }
      },
      effects: {
        holographic: false,
        chrome: true,
        foil: false,
        intensity: 0.6
      }
    },
    visibility: 'public',
    is_public: true
  },
  {
    title: 'Kevin Durant',
    description: 'Phoenix Suns - Forward',
    rarity: 'rare',
    tags: ['basketball', 'nba', 'durant', 'suns'],
    image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=600&fit=crop',
    design_metadata: {
      player: {
        name: 'Kevin Durant',
        team: 'Phoenix Suns',
        position: 'Forward',
        stats: {
          points: 26.8,
          rebounds: 6.7,
          assists: 5.0
        }
      },
      effects: {
        holographic: false,
        chrome: false,
        foil: true,
        intensity: 0.7
      }
    },
    visibility: 'public',
    is_public: true
  }
];

export const seedSampleCards = async (userId: string) => {
  try {
    console.log('Seeding database with sample cards...');
    
    const cardsToInsert = sampleCards.map(card => ({
      ...card,
      creator_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('cards')
      .insert(cardsToInsert)
      .select();

    if (error) {
      console.error('Error seeding cards:', error);
      throw error;
    }

    console.log(`Successfully seeded ${data?.length || 0} sample cards`);
    return data;
  } catch (error) {
    console.error('Failed to seed sample cards:', error);
    throw error;
  }
};

export const checkIfDatabaseHasCards = async () => {
  try {
    const { data, error } = await supabase
      .from('cards')
      .select('id')
      .eq('is_public', true)
      .limit(1);

    if (error) throw error;
    
    return (data?.length || 0) > 0;
  } catch (error) {
    console.error('Error checking for cards:', error);
    return false;
  }
};
