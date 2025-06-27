
export const enhancedObjectToCardConcept = (objects: string[]) => {
  const concepts: { [key: string]: { title: string; description: string; rarity: string; tags: string[] } } = {
    'wookiee': {
      title: 'Galactic Warrior',
      description: 'A legendary being from distant worlds, known for fierce loyalty and incredible strength in battle.',
      rarity: 'legendary',
      tags: ['galactic', 'warrior', 'loyal', 'strength', 'legendary']
    },
    'furry': {
      title: 'Forest Guardian',
      description: 'A mystical creature covered in protective fur, guardian of ancient secrets and natural wisdom.',
      rarity: 'rare',
      tags: ['mystical', 'forest', 'guardian', 'ancient', 'wisdom']
    },
    'pig': {
      title: 'Barnyard Champion',
      description: 'A mighty farm hero with incredible strength and determination.',
      rarity: 'uncommon',
      tags: ['farm', 'animal', 'champion', 'barnyard', 'strength']
    },
    'cat': {
      title: 'Feline Mystic',
      description: 'A mysterious cat with ancient wisdom and magical abilities.',
      rarity: 'rare',
      tags: ['feline', 'mystic', 'magical', 'wisdom', 'guardian']
    }
  };

  const mainObject = objects[0]?.toLowerCase() || 'unknown';
  
  // Enhanced pattern matching
  const patterns = [
    { keywords: ['fur', 'brown', 'tall'], match: 'wookiee' },
    { keywords: ['hairy', 'humanoid'], match: 'wookiee' },
    { keywords: ['bear', 'standing'], match: 'bear' }
  ];

  for (const pattern of patterns) {
    if (pattern.keywords.some(keyword => objects.join(' ').toLowerCase().includes(keyword))) {
      if (concepts[pattern.match]) {
        return concepts[pattern.match];
      }
    }
  }

  const bestMatch = Object.keys(concepts).find(key => 
    mainObject.includes(key) || key.includes(mainObject) ||
    objects.some(obj => obj.toLowerCase().includes(key))
  );

  if (bestMatch) {
    return concepts[bestMatch];
  }

  // Enhanced creative fallback
  const creativeAdjectives = ['Mysterious', 'Ancient', 'Legendary', 'Mystical', 'Cosmic', 'Radiant'];
  const creativeNouns = ['Guardian', 'Champion', 'Wanderer', 'Keeper', 'Sentinel', 'Spirit'];
  
  const randomAdjective = creativeAdjectives[Math.floor(Math.random() * creativeAdjectives.length)];
  const randomNoun = creativeNouns[Math.floor(Math.random() * creativeNouns.length)];

  return {
    title: `${randomAdjective} ${randomNoun}`,
    description: `A unique creation featuring ${objects.join(' and ')} with extraordinary characteristics.`,
    rarity: 'rare',
    tags: [...objects.slice(0, 3), 'unique', 'extraordinary', 'mysterious']
  };
};
