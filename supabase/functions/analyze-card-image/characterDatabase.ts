
// Comprehensive character database for trading card generation
export const CHARACTER_DATABASE = {
  // Star Wars Characters
  'yoda': {
    titles: ['Jedi Master Yoda', 'Grand Master Yoda', 'Yoda the Wise', 'Master Yoda'],
    descriptions: [
      'Legendary Jedi Master with 900 years of wisdom and Force mastery.',
      'The most powerful Jedi Master, teacher of Luke Skywalker.',
      'Ancient Jedi Grand Master known for his wisdom and lightsaber skills.',
      'Wise and powerful Force user from a mysterious species.'
    ],
    rarity: 'legendary',
    tags: ['jedi', 'star wars', 'force', 'master', 'wise'],
    category: 'star_wars'
  },
  'darth vader': {
    titles: ['Darth Vader', 'The Dark Lord', 'Vader the Fallen', 'Sith Lord Vader'],
    descriptions: [
      'Fallen Jedi Knight turned Sith Lord, master of the dark side.',
      'The chosen one corrupted by darkness and encased in mechanical armor.',
      'Powerful Sith Lord and enforcer of the Galactic Empire.',
      'Former Anakin Skywalker, now a terrifying force of evil.'
    ],
    rarity: 'legendary',
    tags: ['sith', 'star wars', 'dark side', 'vader', 'empire'],
    category: 'star_wars'
  },
  'luke skywalker': {
    titles: ['Luke Skywalker', 'Jedi Knight Luke', 'Skywalker Hero', 'The Last Hope'],
    descriptions: [
      'Young Jedi who destroyed the Death Star and redeemed his father.',
      'Hero of the Rebellion and the last hope for the Jedi Order.',
      'Force-sensitive pilot who became a legendary Jedi Knight.',
      'Son of Anakin Skywalker, destined to restore balance to the Force.'
    ],
    rarity: 'rare',
    tags: ['jedi', 'star wars', 'hero', 'rebellion', 'skywalker'],
    category: 'star_wars'
  },
  'princess leia': {
    titles: ['Princess Leia', 'General Leia Organa', 'Rebel Leader', 'Leia the Brave'],
    descriptions: [
      'Fearless leader of the Rebel Alliance and Force-sensitive princess.',
      'Royal leader who fought against the tyranny of the Empire.',
      'Brave princess who helped destroy the Death Star.',
      'Diplomatic leader with hidden Force abilities.'
    ],
    rarity: 'rare',
    tags: ['princess', 'star wars', 'rebellion', 'leader', 'force'],
    category: 'star_wars'
  },
  'han solo': {
    titles: ['Han Solo', 'Smuggler Captain', 'Solo the Rogue', 'Captain Solo'],
    descriptions: [
      'Charismatic smuggler captain of the Millennium Falcon.',
      'Roguish pilot who became a hero of the Rebellion.',
      'Fast-talking smuggler with a heart of gold.',
      'Expert pilot known for completing the Kessel Run.'
    ],
    rarity: 'uncommon',
    tags: ['smuggler', 'star wars', 'pilot', 'falcon', 'rogue'],
    category: 'star_wars'
  },
  'chewbacca': {
    titles: ['Chewbacca', 'Chewie the Loyal', 'Wookiee Warrior', 'The Mighty Chewbacca'],
    descriptions: [
      'Loyal Wookiee co-pilot and warrior companion.',
      'Fierce and noble Wookiee with incredible strength.',
      'Han Solo\'s faithful friend and skilled mechanic.',
      'Courageous Wookiee fighter from the planet Kashyyyk.'
    ],
    rarity: 'uncommon',
    tags: ['wookiee', 'star wars', 'warrior', 'loyal', 'strength'],
    category: 'star_wars'
  },
  // Marvel Characters
  'spider-man': {
    titles: ['Spider-Man', 'The Web-Slinger', 'Your Friendly Spider-Man', 'Spidey Hero'],
    descriptions: [
      'Friendly neighborhood hero with spider powers and quick wit.',
      'Web-slinging superhero protecting New York City.',
      'Young hero with spider abilities and great responsibility.',
      'Agile superhero known for his spider-sense and web-shooters.'
    ],
    rarity: 'rare',
    tags: ['marvel', 'spider', 'hero', 'web', 'new york'],
    category: 'marvel'
  },
  'iron man': {
    titles: ['Iron Man', 'Tony Stark', 'The Armored Avenger', 'Genius Billionaire'],
    descriptions: [
      'Genius inventor in a high-tech armored suit.',
      'Billionaire philanthropist and founding Avenger.',
      'Tech genius who built the Iron Man armor.',
      'Armored hero powered by arc reactor technology.'
    ],
    rarity: 'rare',
    tags: ['marvel', 'iron', 'tech', 'genius', 'avenger'],
    category: 'marvel'
  },
  // Add more characters as needed...
};

export function findCharacterMatch(text: string): any | null {
  const searchText = text.toLowerCase();
  
  // Direct character name matches
  for (const [key, character] of Object.entries(CHARACTER_DATABASE)) {
    if (searchText.includes(key) || 
        character.titles.some(title => searchText.includes(title.toLowerCase())) ||
        character.tags.some(tag => searchText.includes(tag))) {
      return { key, ...character };
    }
  }
  
  // Contextual matches
  if (searchText.includes('green') && searchText.includes('ears') && searchText.includes('small')) {
    return { key: 'yoda', ...CHARACTER_DATABASE['yoda'] };
  }
  
  if (searchText.includes('mask') && searchText.includes('black') && searchText.includes('breathing')) {
    return { key: 'darth vader', ...CHARACTER_DATABASE['darth vader'] };
  }
  
  return null;
}

export function generateCharacterCard(character: any) {
  const randomTitle = character.titles[Math.floor(Math.random() * character.titles.length)];
  const randomDescription = character.descriptions[Math.floor(Math.random() * character.descriptions.length)];
  
  return {
    title: randomTitle,
    description: randomDescription,
    rarity: character.rarity,
    tags: character.tags,
    category: character.category
  };
}
