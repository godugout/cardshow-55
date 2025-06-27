
export function generateCreativeCardInfo(extractedData: any) {
  const subjects = extractedData.visualAnalysis?.subjects || extractedData.extractedText || ['mysterious entity'];
  const mainSubject = subjects[0] || 'mysterious entity';
  const mood = extractedData.visualAnalysis?.mood || 'Epic';
  const theme = extractedData.visualAnalysis?.theme || 'Adventure';
  
  let cardInfo;
  
  if (mainSubject.includes('wookiee') || mainSubject.includes('chewbacca')) {
    cardInfo = {
      title: 'Galactic Guardian',
      description: 'A legendary warrior from the forest moon, known throughout the galaxy for unwavering loyalty and incredible strength.',
      rarity: 'legendary',
      tags: ['galactic', 'warrior', 'loyal', 'strength', 'legendary', 'star-wars'],
      type: 'Legendary Warrior',
      series: 'Galactic Heroes',
      confidence: 0.85
    };
  } else if (mainSubject.includes('bear') || mainSubject.includes('furry')) {
    cardInfo = {
      title: 'Primal Guardian',
      description: `A powerful ${mainSubject} creature with ancient wisdom and fierce protective instincts.`,
      rarity: 'rare',
      tags: ['primal', 'guardian', 'ancient', 'wisdom', 'powerful'],
      type: 'Beast Guardian',
      series: 'Primal Forces',
      confidence: 0.75
    };
  } else {
    const epicAdjectives = ['Legendary', 'Mythical', 'Ancient', 'Cosmic', 'Ethereal', 'Radiant'];
    const epicNouns = ['Guardian', 'Champion', 'Sentinel', 'Warrior', 'Keeper', 'Oracle'];
    
    const adjective = epicAdjectives[Math.floor(Math.random() * epicAdjectives.length)];
    const noun = epicNouns[Math.floor(Math.random() * epicNouns.length)];
    
    cardInfo = {
      title: `${adjective} ${noun}`,
      description: `A remarkable entity embodying the essence of ${subjects.join(' and ')}.`,
      rarity: 'rare',
      tags: [...subjects.slice(0, 3), adjective.toLowerCase(), noun.toLowerCase(), 'extraordinary'],
      type: `${adjective} Being`,
      series: `${theme} Collection`,
      confidence: 0.7
    };
  }

  return JSON.stringify(cardInfo);
}
