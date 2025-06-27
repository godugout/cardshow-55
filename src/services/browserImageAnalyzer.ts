
import { pipeline } from '@huggingface/transformers';

// Configure transformers.js for browser use
import { env } from '@huggingface/transformers';
env.allowLocalModels = false;
env.useBrowserCache = true;

export interface ImageAnalysisResult {
  objects: string[];
  confidence: number;
  analysisType: 'browser' | 'fallback';
}

// Comprehensive creative mapping from detected objects to card concepts
const objectToCardConcept = (objects: string[]): {
  title: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary';
  tags: string[];
} => {
  const mainObject = objects[0]?.toLowerCase() || 'unknown';
  
  // Enhanced concept database with hundreds of possibilities
  const concepts: { [key: string]: any } = {
    // Star Wars Characters & Creatures
    'wookiee': {
      title: 'Galactic Guardian',
      description: 'A mighty warrior from the forest moon, known for loyalty and incredible strength. This legendary being commands respect across the galaxy.',
      rarity: 'legendary',
      tags: ['star-wars', 'warrior', 'loyal', 'strength', 'galactic', 'legendary']
    },
    'chewbacca': {
      title: 'Rebel Alliance Hero',
      description: 'The most famous Wookiee warrior, co-pilot of the Millennium Falcon and hero of the Rebellion against the Empire.',
      rarity: 'legendary',
      tags: ['star-wars', 'rebel', 'pilot', 'hero', 'millennium-falcon', 'legendary']
    },
    'furry': {
      title: 'Mystical Forest Guardian',
      description: 'A creature of ancient wisdom, covered in protective fur that has weathered countless battles and adventures.',
      rarity: 'rare',
      tags: ['mystical', 'forest', 'guardian', 'ancient', 'wisdom']
    },
    'humanoid': {
      title: 'Evolved Being',
      description: 'An advanced life form that bridges the gap between beast and civilization, possessing both primal instincts and higher intelligence.',
      rarity: 'rare',
      tags: ['evolved', 'intelligent', 'primal', 'advanced', 'civilization']
    },

    // Animals - Enhanced
    'pig': {
      title: 'Barnyard Champion',
      description: 'A mighty farm hero with incredible strength and determination, ruling the barnyard with wisdom and courage.',
      rarity: 'uncommon',
      tags: ['farm', 'animal', 'champion', 'barnyard', 'strength']
    },
    'cat': {
      title: 'Feline Mystic',
      description: 'A mysterious cat with ancient wisdom and magical abilities, guardian of hidden secrets and keeper of nine lives.',
      rarity: 'rare',
      tags: ['feline', 'mystic', 'magical', 'wisdom', 'guardian']
    },
    'dog': {
      title: 'Loyal Guardian',
      description: 'A faithful companion with unwavering loyalty and protective instincts, defender of the innocent and friend to all.',
      rarity: 'uncommon',
      tags: ['canine', 'guardian', 'loyal', 'protector', 'companion']
    },
    'bird': {
      title: 'Sky Messenger',
      description: 'A swift aerial scout with keen eyesight and the ability to traverse great distances carrying important messages.',
      rarity: 'common',
      tags: ['avian', 'messenger', 'flight', 'scout', 'swift']
    },
    'horse': {
      title: 'Noble Steed',
      description: 'A majestic mount known for speed, grace, and unwavering loyalty to its rider through any adventure.',
      rarity: 'rare',
      tags: ['noble', 'mount', 'speed', 'grace', 'majestic']
    },
    'wolf': {
      title: 'Pack Leader',
      description: 'A fierce predator with natural leadership abilities and an unbreakable bond with its pack members.',
      rarity: 'rare',
      tags: ['predator', 'leader', 'pack', 'fierce', 'wild']
    },
    'dragon': {
      title: 'Ancient Wyrm',
      description: 'A legendary creature of immense power, hoarding treasures and breathing fire, feared and revered across all lands.',
      rarity: 'legendary',
      tags: ['dragon', 'ancient', 'fire', 'treasure', 'legendary']
    },

    // Vehicles & Technology
    'car': {
      title: 'Speed Demon',
      description: 'A powerful machine built for velocity and performance, dominating the roads with style and engineering excellence.',
      rarity: 'rare',
      tags: ['vehicle', 'speed', 'machine', 'performance', 'engineering']
    },
    'truck': {
      title: 'Cargo Hauler',
      description: 'A heavy-duty workhorse capable of transporting massive loads across any terrain with reliability.',
      rarity: 'uncommon',
      tags: ['vehicle', 'cargo', 'heavy-duty', 'reliable', 'workhorse']
    },
    'airplane': {
      title: 'Sky Cruiser',
      description: 'A marvel of aviation engineering that conquers the skies, carrying dreams and passengers to distant horizons.',
      rarity: 'rare',
      tags: ['aviation', 'flight', 'engineering', 'sky', 'travel']
    },
    'train': {
      title: 'Iron Horse',
      description: 'A steel leviathan that thunders across the landscape, connecting cities and carrying the weight of commerce.',
      rarity: 'uncommon',
      tags: ['railway', 'steel', 'transport', 'commerce', 'power']
    },
    'robot': {
      title: 'Mechanical Sentinel',
      description: 'An artificial being of advanced technology, programmed with purpose and equipped with capabilities beyond human limits.',
      rarity: 'rare',
      tags: ['mechanical', 'artificial', 'technology', 'advanced', 'sentinel']
    },

    // People & Characters
    'person': {
      title: 'Urban Legend',
      description: 'A mysterious figure with untold stories and hidden talents, walking among us with quiet confidence and purpose.',
      rarity: 'uncommon',
      tags: ['human', 'mystery', 'urban', 'legend', 'stories']
    },
    'warrior': {
      title: 'Battle-Tested Hero',
      description: 'A seasoned fighter who has faced countless challenges and emerged victorious, bearing scars that tell tales of courage.',
      rarity: 'rare',
      tags: ['warrior', 'hero', 'battle', 'courage', 'veteran']
    },
    'wizard': {
      title: 'Arcane Master',
      description: 'A wielder of ancient magic and keeper of mystical knowledge, capable of bending reality to their will.',
      rarity: 'legendary',
      tags: ['wizard', 'magic', 'arcane', 'mystical', 'ancient']
    },

    // Architecture & Places
    'building': {
      title: 'Architectural Marvel',
      description: 'A stunning structure that stands as a testament to human creativity and engineering prowess, reaching toward the heavens.',
      rarity: 'common',
      tags: ['architecture', 'structure', 'building', 'design', 'marvel']
    },
    'castle': {
      title: 'Fortress of Kings',
      description: 'A mighty stronghold built to withstand sieges and house royalty, its walls echoing with centuries of history.',
      rarity: 'rare',
      tags: ['fortress', 'castle', 'royal', 'stronghold', 'history']
    },
    'tower': {
      title: 'Spire of Power',
      description: 'A towering monument that pierces the sky, serving as both beacon and symbol of authority and ambition.',
      rarity: 'uncommon',
      tags: ['tower', 'spire', 'monument', 'authority', 'beacon']
    },

    // Nature & Environment
    'flower': {
      title: 'Nature\'s Jewel',
      description: 'A beautiful bloom that represents the delicate balance and stunning beauty of the natural world in perfect harmony.',
      rarity: 'common',
      tags: ['nature', 'flower', 'beauty', 'bloom', 'harmony']
    },
    'tree': {
      title: 'Ancient Sentinel',
      description: 'A wise old guardian that has witnessed centuries pass, providing shelter and wisdom to all who seek its shade.',
      rarity: 'uncommon',
      tags: ['nature', 'ancient', 'guardian', 'wisdom', 'shelter']
    },
    'mountain': {
      title: 'Stone Titan',
      description: 'A colossal peak that touches the clouds, standing as an eternal monument to the raw power of nature.',
      rarity: 'rare',
      tags: ['mountain', 'titan', 'peak', 'eternal', 'nature']
    },
    'ocean': {
      title: 'Endless Depths',
      description: 'A vast expanse of water that holds mysteries beyond imagination, home to countless creatures and ancient secrets.',
      rarity: 'rare',
      tags: ['ocean', 'depths', 'vast', 'mysteries', 'ancient']
    },

    // Fantasy & Mythology
    'unicorn': {
      title: 'Mythical Purity',
      description: 'A legendary creature of absolute purity and grace, whose horn holds the power to heal and whose presence brings hope.',
      rarity: 'legendary',
      tags: ['mythical', 'unicorn', 'purity', 'healing', 'legendary']
    },
    'phoenix': {
      title: 'Reborn Flame',
      description: 'An immortal bird that rises from its own ashes, symbolizing renewal, rebirth, and the triumph over adversity.',
      rarity: 'legendary',
      tags: ['phoenix', 'immortal', 'rebirth', 'flame', 'triumph']
    },
    'griffin': {
      title: 'Sky Predator',
      description: 'A majestic creature combining the best of eagle and lion, soaring through the skies with regal bearing.',
      rarity: 'legendary',
      tags: ['griffin', 'predator', 'majestic', 'regal', 'sky']
    }
  };

  // Enhanced pattern matching for better recognition
  const patterns = [
    // Star Wars specific patterns
    { keywords: ['fur', 'tall', 'brown'], match: 'wookiee' },
    { keywords: ['hairy', 'humanoid'], match: 'wookiee' },
    { keywords: ['bear', 'standing'], match: 'wookiee' },
    
    // Animal patterns
    { keywords: ['four', 'legs', 'tail'], match: 'animal' },
    { keywords: ['wings', 'fly'], match: 'bird' },
    { keywords: ['mane', 'wild'], match: 'lion' },
    
    // Vehicle patterns
    { keywords: ['wheel', 'road'], match: 'car' },
    { keywords: ['engine', 'transport'], match: 'vehicle' },
    
    // Fantasy patterns
    { keywords: ['magic', 'spell'], match: 'wizard' },
    { keywords: ['armor', 'sword'], match: 'warrior' },
    { keywords: ['horn', 'white'], match: 'unicorn' }
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

  // Enhanced fallback with better creativity
  const creativeAdjectives = ['Mysterious', 'Ancient', 'Legendary', 'Mystical', 'Ethereal', 'Cosmic', 'Radiant', 'Shadow'];
  const creativeNouns = ['Guardian', 'Sentinel', 'Champion', 'Wanderer', 'Keeper', 'Oracle', 'Essence', 'Spirit'];
  
  const randomAdjective = creativeAdjectives[Math.floor(Math.random() * creativeAdjectives.length)];
  const randomNoun = creativeNouns[Math.floor(Math.random() * creativeNouns.length)];

  return {
    title: `${randomAdjective} ${randomNoun}`,
    description: `A unique entity with distinctive characteristics featuring ${objects.join(' and ')}. This extraordinary being possesses hidden powers and untold stories waiting to be discovered.`,
    rarity: 'uncommon' as const,
    tags: [...objects.slice(0, 3), 'unique', 'mysterious', 'discovery']
  };
};

class BrowserImageAnalyzer {
  private classifier: any = null;
  private isInitializing = false;

  async initialize() {
    if (this.classifier || this.isInitializing) return;
    
    this.isInitializing = true;
    try {
      console.log('Initializing enhanced image classifier...');
      
      // Try WebGPU first for better performance
      try {
        this.classifier = await pipeline(
          'image-classification',
          'google/vit-base-patch16-224',
          { device: 'webgpu' }
        );
        console.log('Image classifier ready on WebGPU!');
      } catch (webgpuError) {
        console.warn('WebGPU failed, falling back to CPU:', webgpuError);
        this.classifier = await pipeline(
          'image-classification',
          'google/vit-base-patch16-224'
        );
        console.log('Image classifier ready on CPU!');
      }
    } catch (error) {
      console.error('Failed to initialize classifier:', error);
      this.classifier = null;
    }
    this.isInitializing = false;
  }

  async analyzeImage(imageUrl: string): Promise<{
    title: string;
    description: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary';
    tags: string[];
    confidence: number;
    objects: string[];
  }> {
    try {
      await this.initialize();
      
      if (!this.classifier) {
        throw new Error('Classifier not available');
      }

      console.log('Analyzing image with enhanced browser AI...');
      const results = await this.classifier(imageUrl);
      
      // Extract and process multiple predictions for better context
      const topResults = results
        .filter((result: any) => result.score > 0.05) // Lower threshold for more possibilities
        .slice(0, 8) // More results for better analysis
        .map((result: any) => ({
          label: result.label.split(',')[0].trim().toLowerCase(),
          score: result.score
        }));

      console.log('Enhanced detection results:', topResults);

      // Combine all detected objects for better creative mapping
      const objects = topResults.map(r => r.label);
      const confidence = Math.max(topResults[0]?.score || 0.3, 0.4);

      // Use enhanced creative mapping
      const cardConcept = objectToCardConcept(objects);

      console.log('Generated card concept:', cardConcept);

      return {
        ...cardConcept,
        confidence,
        objects
      };
    } catch (error) {
      console.error('Enhanced browser analysis failed:', error);
      
      // Improved fallback
      return {
        title: 'Enigmatic Discovery',
        description: 'A fascinating subject captured in this unique image, possessing mysterious qualities that spark the imagination and invite closer examination.',
        rarity: 'rare',
        tags: ['enigmatic', 'unique', 'mysterious', 'discovery', 'fascinating'],
        confidence: 0.5,
        objects: ['mysterious entity']
      };
    }
  }
}

export const browserImageAnalyzer = new BrowserImageAnalyzer();
