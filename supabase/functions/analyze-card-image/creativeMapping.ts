
// Enhanced creative mapping for better character and object recognition
export interface CardConcept {
  title: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary';
  tags: string[];
}

const CHARACTER_PATTERNS = {
  // Star Wars patterns
  yoda: [
    'green', 'ears', 'small', 'jedi', 'master', 'wise', 'old', 'force',
    'lightsaber', 'dagobah', 'swamp', 'robes', 'staff', 'cane'
  ],
  'darth vader': [
    'mask', 'black', 'helmet', 'cape', 'breathing', 'sith', 'dark',
    'empire', 'armor', 'red lightsaber', 'chest panel'
  ],
  'luke skywalker': [
    'jedi', 'blonde', 'young', 'lightsaber', 'rebel', 'pilot',
    'tatooine', 'farmboy', 'x-wing'
  ],
  'princess leia': [
    'buns', 'hair', 'white dress', 'rebel', 'princess', 'leader',
    'blaster', 'alderan'
  ],
  'han solo': [
    'smuggler', 'vest', 'blaster', 'falcon', 'pilot', 'cocky',
    'scoundrel', 'carbonite'
  ],
  'chewbacca': [
    'wookiee', 'furry', 'tall', 'brown', 'bowcaster', 'roar',
    'hair', 'beast', 'loyal'
  ],
  'r2d2': [
    'droid', 'blue', 'white', 'beeps', 'astromech', 'short',
    'cylindrical', 'robot'
  ],
  'c3po': [
    'droid', 'gold', 'protocol', 'tall', 'humanoid', 'worried',
    'fussy', 'golden'
  ],
  // Marvel patterns
  'spider-man': [
    'web', 'red', 'blue', 'mask', 'spider', 'new york', 'hero',
    'wall crawler', 'spidey'
  ],
  'iron man': [
    'armor', 'red', 'gold', 'arc reactor', 'tony stark', 'tech',
    'suit', 'repulsors'
  ],
  'captain america': [
    'shield', 'star', 'red white blue', 'super soldier', 'steve rogers',
    'america', 'patriot'
  ],
  'hulk': [
    'green', 'big', 'angry', 'smash', 'muscles', 'bruce banner',
    'rage', 'strong'
  ],
  'thor': [
    'hammer', 'mjolnir', 'cape', 'asgard', 'god', 'thunder',
    'blonde', 'armor'
  ],
  'batman': [
    'cape', 'cowl', 'dark', 'gotham', 'bat', 'utility belt',
    'grappling hook', 'bruce wayne'
  ],
  'superman': [
    'cape', 'red', 'blue', 'S symbol', 'clark kent', 'flight',
    'strong', 'krypton'
  ]
};

const CREATIVE_TITLES = {
  // Enhanced Star Wars titles
  yoda: [
    'Jedi Grand Master Yoda',
    'Yoda the Wise',
    'Master Yoda of Dagobah',
    'The Ancient Jedi Master',
    'Yoda, Teacher of Jedi'
  ],
  'darth vader': [
    'Darth Vader, Dark Lord of the Sith',
    'Vader the Fallen',
    'The Dark Lord Vader',
    'Sith Lord Darth Vader',
    'Vader, Chosen One Turned Dark'
  ],
  'luke skywalker': [
    'Luke Skywalker, Jedi Knight',
    'The Last Hope',
    'Skywalker the Hero',
    'Jedi Master Luke',
    'Luke, Son of Anakin'
  ],
  // General object-based titles
  mask: [
    'The Mysterious Masked Figure',
    'Guardian of Secrets',
    'The Hidden Identity',
    'Masked Protector',
    'The Enigmatic One'
  ],
  sword: [
    'Legendary Blade Master',
    'The Sword Bearer',
    'Warrior of the Blade',
    'Ancient Swordsman',
    'Master of Steel'
  ],
  armor: [
    'The Armored Guardian',
    'Knight of Protection',
    'Defender in Steel',
    'The Shielded Warrior',
    'Armored Champion'
  ],
  robot: [
    'Mechanical Guardian',
    'The Steel Sentinel',
    'Robotic Protector',
    'Machine Warrior',
    'The Automated Hero'
  ],
  // Fallback creative titles
  unknown: [
    'The Mysterious Entity',
    'Guardian of the Unknown',
    'The Enigmatic Presence',
    'Keeper of Secrets',
    'The Hidden Power'
  ]
};

const CREATIVE_DESCRIPTIONS = {
  yoda: [
    'Ancient Jedi Master with 900 years of wisdom and unparalleled Force abilities.',
    'The wisest of all Jedi, teacher to generations of Force users.',
    'Small in stature but mighty in the Force, this legendary master guides all Jedi.',
    'From the swamps of Dagobah, this green sage holds the secrets of the Force.'
  ],
  'darth vader': [
    'Once the chosen one, now a dark lord consumed by the power of the Sith.',
    'Fallen Jedi Knight encased in black armor, breathing mechanically through the Force.',
    'The Emperor\'s right hand, feared across the galaxy for his ruthless power.',
    'Former Anakin Skywalker, now twisted by darkness and mechanical augmentation.'
  ],
  mask: [
    'A mysterious figure whose true identity remains hidden behind an enigmatic mask.',
    'The concealed guardian whose face is known to none but whose legend echoes through time.',
    'Behind this mask lies power unknown, secrets untold, and mysteries unsolved.',
    'A protector whose identity is sacred, whose purpose is noble, whose face is forbidden.'
  ],
  unknown: [
    'An enigmatic presence with powers beyond mortal comprehension.',
    'A mysterious entity whose origins are lost to time but whose influence shapes destiny.',
    'The guardian of secrets, keeper of ancient knowledge, protector of the unknown.',
    'A figure of legend whose true nature transcends ordinary understanding.'
  ]
};

export function enhancedObjectToCardConcept(detectedObjects: string[]): CardConcept {
  console.log('🎨 Creating card concept from objects:', detectedObjects);
  
  if (!detectedObjects || detectedObjects.length === 0) {
    return getFallbackConcept();
  }

  // Try to match against character patterns first
  const characterMatch = findCharacterByPatterns(detectedObjects);
  if (characterMatch) {
    console.log('🎭 Character match found:', characterMatch);
    return generateCharacterConcept(characterMatch);
  }

  // Use the primary detected object
  const primaryObject = detectedObjects[0].toLowerCase();
  console.log('🎯 Primary object for card generation:', primaryObject);

  // Generate concept based on primary object
  return generateObjectConcept(primaryObject);
}

function findCharacterByPatterns(detectedObjects: string[]): string | null {
  const searchTerms = detectedObjects.join(' ').toLowerCase();
  
  for (const [character, patterns] of Object.entries(CHARACTER_PATTERNS)) {
    const matchCount = patterns.filter(pattern => 
      searchTerms.includes(pattern.toLowerCase())
    ).length;
    
    // If we have multiple pattern matches, it's likely this character
    if (matchCount >= 2) {
      return character;
    }
    
    // Special case for unique identifiers
    if (patterns.some(pattern => searchTerms.includes(pattern) && pattern.length > 4)) {
      return character;
    }
  }
  
  return null;
}

function generateCharacterConcept(character: string): CardConcept {
  const titles = CREATIVE_TITLES[character] || CREATIVE_TITLES.unknown;
  const descriptions = CREATIVE_DESCRIPTIONS[character] || CREATIVE_DESCRIPTIONS.unknown;
  
  const randomTitle = titles[Math.floor(Math.random() * titles.length)];
  const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
  
  console.log('🎲 Generated creative title for:', character, '→', randomTitle);
  
  // Determine rarity based on character importance
  let rarity: 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary' = 'uncommon';
  
  if (['yoda', 'darth vader', 'luke skywalker'].includes(character)) {
    rarity = 'legendary';
  } else if (['han solo', 'princess leia', 'chewbacca', 'spider-man', 'iron man'].includes(character)) {
    rarity = 'rare';
  } else if (['r2d2', 'c3po', 'captain america', 'thor'].includes(character)) {
    rarity = 'uncommon';
  }

  return {
    title: randomTitle,
    description: randomDescription,
    rarity,
    tags: generateTagsForCharacter(character)
  };
}

function generateObjectConcept(object: string): CardConcept {
  const titles = CREATIVE_TITLES[object] || CREATIVE_TITLES.unknown;
  const descriptions = CREATIVE_DESCRIPTIONS[object] || CREATIVE_DESCRIPTIONS.unknown;
  
  const randomTitle = titles[Math.floor(Math.random() * titles.length)];
  const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
  
  return {
    title: randomTitle,
    description: randomDescription,
    rarity: 'uncommon',
    tags: [object, 'mysterious', 'legendary', 'unique']
  };
}

function generateTagsForCharacter(character: string): string[] {
  const baseTags = CHARACTER_PATTERNS[character]?.slice(0, 4) || ['mysterious'];
  
  // Add universe-specific tags
  if (['yoda', 'darth vader', 'luke skywalker', 'han solo', 'princess leia', 'chewbacca'].includes(character)) {
    baseTags.push('star wars', 'galaxy', 'force');
  } else if (['spider-man', 'iron man', 'captain america', 'hulk', 'thor'].includes(character)) {
    baseTags.push('marvel', 'superhero', 'avenger');
  } else if (['batman', 'superman'].includes(character)) {
    baseTags.push('dc', 'superhero', 'justice league');
  }
  
  return baseTags.slice(0, 6); // Limit to 6 tags
}

function getFallbackConcept(): CardConcept {
  const fallbackOptions = [
    {
      title: 'The Enigmatic Guardian',
      description: 'A mysterious protector whose true nature defies understanding.',
      rarity: 'rare' as const,
      tags: ['mysterious', 'guardian', 'enigmatic', 'powerful']
    },
    {
      title: 'Ancient Artifact',
      description: 'A relic of immense power from a forgotten civilization.',
      rarity: 'ultra-rare' as const,
      tags: ['ancient', 'artifact', 'power', 'forgotten']
    },
    {
      title: 'The Unknown Hero',
      description: 'A champion whose deeds echo through eternity, identity shrouded in legend.',
      rarity: 'legendary' as const,
      tags: ['hero', 'champion', 'legend', 'eternal']
    }
  ];
  
  return fallbackOptions[Math.floor(Math.random() * fallbackOptions.length)];
}
