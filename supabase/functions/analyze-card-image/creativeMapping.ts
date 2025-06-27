
export const enhancedObjectToCardConcept = (objects: string[]) => {
  const concepts: { [key: string]: { title: string; description: string; rarity: string; tags: string[] } } = {
    // Star Wars Universe - Expanded
    'wookiee': {
      title: 'Galactic Warrior',
      description: 'A legendary being from distant worlds, known for fierce loyalty and incredible strength in battle.',
      rarity: 'legendary',
      tags: ['galactic', 'warrior', 'loyal', 'strength', 'legendary']
    },
    'chewbacca': {
      title: 'Millennium Falcon Co-Pilot',
      description: 'The most famous Wookiee in the galaxy, trusted companion and skilled pilot.',
      rarity: 'legendary',
      tags: ['star-wars', 'pilot', 'companion', 'millennium-falcon', 'rebel']
    },
    'ewok': {
      title: 'Forest Moon Guardian',
      description: 'Small but brave protectors of Endor, masters of guerrilla warfare.',
      rarity: 'rare',
      tags: ['star-wars', 'endor', 'forest', 'guardian', 'brave']
    },
    'jawa': {
      title: 'Desert Trader',
      description: 'Hooded scavengers of Tatooine, expert salvagers and technology dealers.',
      rarity: 'uncommon',
      tags: ['star-wars', 'tatooine', 'trader', 'scavenger', 'technology']
    },
    'tusken': {
      title: 'Sand People Warrior',
      description: 'Fierce nomadic raiders of the desert, masters of survival.',
      rarity: 'rare',
      tags: ['star-wars', 'warrior', 'desert', 'nomad', 'survivor']
    },
    'gamorrean': {
      title: 'Palace Guard',
      description: 'Brutish but loyal guards, known for their unwavering dedication.',
      rarity: 'uncommon',
      tags: ['star-wars', 'guard', 'loyal', 'strong', 'palace']
    },
    'rodian': {
      title: 'Bounty Hunter',
      description: 'Green-skinned trackers with exceptional hunting skills.',
      rarity: 'rare',
      tags: ['star-wars', 'bounty-hunter', 'tracker', 'skilled']
    },
    'twi\'lek': {
      title: 'Galactic Diplomat',
      description: 'Elegant beings known for their charm and political acumen.',
      rarity: 'rare',
      tags: ['star-wars', 'diplomat', 'elegant', 'charismatic']
    },

    // Fantasy Creatures - Expanded
    'dragon': {
      title: 'Ancient Wyrm',
      description: 'A legendary dragon of immense power, hoarder of treasures and ancient knowledge.',
      rarity: 'legendary',
      tags: ['fantasy', 'dragon', 'ancient', 'powerful', 'legendary']
    },
    'elf': {
      title: 'Woodland Ranger',
      description: 'An elegant forest dweller with supernatural archery skills and magical abilities.',
      rarity: 'rare',
      tags: ['fantasy', 'elf', 'ranger', 'magical', 'elegant']
    },
    'dwarf': {
      title: 'Mountain Forge Master',
      description: 'A stout warrior-craftsman known for legendary weapons and unwavering courage.',
      rarity: 'uncommon',
      tags: ['fantasy', 'dwarf', 'warrior', 'craftsman', 'mountain']
    },
    'orc': {
      title: 'Savage Raider',
      description: 'A fierce warrior from the wastelands, master of brutal combat.',
      rarity: 'common',
      tags: ['fantasy', 'orc', 'warrior', 'savage', 'brutal']
    },
    'goblin': {
      title: 'Cave Lurker',
      description: 'A cunning small creature that thrives in darkness and chaos.',
      rarity: 'common',
      tags: ['fantasy', 'goblin', 'cunning', 'sneaky', 'cave']
    },
    'troll': {
      title: 'Stone Bridge Guardian',
      description: 'A massive creature of stone and sinew, ancient guardian of sacred places.',
      rarity: 'rare',
      tags: ['fantasy', 'troll', 'guardian', 'massive', 'ancient']
    },
    'phoenix': {
      title: 'Eternal Flame',
      description: 'A magnificent bird of fire that embodies rebirth and eternal life.',
      rarity: 'legendary',
      tags: ['fantasy', 'phoenix', 'fire', 'eternal', 'rebirth']
    },
    'unicorn': {
      title: 'Pure Spirit',
      description: 'A mystical horse with healing powers, symbol of purity and magic.',
      rarity: 'legendary',
      tags: ['fantasy', 'unicorn', 'pure', 'mystical', 'healing']
    },
    'centaur': {
      title: 'Forest Sage',
      description: 'Half-human, half-horse beings renowned for wisdom and archery mastery.',
      rarity: 'rare',
      tags: ['fantasy', 'centaur', 'sage', 'wisdom', 'archery']
    },
    'griffin': {
      title: 'Sky Sovereign',
      description: 'A majestic creature combining the might of a lion with the freedom of an eagle.',
      rarity: 'rare',
      tags: ['fantasy', 'griffin', 'majestic', 'sky', 'noble']
    },

    // Mythological Beings
    'angel': {
      title: 'Divine Messenger',
      description: 'A celestial being of pure light, bearer of divine will and protection.',
      rarity: 'legendary',
      tags: ['mythological', 'angel', 'divine', 'celestial', 'protector']
    },
    'demon': {
      title: 'Infernal Lord',
      description: 'A dark entity from the underworld with terrible powers and cunning intellect.',
      rarity: 'rare',
      tags: ['mythological', 'demon', 'infernal', 'dark', 'cunning']
    },
    'vampire': {
      title: 'Blood Aristocrat',
      description: 'An undead noble with supernatural powers and an eternal thirst for life.',
      rarity: 'rare',
      tags: ['mythological', 'vampire', 'undead', 'aristocrat', 'supernatural']
    },
    'werewolf': {
      title: 'Moon-Cursed Beast',
      description: 'A human cursed to transform under moonlight, torn between two natures.',
      rarity: 'rare',
      tags: ['mythological', 'werewolf', 'cursed', 'beast', 'transformation']
    },
    'sphinx': {
      title: 'Riddle Guardian',
      description: 'An ancient being who guards secrets through riddles and divine wisdom.',
      rarity: 'legendary',
      tags: ['mythological', 'sphinx', 'guardian', 'riddles', 'wisdom']
    },

    // Animals - Enhanced
    'bear': {
      title: 'Forest Titan',
      description: 'A powerful bear with immense strength and protective instincts for its territory.',
      rarity: 'rare',
      tags: ['animal', 'bear', 'powerful', 'protector', 'forest']
    },
    'wolf': {
      title: 'Pack Alpha',
      description: 'A fierce wolf with natural leadership and unwavering pack loyalty.',
      rarity: 'uncommon',
      tags: ['animal', 'wolf', 'alpha', 'leader', 'loyal']
    },
    'lion': {
      title: 'Savanna Monarch',
      description: 'The undisputed king of beasts, ruler of the African plains.',
      rarity: 'rare',
      tags: ['animal', 'lion', 'king', 'monarch', 'majestic']
    },
    'tiger': {
      title: 'Striped Predator',
      description: 'A solitary hunter with deadly grace and unmistakable power.',
      rarity: 'rare',
      tags: ['animal', 'tiger', 'predator', 'hunter', 'powerful']
    },
    'eagle': {
      title: 'Sky Sovereign',
      description: 'A majestic bird of prey with unmatched vision and aerial mastery.',
      rarity: 'uncommon',
      tags: ['animal', 'eagle', 'sovereign', 'predator', 'majestic']
    },
    'shark': {
      title: 'Ocean Apex',
      description: 'The ultimate marine predator, perfectly evolved for underwater dominance.',
      rarity: 'rare',
      tags: ['animal', 'shark', 'apex', 'predator', 'ocean']
    },
    'elephant': {
      title: 'Gentle Colossus',
      description: 'A massive creature renowned for intelligence, memory, and gentle wisdom.',
      rarity: 'rare',
      tags: ['animal', 'elephant', 'gentle', 'intelligent', 'wise']
    },
    'whale': {
      title: 'Ocean Leviathan',
      description: 'The largest creature on Earth, a gentle giant of the deep seas.',
      rarity: 'legendary',
      tags: ['animal', 'whale', 'leviathan', 'gentle', 'massive']
    },

    // Common Animals
    'cat': {
      title: 'Feline Mystic',
      description: 'A mysterious cat with ancient wisdom and magical abilities.',
      rarity: 'rare',
      tags: ['feline', 'mystic', 'magical', 'wisdom', 'guardian']
    },
    'dog': {
      title: 'Loyal Companion',
      description: 'A faithful guardian with unwavering loyalty and protective instincts.',
      rarity: 'uncommon',
      tags: ['canine', 'loyal', 'companion', 'guardian', 'faithful']
    },
    'horse': {
      title: 'Noble Stallion',
      description: 'A majestic steed with grace, speed, and noble bearing.',
      rarity: 'uncommon',
      tags: ['equine', 'noble', 'stallion', 'graceful', 'swift']
    },
    'rabbit': {
      title: 'Swift Trickster',
      description: 'A quick and clever creature known for speed and cunning escapes.',
      rarity: 'common',
      tags: ['animal', 'rabbit', 'swift', 'clever', 'trickster']
    },

    // Sci-Fi Enhanced
    'robot': {
      title: 'Mechanical Sentinel',
      description: 'An advanced artificial being programmed for protection and service.',
      rarity: 'uncommon',
      tags: ['sci-fi', 'robot', 'mechanical', 'sentinel', 'advanced']
    },
    'android': {
      title: 'Synthetic Human',
      description: 'An artificial being with human appearance and advanced AI consciousness.',
      rarity: 'rare',
      tags: ['sci-fi', 'android', 'synthetic', 'artificial', 'advanced']
    },
    'cyborg': {
      title: 'Enhanced Warrior',
      description: 'A being augmented with cybernetic enhancements for superior capabilities.',
      rarity: 'rare',
      tags: ['sci-fi', 'cyborg', 'enhanced', 'warrior', 'augmented']
    },
    'alien': {
      title: 'Extraterrestrial Entity',
      description: 'A mysterious being from another world with unknown powers.',
      rarity: 'rare',
      tags: ['sci-fi', 'alien', 'extraterrestrial', 'mysterious', 'unknown']
    },

    // Generic Fallbacks
    'person': {
      title: 'Human Champion',
      description: 'A skilled individual with unique talents and unwavering determination.',
      rarity: 'uncommon',
      tags: ['human', 'champion', 'skilled', 'determined']
    },
    'warrior': {
      title: 'Battle Master',
      description: 'A seasoned combatant with exceptional fighting skills and tactical expertise.',
      rarity: 'rare',
      tags: ['warrior', 'battle', 'master', 'combat', 'tactical']
    },
    'mage': {
      title: 'Arcane Scholar',
      description: 'A wielder of mystical forces and keeper of ancient magical knowledge.',
      rarity: 'rare',
      tags: ['mage', 'arcane', 'scholar', 'mystical', 'knowledge']
    },

    // Pattern-based entries
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
    }
  };

  const mainObject = objects[0]?.toLowerCase() || 'unknown';
  
  // Enhanced pattern matching with fuzzy logic
  const patterns = [
    { keywords: ['fur', 'brown', 'tall', 'humanoid'], match: 'wookiee' },
    { keywords: ['hairy', 'standing', 'large'], match: 'wookiee' },
    { keywords: ['bear', 'upright', 'bipedal'], match: 'wookiee' },
    { keywords: ['furry', 'giant', 'warrior'], match: 'wookiee' },
    { keywords: ['small', 'hood', 'desert'], match: 'jawa' },
    { keywords: ['green', 'hunter', 'reptilian'], match: 'rodian' },
    { keywords: ['wings', 'fire', 'large'], match: 'dragon' },
    { keywords: ['pointed', 'ears', 'bow'], match: 'elf' },
    { keywords: ['short', 'beard', 'axe'], match: 'dwarf' },
    { keywords: ['horn', 'horse', 'white'], match: 'unicorn' },
    { keywords: ['mane', 'roar', 'golden'], match: 'lion' },
    { keywords: ['stripes', 'orange', 'predator'], match: 'tiger' }
  ];

  // Try pattern matching first
  for (const pattern of patterns) {
    if (pattern.keywords.some(keyword => objects.join(' ').toLowerCase().includes(keyword))) {
      if (concepts[pattern.match]) {
        return concepts[pattern.match];
      }
    }
  }

  // Direct object matching with partial matches
  const bestMatch = Object.keys(concepts).find(key => 
    mainObject.includes(key) || key.includes(mainObject) ||
    objects.some(obj => obj.toLowerCase().includes(key) || key.includes(obj.toLowerCase()))
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
