
// Enhanced creative mapping from detected objects to trading card concepts
export function enhancedObjectToCardConcept(detectedObjects: string[]) {
  console.log('🎨 Creating card concept from objects:', detectedObjects);
  
  if (!detectedObjects || detectedObjects.length === 0) {
    return getRandomCreativeCard();
  }
  
  const primaryObject = detectedObjects[0].toLowerCase();
  console.log('🎯 Primary object for card generation:', primaryObject);
  
  // Enhanced object mapping with more variety
  const objectMappings: { [key: string]: Array<{title: string, description: string}> } = {
    // Animals
    'cat': [
      { title: 'Feline Guardian', description: 'A mystical cat with ancient wisdom and protective powers.' },
      { title: 'Shadow Cat', description: 'A sleek feline that moves between dimensions with grace.' },
      { title: 'Mystic Feline', description: 'A magical cat blessed with supernatural abilities.' }
    ],
    'dog': [
      { title: 'Loyal Companion', description: 'A faithful guardian with unwavering loyalty and courage.' },
      { title: 'Alpha Wolf', description: 'A powerful canine leader with pack instincts.' },
      { title: 'Spirit Hound', description: 'A mystical dog connected to the spiritual realm.' }
    ],
    'bird': [
      { title: 'Sky Sentinel', description: 'A majestic bird soaring through endless skies.' },
      { title: 'Wind Rider', description: 'A graceful avian master of aerial combat.' },
      { title: 'Phoenix Rising', description: 'A legendary bird reborn from flames.' }
    ],
    'horse': [
      { title: 'Thunder Steed', description: 'A magnificent horse with the power of storms.' },
      { title: 'Wind Runner', description: 'A swift horse that races like the wind.' },
      { title: 'Spirit Horse', description: 'A mystical equine with otherworldly grace.' }
    ],
    
    // Vehicles
    'car': [
      { title: 'Speed Demon', description: 'A high-performance vehicle built for velocity.' },
      { title: 'Road Warrior', description: 'A powerful car ready for any challenge.' },
      { title: 'Thunder Machine', description: 'A mechanical marvel with roaring engines.' }
    ],
    'airplane': [
      { title: 'Sky Cruiser', description: 'A magnificent flying machine conquering the heavens.' },
      { title: 'Wind Rider', description: 'An aircraft dancing through clouds and storms.' },
      { title: 'Sky Guardian', description: 'A powerful plane protecting the airways.' }
    ],
    'ship': [
      { title: 'Ocean Master', description: 'A mighty vessel ruling the seven seas.' },
      { title: 'Wave Crusher', description: 'A ship that conquers the wildest storms.' },
      { title: 'Deep Explorer', description: 'A vessel seeking treasures in ocean depths.' }
    ],
    
    // Objects
    'book': [
      { title: 'Tome of Wisdom', description: 'An ancient book containing forgotten knowledge.' },
      { title: 'Magic Codex', description: 'A mystical tome filled with powerful spells.' },
      { title: 'Scholar\'s Guide', description: 'A comprehensive book of academic excellence.' }
    ],
    'flower': [
      { title: 'Bloom of Power', description: 'A magical flower radiating natural energy.' },
      { title: 'Eternal Blossom', description: 'A flower that never wilts, symbol of persistence.' },
      { title: 'Nature\'s Gift', description: 'A beautiful bloom blessed by earth spirits.' }
    ],
    'mountain': [
      { title: 'Stone Guardian', description: 'An ancient mountain watching over the land.' },
      { title: 'Peak of Power', description: 'A towering mountain reaching toward the heavens.' },
      { title: 'Earth\'s Crown', description: 'A majestic mountain crowned with snow and glory.' }
    ],
    
    // Abstract/Creative
    'unique_creation': [
      { title: 'Artistic Vision', description: 'A unique creation born from pure imagination.' },
      { title: 'Creative Force', description: 'An original work expressing boundless creativity.' },
      { title: 'Inspired Masterpiece', description: 'A one-of-a-kind creation with artistic soul.' }
    ],
    'artistic_creation': [
      { title: 'Studio Master', description: 'An artistic creation from a visionary mind.' },
      { title: 'Creative Expression', description: 'A unique work embodying pure artistic spirit.' },
      { title: 'Artisan\'s Pride', description: 'A masterful creation crafted with skill and passion.' }
    ]
  };
  
  // Try exact matches first
  if (objectMappings[primaryObject]) {
    const options = objectMappings[primaryObject];
    const selected = options[Math.floor(Math.random() * options.length)];
    console.log('✅ Found exact match for:', primaryObject, '→', selected.title);
    return selected;
  }
  
  // Try partial matches
  for (const [key, options] of Object.entries(objectMappings)) {
    if (primaryObject.includes(key) || key.includes(primaryObject)) {
      const selected = options[Math.floor(Math.random() * options.length)];
      console.log('✅ Found partial match for:', primaryObject, '→', selected.title);
      return selected;
    }
  }
  
  // Generate creative title based on the object name
  const creativeTitles = [
    `${capitalizeFirst(primaryObject)} Champion`,
    `Legendary ${capitalizeFirst(primaryObject)}`,
    `${capitalizeFirst(primaryObject)} Master`,
    `Mystic ${capitalizeFirst(primaryObject)}`,
    `${capitalizeFirst(primaryObject)} Guardian`,
    `Epic ${capitalizeFirst(primaryObject)}`
  ];
  
  const randomTitle = creativeTitles[Math.floor(Math.random() * creativeTitles.length)];
  
  console.log('🎲 Generated creative title for:', primaryObject, '→', randomTitle);
  
  return {
    title: randomTitle,
    description: `A unique creation featuring ${primaryObject} with extraordinary characteristics and mystical properties.`
  };
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
}

function getRandomCreativeCard() {
  const creativeCards = [
    { title: 'Visionary Creator', description: 'An original masterpiece born from pure imagination.' },
    { title: 'Artistic Soul', description: 'A creative spirit expressing boundless artistic vision.' },
    { title: 'Master Craftsman', description: 'A skilled artisan creating works of lasting beauty.' },
    { title: 'Creative Genius', description: 'An innovative mind pushing the boundaries of art.' },
    { title: 'Inspired Artist', description: 'A passionate creator channeling divine inspiration.' }
  ];
  
  return creativeCards[Math.floor(Math.random() * creativeCards.length)];
}
