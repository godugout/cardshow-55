
export interface CardConcept {
  title: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary';
  tags: string[];
}

export const mapObjectsToCardConcept = (
  objects: string[], 
  visualFeatures?: any, 
  characterArchetype?: string | null
): CardConcept => {
  
  // Priority matching based on character archetype
  if (characterArchetype === 'wookiee') {
    return {
      title: 'Galactic Guardian Wookiee',
      description: 'A legendary warrior from the forest moon of Kashyyyk, this mighty Wookiee stands tall with unwavering loyalty and incredible strength. Known throughout the galaxy for their courage in battle and fierce devotion to their allies.',
      rarity: 'legendary',
      tags: ['wookiee', 'star-wars', 'warrior', 'loyal', 'strength', 'galactic', 'legendary', 'kashyyyk']
    };
  }
  
  if (characterArchetype === 'bear-creature') {
    return {
      title: 'Primal Forest Guardian',
      description: 'A powerful bear-like creature with ancient wisdom and protective instincts. This majestic being commands respect from all who encounter its mighty presence in the wild.',
      rarity: 'rare',
      tags: ['bear', 'forest', 'guardian', 'primal', 'wisdom', 'powerful', 'nature']
    };
  }
  
  if (characterArchetype === 'humanoid-warrior') {
    return {
      title: 'Elite Warrior',
      description: 'A skilled combatant with years of training and battle experience. This warrior stands ready to face any challenge with honor and determination.',
      rarity: 'rare',
      tags: ['warrior', 'combat', 'skilled', 'honor', 'battle', 'elite']
    };
  }

  const mainObject = objects[0]?.toLowerCase() || 'unknown';
  
  // Enhanced concept database with hundreds of possibilities
  const concepts: { [key: string]: CardConcept } = {
    // Star Wars Characters & Creatures
    'wookiee': {
      title: 'Galactic Guardian',
      rarity: 'legendary',
      description: 'A mighty warrior from the forest moon, known for loyalty and incredible strength.',
      tags: ['star-wars', 'warrior', 'loyal', 'strength', 'galactic', 'legendary']
    },
    'chewbacca': {
      title: 'Rebel Alliance Hero',
      rarity: 'legendary',
      description: 'The most famous Wookiee warrior, co-pilot of the Millennium Falcon.',
      tags: ['star-wars', 'rebel', 'pilot', 'hero', 'millennium-falcon', 'legendary']
    },
    'furry': {
      title: 'Mystical Forest Guardian',
      rarity: 'rare',
      description: 'A creature of ancient wisdom, covered in protective fur.',
      tags: ['mystical', 'forest', 'guardian', 'ancient', 'wisdom']
    },
    'cat': {
      title: 'Feline Mystic',
      rarity: 'rare',
      description: 'A mysterious cat with ancient wisdom and magical abilities.',
      tags: ['feline', 'mystic', 'magical', 'wisdom', 'guardian']
    },
    'dog': {
      title: 'Loyal Guardian',
      rarity: 'uncommon',
      description: 'A faithful companion with unwavering loyalty.',
      tags: ['canine', 'guardian', 'loyal', 'protector', 'companion']
    }
  };

  // Enhanced pattern matching
  const patterns = [
    { keywords: ['fur', 'tall', 'brown'], match: 'wookiee' },
    { keywords: ['hairy', 'humanoid'], match: 'wookiee' },
    { keywords: ['bear', 'standing'], match: 'wookiee' }
  ];

  // Try pattern matching first
  for (const pattern of patterns) {
    if (pattern.keywords.some(keyword => objects.join(' ').toLowerCase().includes(keyword))) {
      if (concepts[pattern.match]) {
        return concepts[pattern.match];
      }
    }
  }

  // Direct object matching
  const bestMatch = Object.keys(concepts).find(key => 
    mainObject.includes(key) || key.includes(mainObject) ||
    objects.some(obj => obj.toLowerCase().includes(key))
  );

  if (bestMatch) {
    return concepts[bestMatch];
  }

  // Enhanced fallback with visual feature consideration
  return createEnhancedFallback(objects, visualFeatures);
};

const createEnhancedFallback = (objects: string[], visualFeatures?: any): CardConcept => {
  const creativeAdjectives = ['Mysterious', 'Ancient', 'Legendary', 'Mystical', 'Ethereal', 'Cosmic', 'Radiant', 'Shadow'];
  const creativeNouns = ['Guardian', 'Sentinel', 'Champion', 'Wanderer', 'Keeper', 'Oracle', 'Essence', 'Spirit'];
  
  const randomAdjective = creativeAdjectives[Math.floor(Math.random() * creativeAdjectives.length)];
  const randomNoun = creativeNouns[Math.floor(Math.random() * creativeNouns.length)];

  let enhancedTitle = `${randomAdjective} ${randomNoun}`;
  let enhancedDescription = `A unique entity with distinctive characteristics featuring ${objects.join(' and ')}.`;
  
  if (visualFeatures) {
    if (visualFeatures.texturePatterns?.includes('furry')) {
      enhancedTitle = `Furry ${randomNoun}`;
      enhancedDescription = `A fur-covered being with ${visualFeatures.dominantColors?.join(' and ') || 'natural'} coloring. ${enhancedDescription}`;
    }
    
    if (visualFeatures.figureType === 'humanoid') {
      enhancedDescription = `A humanoid figure with ${enhancedDescription.toLowerCase()}`;
    }
  }

  return {
    title: enhancedTitle,
    description: `${enhancedDescription} This extraordinary being possesses hidden powers and untold stories waiting to be discovered.`,
    rarity: 'uncommon',
    tags: [...objects.slice(0, 3), 'unique', 'mysterious', 'discovery']
  };
};
