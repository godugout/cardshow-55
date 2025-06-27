
export interface SimpleDetectionResult {
  title: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary';
  tags: string[];
  confidence: number;
  detectionMethod: string;
  matchedKeywords: string[];
}

export class SimpleKeywordDetector {
  private wookieKeywords = [
    'wookiee', 'wookie', 'chewbacca', 'chewie',
    'furry humanoid', 'hairy humanoid', 'tall furry',
    'brown fur', 'bear humanoid', 'ape humanoid',
    'kashyyyk', 'galactic warrior'
  ];

  detectFromKeywords(inputText: string): SimpleDetectionResult {
    const lowerInput = inputText.toLowerCase();
    console.log('🔍 Simple keyword detection input:', lowerInput);
    
    const matchedKeywords: string[] = [];
    
    // Check for Wookie keywords
    for (const keyword of this.wookieKeywords) {
      if (lowerInput.includes(keyword)) {
        matchedKeywords.push(keyword);
      }
    }
    
    console.log('✅ Matched keywords:', matchedKeywords);
    
    if (matchedKeywords.length > 0) {
      console.log('🎯 WOOKIE DETECTED via keywords!');
      return {
        title: 'Galactic Guardian Wookiee',
        description: 'A legendary warrior from the forest moon of Kashyyyk, this mighty Wookiee stands tall with unwavering loyalty and incredible strength.',
        rarity: 'legendary',
        tags: ['wookiee', 'star-wars', 'warrior', 'loyal', 'strength', 'galactic', 'legendary'],
        confidence: 0.95,
        detectionMethod: 'keyword_match',
        matchedKeywords
      };
    }
    
    // Fallback for testing
    return {
      title: 'Unknown Entity',
      description: 'No matching keywords found in the input.',
      rarity: 'common',
      tags: ['unknown', 'test'],
      confidence: 0.3,
      detectionMethod: 'fallback',
      matchedKeywords: []
    };
  }
  
  // Test method to verify keyword detection works
  testKeywordDetection() {
    console.log('🧪 Testing keyword detection...');
    
    const testCases = [
      'wookiee warrior',
      'chewbacca pilot',
      'furry humanoid creature',
      'tall brown bear humanoid',
      'random unrelated text'
    ];
    
    testCases.forEach(testCase => {
      const result = this.detectFromKeywords(testCase);
      console.log(`Test: "${testCase}" -> ${result.title} (${result.confidence})`);
    });
  }
}

export const simpleKeywordDetector = new SimpleKeywordDetector();
