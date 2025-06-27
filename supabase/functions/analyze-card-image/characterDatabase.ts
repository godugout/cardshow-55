
// Comprehensive character database for trading card generation
export const CHARACTER_DATABASE = {
  // Star Wars Characters - Enhanced with pattern matching
  'yoda': {
    titles: ['Jedi Grand Master Yoda', 'Yoda the Wise', 'Master Yoda of Dagobah', 'The Ancient Jedi Master'],
    descriptions: [
      'Ancient Jedi Grand Master with 900 years of wisdom and unparalleled mastery of the Force.',
      'The wisest of all Jedi, small in stature but mighty in the Force, teacher to generations.',
      'From the swamps of Dagobah, this green sage holds the deepest secrets of the Force.',
      'The most powerful Jedi Master ever known, whose wisdom guides the destiny of the galaxy.'
    ],
    rarity: 'legendary',
    tags: ['jedi', 'star wars', 'force', 'master', 'wise', 'green', 'dagobah'],
    category: 'star_wars',
    patterns: ['green', 'small', 'ears', 'jedi', 'master', 'wise', 'yoda', 'force', 'dagobah']
  },
  'darth vader': {
    titles: ['Darth Vader, Dark Lord of the Sith', 'Vader the Fallen', 'The Dark Lord Vader', 'Sith Lord Darth Vader'],
    descriptions: [
      'Once the chosen one, now fallen to the dark side and encased in black mechanical armor.',
      'The Emperor\'s right hand, feared across the galaxy for his ruthless power and mechanical breathing.',
      'Former Anakin Skywalker, transformed by darkness into the most feared Sith Lord.',
      'Dark Lord of the Sith whose presence alone strikes terror into the hearts of rebels.'
    ],
    rarity: 'legendary',
    tags: ['sith', 'star wars', 'dark side', 'vader', 'empire', 'fallen', 'armor'],
    category: 'star_wars',
    patterns: ['mask', 'black', 'helmet', 'breathing', 'vader', 'darth', 'sith', 'armor', 'cape']
  },
  'luke skywalker': {
    titles: ['Luke Skywalker, Jedi Knight', 'The Last Hope', 'Skywalker the Hero', 'Jedi Master Luke'],
    descriptions: [
      'Young Jedi Knight who destroyed the Death Star and brought hope to the Rebellion.',
      'Son of Anakin Skywalker, destined to restore balance to the Force and redeem his father.',
      'The last hope of the Jedi Order, who learned the ways of the Force from Master Yoda.',
      'Hero of the Rebellion who proved that good can triumph over the darkest evil.'
    ],
    rarity: 'rare',
    tags: ['jedi', 'star wars', 'hero', 'rebellion', 'skywalker', 'hope', 'force'],
    category: 'star_wars',
    patterns: ['luke', 'jedi', 'young', 'blonde', 'lightsaber', 'rebel', 'skywalker', 'pilot']
  },
  'princess leia': {
    titles: ['Princess Leia Organa', 'General Leia', 'Rebel Leader Leia', 'Leia the Brave'],
    descriptions: [
      'Fearless leader of the Rebel Alliance and hidden Force-sensitive princess of Alderaan.',
      'Royal diplomat turned military leader, instrumental in the Empire\'s defeat.',
      'Princess of Alderaan whose courage and leadership inspired the Rebellion to victory.',
      'Force-sensitive leader who balanced royal dignity with fierce determination.'
    ],
    rarity: 'rare',
    tags: ['princess', 'star wars', 'rebellion', 'leader', 'force', 'alderaan', 'brave'],
    category: 'star_wars',
    patterns: ['leia', 'princess', 'buns', 'hair', 'white', 'rebel', 'leader', 'blaster']
  },
  'han solo': {
    titles: ['Han Solo', 'Captain Solo', 'Solo the Smuggler', 'The Millennium Falcon Captain'],
    descriptions: [
      'Charismatic smuggler captain of the Millennium Falcon, scoundrel with a heart of gold.',
      'Roguish pilot who helped the Rebellion defeat the Empire despite his better judgment.',
      'Fast-talking smuggler known for completing the Kessel Run in less than twelve parsecs.',
      'Reformed scoundrel who proved that even rogues can become heroes when it matters.'
    ],
    rarity: 'uncommon',
    tags: ['smuggler', 'star wars', 'pilot', 'falcon', 'rogue', 'captain', 'scoundrel'],
    category: 'star_wars',
    patterns: ['han', 'solo', 'smuggler', 'vest', 'blaster', 'falcon', 'pilot', 'cocky']
  },
  'chewbacca': {
    titles: ['Chewbacca the Loyal', 'Chewie the Wookiee Warrior', 'The Mighty Chewbacca', 'Wookiee Co-Pilot'],
    descriptions: [
      'Loyal Wookiee warrior and co-pilot of the Millennium Falcon, Han Solo\'s best friend.',
      'Fierce and noble Wookiee with incredible strength and unwavering loyalty.',
      'Courageous Wookiee fighter from Kashyyyk who fought in the Clone Wars and Galactic Civil War.',
      'The most loyal friend in the galaxy, whose roar strikes fear into enemies and comfort into allies.'
    ],
    rarity: 'uncommon',
    tags: ['wookiee', 'star wars', 'warrior', 'loyal', 'strength', 'kashyyyk', 'furry'],
    category: 'star_wars',
    patterns: ['chewbacca', 'chewie', 'wookiee', 'furry', 'tall', 'brown', 'roar', 'loyal']
  },
  // Add more characters...
  'r2d2': {
    titles: ['R2-D2', 'Artoo-Detoo', 'The Brave Little Droid', 'R2 the Astromech'],
    descriptions: [
      'Brave astromech droid who has served the Skywalker family across generations.',
      'Loyal droid companion whose courage and resourcefulness have saved the galaxy multiple times.',
      'The most famous droid in the galaxy, keeper of secrets and hero of the Rebellion.',
      'Astromech droid whose beeps and whistles hide the wisdom of ages.'
    ],
    rarity: 'uncommon',
    tags: ['droid', 'star wars', 'astromech', 'loyal', 'brave', 'robot', 'blue'],
    category: 'star_wars',
    patterns: ['r2d2', 'r2-d2', 'droid', 'blue', 'white', 'beeps', 'astromech', 'short']
  },
  'c3po': {
    titles: ['C-3PO', 'See-Threepio', 'Protocol Droid C-3PO', 'The Worried Droid'],
    descriptions: [
      'Protocol droid fluent in over six million forms of communication.',
      'Golden droid companion whose etiquette programming often conflicts with adventure.',
      'Fussy but faithful droid who has witnessed the rise and fall of the Empire.',
      'The most proper droid in the galaxy, always worried but ultimately loyal.'
    ],
    rarity: 'common',
    tags: ['droid', 'star wars', 'protocol', 'gold', 'worried', 'proper', 'etiquette'],
    category: 'star_wars',
    patterns: ['c3po', 'c-3po', 'droid', 'gold', 'protocol', 'tall', 'humanoid', 'worried']
  }
};

export function findCharacterMatch(text: string): any | null {
  const searchText = text.toLowerCase();
  console.log('🔍 Searching for character matches in:', searchText);
  
  // Direct character name matches
  for (const [key, character] of Object.entries(CHARACTER_DATABASE)) {
    // Check direct name match
    if (searchText.includes(key.replace('_', ' ')) || searchText.includes(key)) {
      console.log('✅ Direct name match found:', key);
      return { key, ...character };
    }
    
    // Check title matches
    if (character.titles.some(title => searchText.includes(title.toLowerCase()))) {
      console.log('✅ Title match found:', key);
      return { key, ...character };
    }
    
    // Enhanced pattern matching - require multiple pattern matches for accuracy
    const patternMatches = character.patterns.filter(pattern => 
      searchText.includes(pattern.toLowerCase())
    );
    
    if (patternMatches.length >= 2) {
      console.log('✅ Pattern match found:', key, 'with patterns:', patternMatches);
      return { key, ...character };
    }
  }
  
  // Special contextual matches for tricky cases
  if (searchText.includes('mask') && (searchText.includes('dark') || searchText.includes('black') || searchText.includes('helmet'))) {
    console.log('✅ Contextual match: Darth Vader (mask + dark/black)');
    return { key: 'darth vader', ...CHARACTER_DATABASE['darth vader'] };
  }
  
  if ((searchText.includes('green') && searchText.includes('small')) || 
      (searchText.includes('ears') && searchText.includes('wise')) ||
      (searchText.includes('jedi') && searchText.includes('master') && searchText.includes('old'))) {
    console.log('✅ Contextual match: Yoda (green + small or ears + wise)');
    return { key: 'yoda', ...CHARACTER_DATABASE['yoda'] };
  }
  
  console.log('❌ No character match found');
  return null;
}

export function generateCharacterCard(character: any) {
  const randomTitle = character.titles[Math.floor(Math.random() * character.titles.length)];
  const randomDescription = character.descriptions[Math.floor(Math.random() * character.descriptions.length)];
  
  console.log('🎲 Generated character card for:', character.key, '→', randomTitle);
  
  return {
    title: randomTitle,
    description: randomDescription,
    rarity: character.rarity,
    tags: character.tags,
    category: character.category
  };
}
