import React, { useEffect, useState } from 'react';

interface ThemedRansomNoteProps {
  children: string;
  theme: 'craft' | 'collect' | 'connect';
  className?: string;
}

interface LetterState {
  char: string;
  isAnimating: boolean;
  animationType: 'spell' | 'spin' | 'float' | 'glow';
  animationProgress: number;
  rotation: number;
  float: number;
  lean: number;
  glowIntensity: number;
  style: LetterStyle;
  shape: 'square' | 'wide' | 'tall' | 'skew';
  size: 'small' | 'medium' | 'large' | 'extra-large';
  isThemeWord: boolean;
  isTransparent: boolean;
  letterType: 'card' | 'transparent' | 'jersey';
  backgroundOffset: number;
  // Enhanced paper cut-out styling with material properties
  borderRadius: string;
  padding: string;
  margin: string;
  topOffset: number;
  leftOffset: number;
  zIndex: number;
  borderStyle: string;
  paperShadow: string;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  opacity: number;
  materialType: 'paper' | 'cardboard' | 'jersey' | 'gold' | 'chrome' | 'leather' | 'glass' | 'wood';
  scale: number;
  perspective: number;
  // Authentic ransom note properties
  materialSource: 'magazine-headline' | 'newspaper' | 'magazine-body' | 'advertisement' | 'book-page' | 'label';
  clipPath: string;
  overlayTexture: string;
  isOverlapping: boolean;
  shadowDepth: number;
}

interface LetterStyle {
  color: string;
  fontFamily: string;
  fontSize: string;
  backgroundColor: string;
  textShadow: string;
}

export const ThemedRansomNote: React.FC<ThemedRansomNoteProps> = ({ 
  children, 
  theme,
  className = "" 
}) => {
  const [letters, setLetters] = useState<LetterState[]>([]);
  const [animPhase, setAnimPhase] = useState(0);
  const [activeAnimations, setActiveAnimations] = useState<number[]>([]);
  const [animationKey, setAnimationKey] = useState(0);
  const [isSpellingOut, setIsSpellingOut] = useState(false);
  const [spellIndex, setSpellIndex] = useState(0);
  const [flippingLetters, setFlippingLetters] = useState<number[]>([]);
  const [lastAnimationTime, setLastAnimationTime] = useState<number[]>([]);

  // Theme-specific configurations with materials
  const getThemeConfig = (theme: 'craft' | 'collect' | 'connect') => {
    switch (theme) {
      case 'craft':
        return {
          colors: [
            '#ff1744', '#00e676', '#2196f3', '#ffeb3b', '#e91e63', '#9c27b0',
            '#ff5722', '#00bcd4', '#ff0080', '#00ff80', '#8000ff', '#ff4000',
            '#ffd700', '#ff6b35', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
            '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#a55eea',
            '#2ed573', '#ff4757', '#3742fa', '#2f3542', '#57606f', '#ffffff'
          ],
          backgrounds: [
            { background: '#ff1744', pattern: 'electric-red', material: 'paper' },
            { background: '#00e676', pattern: 'neon-green', material: 'paper' },
            { background: '#2196f3', pattern: 'electric-blue', material: 'cardboard' },
            { background: '#ffeb3b', pattern: 'neon-yellow', material: 'paper' },
            { background: '#e91e63', pattern: 'hot-pink', material: 'paper' },
            { background: '#ffd700', pattern: 'gold', material: 'gold' },
            { background: '#ff6b35', pattern: 'orange', material: 'paper' },
            { background: '#4ecdc4', pattern: 'turquoise', material: 'paper' },
            { background: '#ffffff', pattern: 'white', material: 'paper' },
            { background: 'linear-gradient(45deg, #ff6b6b 0%, #ff8e53 100%)', pattern: 'vibrant-1', material: 'paper' },
            { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', pattern: 'electric-purple', material: 'paper' },
            { background: 'linear-gradient(45deg, #fa709a 0%, #fee140 100%)', pattern: 'sunset', material: 'paper' },
            // Chrome materials
            { background: 'linear-gradient(135deg, #c0c0c0 0%, #ffffff 50%, #c0c0c0 100%)', pattern: 'chrome', material: 'chrome' },
            { background: 'linear-gradient(90deg, #e8e8e8 0%, #ffffff 30%, #c0c0c0 70%, #e8e8e8 100%)', pattern: 'chrome-shine', material: 'chrome' },
            // Glass materials
            { background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)', pattern: 'glass', material: 'glass' },
            { background: 'linear-gradient(45deg, rgba(200,230,255,0.3) 0%, rgba(255,255,255,0.1) 100%)', pattern: 'glass-tint', material: 'glass' },
            // Wood materials
            { background: 'linear-gradient(90deg, #8B4513 0%, #A0522D 25%, #CD853F 50%, #DEB887 75%, #F4A460 100%)', pattern: 'oak-wood', material: 'wood' },
            { background: 'linear-gradient(45deg, #654321 0%, #8B4513 30%, #A0522D 70%, #CD853F 100%)', pattern: 'walnut-wood', material: 'wood' },
            { background: 'linear-gradient(180deg, #F4A460 0%, #DEB887 25%, #D2B48C 50%, #BC9A6A 75%, #8B7D6B 100%)', pattern: 'pine-wood', material: 'wood' },
            { background: 'linear-gradient(135deg, #722F37 0%, #A0522D 25%, #CD853F 50%, #D2691E 75%, #FF7F50 100%)', pattern: 'cherry-wood', material: 'wood' },
            // Leather materials
            { background: 'linear-gradient(45deg, #654321 0%, #8B4513 50%, #A0522D 100%)', pattern: 'brown-leather', material: 'leather' },
            { background: 'linear-gradient(135deg, #2F1B14 0%, #5D4037 50%, #8D6E63 100%)', pattern: 'dark-leather', material: 'leather' }
          ],
          fonts: [
            'Impact', 'Arial Black', 'Helvetica Bold', 'Bebas Neue', 'Anton',
            'Oswald', 'Squada One', 'Russo One', 'Exo 2', 'Orbitron'
          ]
        };
      
      case 'collect':
        return {
          colors: [
            '#8b4513', '#daa520', '#cd853f', '#d2691e', '#a0522d', '#f4a460',
            '#000000', '#1a1a1a', '#333333', '#4a4a4a', '#696969', '#ffffff',
            '#f5f5dc', '#faebd7', '#fff8dc'
          ],
          backgrounds: [
            { background: '#f5f5dc', pattern: 'vintage-paper', material: 'paper' },
            { background: '#faebd7', pattern: 'antique-white', material: 'paper' },
            { background: '#daa520', pattern: 'golden', material: 'gold' },
            { background: '#cd853f', pattern: 'peru', material: 'cardboard' },
            { background: '#8b4513', pattern: 'saddle-brown', material: 'cardboard' },
            { background: 'linear-gradient(45deg, #f5f5dc 0%, #f0f0f0 25%, #f5f5dc 50%, #e8e8e8 75%, #f5f5dc 100%)', pattern: 'newspaper', material: 'paper' },
            { background: 'linear-gradient(90deg, #fff8dc 0%, #faebd7 50%, #fff8dc 100%)', pattern: 'vintage-paper', material: 'paper' },
            { background: 'linear-gradient(180deg, #fffacd 0%, #f0e68c 100%)', pattern: 'aged-paper', material: 'paper' },
            { background: '#2f2f2f', pattern: 'dark-vintage', material: 'cardboard' },
            { background: '#1a1a1a', pattern: 'old-black', material: 'cardboard' },
            // Wood materials for collect theme
            { background: 'linear-gradient(90deg, #8B4513 0%, #A0522D 25%, #CD853F 50%, #DEB887 75%, #F4A460 100%)', pattern: 'oak-wood', material: 'wood' },
            { background: 'linear-gradient(45deg, #654321 0%, #8B4513 30%, #A0522D 70%, #CD853F 100%)', pattern: 'walnut-wood', material: 'wood' },
            { background: 'linear-gradient(180deg, #F4A460 0%, #DEB887 25%, #D2B48C 50%, #BC9A6A 75%, #8B7D6B 100%)', pattern: 'pine-wood', material: 'wood' },
            { background: 'linear-gradient(135deg, #722F37 0%, #A0522D 25%, #CD853F 50%, #D2691E 75%, #FF7F50 100%)', pattern: 'cherry-wood', material: 'wood' },
            // Leather materials
            { background: 'linear-gradient(45deg, #654321 0%, #8B4513 50%, #A0522D 100%)', pattern: 'brown-leather', material: 'leather' },
            { background: 'linear-gradient(135deg, #2F1B14 0%, #5D4037 50%, #8D6E63 100%)', pattern: 'dark-leather', material: 'leather' }
          ],
          fonts: [
            'Georgia', 'Times New Roman', 'Garamond', 'Palatino', 'Book Antiqua',
            'Courier New', 'Monaco', 'Rockwell', 'Century', 'Minion Pro'
          ]
        };
      
      case 'connect':
        return {
          colors: [
            '#00ffff', '#ff00ff', '#00ff00', '#0080ff', '#ff0080', '#80ff00',
            '#ffffff', '#000000', '#c0c0c0', '#808080', '#404040',
            '#39ff14', '#ff073a', '#9400d3', '#00ced1', '#ff1493',
            '#ff6600', '#33cc33', '#0099ff', '#cc0099', '#ffff00'
          ],
          backgrounds: [
            { background: '#00ffff', pattern: 'cyber-cyan', material: 'glass' },
            { background: '#ff00ff', pattern: 'digital-magenta', material: 'glass' },
            { background: '#39ff14', pattern: 'neon-green', material: 'chrome' },
            { background: '#000000', pattern: 'digital-black', material: 'cardboard' },
            { background: '#ffffff', pattern: 'pixel-white', material: 'paper' },
            { background: 'repeating-conic-gradient(from 0deg at 50% 50%, #00ffff 0deg 90deg, #000000 90deg 180deg)', pattern: 'pixel-blocks', material: 'cardboard' },
            { background: 'repeating-linear-gradient(90deg, #ff00ff 0px, #ff00ff 8px, #000000 8px, #000000 16px)', pattern: 'pixel-stripes', material: 'cardboard' },
            { background: 'repeating-linear-gradient(45deg, #39ff14 0px, #39ff14 4px, #000000 4px, #000000 8px)', pattern: 'diagonal-pixels', material: 'cardboard' },
            { background: '#2a2a2a', pattern: 'dark-block', material: 'cardboard' },
            { background: '#404040', pattern: 'grey-block', material: 'cardboard' },
            { background: '#1a1a2e', pattern: 'navy-block', material: 'cardboard' },
            { background: '#0f3460', pattern: 'blue-block', material: 'cardboard' },
            { background: 'linear-gradient(90deg, #000000 0%, #404040 100%)', pattern: 'subtle-fade', material: 'cardboard' }
          ],
          jerseyPatterns: [
            { background: 'radial-gradient(circle at 30% 30%, #ff6600 2px, transparent 2px), radial-gradient(circle at 70% 70%, #ff6600 2px, transparent 2px)', pattern: 'basketball-dimples', color: '#ff6600', material: 'jersey' },
            { background: 'repeating-linear-gradient(45deg, #8b4513 0px, #8b4513 2px, #a0522d 2px, #a0522d 4px)', pattern: 'football-leather', color: '#8b4513', material: 'jersey' },
            { background: 'repeating-conic-gradient(from 0deg, #000000 0deg 60deg, #ffffff 60deg 120deg)', pattern: 'soccer-hexagon', color: '#000000', material: 'jersey' },
            { background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(255,255,255,0.1) 1px, rgba(255,255,255,0.1) 2px)', pattern: 'jersey-mesh', color: '#00ffff', material: 'jersey' },
            { background: 'repeating-linear-gradient(90deg, #0099ff 0px, #0099ff 10px, #ffffff 10px, #ffffff 20px)', pattern: 'team-stripes', color: '#0099ff', material: 'jersey' },
            { background: 'linear-gradient(45deg, #39ff14 25%, transparent 25%), linear-gradient(-45deg, #39ff14 25%, transparent 25%)', pattern: 'athletic-fabric', color: '#39ff14', material: 'jersey' }
          ],
          fonts: [
            'Courier New', 'Monaco', 'Consolas', 'Lucida Console', 'Menlo',
            'Orbitron', 'Rajdhani', 'Russo One', 'Quantico', 'Michroma',
            'Impact', 'Arial Black', 'Bebas Neue'
          ]
        };
    }
  };

  const themeConfig = getThemeConfig(theme);

  // Generate authentic material source types
  const generateMaterialSource = (): 'magazine-headline' | 'newspaper' | 'magazine-body' | 'advertisement' | 'book-page' | 'label' => {
    const sources = ['magazine-headline', 'newspaper', 'magazine-body', 'advertisement', 'book-page', 'label'] as const;
    return sources[Math.floor(Math.random() * sources.length)];
  };

  // Generate authentic material backgrounds based on source type
  const generateMaterialBackground = (source: string) => {
    const sourceBackgrounds = {
      'magazine-headline': [
        { background: '#ff1744', pattern: 'magazine-headline-red', material: 'paper' },
        { background: '#2196f3', pattern: 'magazine-headline-blue', material: 'paper' },
        { background: '#ffeb3b', pattern: 'magazine-headline-yellow', material: 'paper' },
        { background: '#000000', pattern: 'magazine-headline-black', material: 'paper' },
        { background: 'linear-gradient(45deg, #ff6b6b 0%, #ff8e53 100%)', pattern: 'magazine-gradient', material: 'paper' }
      ],
      'newspaper': [
        { background: '#f5f5dc', pattern: 'newspaper-cream', material: 'paper' },
        { background: '#ffffff', pattern: 'newspaper-white', material: 'paper' },
        { background: '#faebd7', pattern: 'newspaper-antique', material: 'paper' },
        { background: 'linear-gradient(180deg, #fffacd 0%, #f0e68c 100%)', pattern: 'aged-paper', material: 'paper' }
      ],
      'magazine-body': [
        { background: '#ffffff', pattern: 'magazine-white', material: 'paper' },
        { background: '#f8f8f8', pattern: 'magazine-light-gray', material: 'paper' },
        { background: '#e3f2fd', pattern: 'magazine-light-blue', material: 'paper' },
        { background: '#fff3e0', pattern: 'magazine-cream', material: 'paper' }
      ],
      'advertisement': [
        { background: '#ff0080', pattern: 'ad-hot-pink', material: 'paper' },
        { background: '#00ff80', pattern: 'ad-bright-green', material: 'paper' },
        { background: '#8000ff', pattern: 'ad-purple', material: 'paper' },
        { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', pattern: 'ad-gradient', material: 'paper' }
      ],
      'book-page': [
        { background: '#fffacd', pattern: 'book-cream', material: 'paper' },
        { background: '#f0e68c', pattern: 'book-aged', material: 'paper' },
        { background: '#fdf5e6', pattern: 'book-old-lace', material: 'paper' }
      ],
      'label': [
        { background: '#ffffff', pattern: 'label-white', material: 'paper' },
        { background: '#f0f0f0', pattern: 'label-gray', material: 'paper' },
        { background: '#ffff99', pattern: 'label-yellow', material: 'paper' }
      ]
    };
    
    const backgrounds = sourceBackgrounds[source as keyof typeof sourceBackgrounds] || sourceBackgrounds['magazine-headline'];
    return backgrounds[Math.floor(Math.random() * backgrounds.length)];
  };

  // Generate clip-path with word-based analysis for round/oval distribution
  const generateClipPath = (letterIndex: number, char: string, wordIndex: number, hasRoundInWord: boolean): string => {
    // Check if this should be round/oval (max 1 per word, very rare)
    const shouldBeRound = !hasRoundInWord && Math.random() < 0.08; // 8% chance
    
    if (shouldBeRound) {
      return generateRoundOval();
    }
    
    return generateFourSided();
  };

  const generateRoundOval = (): string => {
    const isCircle = Math.random() < 0.6; // 60% circles, 40% ovals
    const centerX = 50;
    const centerY = 50;
    
    if (isCircle) {
      const radius = 40 + Math.random() * 5; // 40-45% radius for full letter visibility
      return `circle(${radius}% at ${centerX}% ${centerY}%)`;
    } else {
      // Oval
      const radiusX = 40 + Math.random() * 8; // 40-48%
      const radiusY = 35 + Math.random() * 10; // 35-45%
      return `ellipse(${radiusX}% ${radiusY} at ${centerX}% ${centerY}%)`;
    }
  };

  const generateFourSided = (): string => {
    // Create varied shapes: squares, rectangles, balanced diamonds (no narrow verticals)
    const shapeTypes = ['square', 'tall-rect', 'wide-rect', 'diamond'];
    const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    
    const centerX = 50;
    const centerY = 50;
    
    switch (shapeType) {
      case 'square':
        const size = 80 + Math.random() * 10; // 80-90% for full letter visibility
        const rotation = [-5, -3, 0, 3, 5][Math.floor(Math.random() * 5)]; // Reduced tilt degrees
        const rad = (rotation * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        
        // Rotate square corners around center
        const corners = [
          [-size/2, -size/2], [size/2, -size/2], [size/2, size/2], [-size/2, size/2]
        ].map(([x, y]) => [
          centerX + (x * cos - y * sin),
          centerY + (x * sin + y * cos)
        ]);
        
        return `polygon(${corners.map(([x, y]) => `${Math.max(1, Math.min(99, x))}% ${Math.max(1, Math.min(99, y))}%`).join(', ')})`;
        
      case 'tall-rect':
        const tallWidth = 70 + Math.random() * 15; // 70-85% width
        const tallHeight = 85 + Math.random() * 10; // 85-95% height
        return `polygon(${centerX - tallWidth/2}% ${centerY - tallHeight/2}%, ${centerX + tallWidth/2}% ${centerY - tallHeight/2}%, ${centerX + tallWidth/2}% ${centerY + tallHeight/2}%, ${centerX - tallWidth/2}% ${centerY + tallHeight/2}%)`;
        
      case 'wide-rect':
        const wideWidth = 85 + Math.random() * 10; // 85-95% width
        const wideHeight = 70 + Math.random() * 15; // 70-85% height
        return `polygon(${centerX - wideWidth/2}% ${centerY - wideHeight/2}%, ${centerX + wideWidth/2}% ${centerY - wideHeight/2}%, ${centerX + wideWidth/2}% ${centerY + wideHeight/2}%, ${centerX - wideWidth/2}% ${centerY + wideHeight/2}%)`;
        
      case 'diamond':
        // Balanced diamond (no narrow vertical diamonds)
        const diamondWidth = 75 + Math.random() * 15; // 75-90% width
        const diamondHeight = 75 + Math.random() * 15; // 75-90% height (balanced proportions)
        return `polygon(${centerX}% ${centerY - diamondHeight/2}%, ${centerX + diamondWidth/2}% ${centerY}%, ${centerX}% ${centerY + diamondHeight/2}%, ${centerX - diamondWidth/2}% ${centerY}%)`;
        
      default:
        return `polygon(${centerX - 40}% ${centerY - 40}%, ${centerX + 40}% ${centerY - 40}%, ${centerX + 40}% ${centerY + 40}%, ${centerX - 40}% ${centerY + 40}%)`;
    }
  };

  // Generate overlay texture based on material source
  const generateOverlayTexture = (materialSource?: string): string => {
    if (!materialSource) return 'none';
    switch (materialSource) {
      case 'magazine-headline':
        return 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.05) 100%)'; // Glossy finish
      case 'newspaper':
        return 'radial-gradient(circle at 20% 30%, rgba(0,0,0,0.05) 1px, transparent 1px), radial-gradient(circle at 80% 70%, rgba(0,0,0,0.03) 1px, transparent 1px)'; // Print dots
      case 'magazine-body':
        return 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(0,0,0,0.03) 100%)'; // Subtle paper texture
      case 'advertisement':
        return 'linear-gradient(45deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.05) 100%)'; // Shiny ad paper
      case 'book-page':
        return 'repeating-linear-gradient(0deg, transparent 0px, transparent 15px, rgba(0,0,0,0.02) 15px, rgba(0,0,0,0.02) 16px)'; // Book lines
      case 'label':
        return 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)'; // Label gloss
      default:
        return 'none';
    }
  };

  // Generate letter shape
  const generateLetterShape = (): 'square' | 'wide' | 'tall' | 'skew' => {
    const shapes = ['square', 'wide', 'tall', 'skew'] as const;
    return shapes[Math.floor(Math.random() * shapes.length)];
  };

  // Generate transparency pattern - 2-3 letters per word
  const generateTransparencyPattern = (text: string): boolean[] => {
    const words = text.split(' ');
    const pattern: boolean[] = [];
    
    words.forEach(word => {
      const wordLength = word.length;
      const transparentCount = Math.min(3, Math.max(2, Math.floor(wordLength * 0.3)));
      const transparentIndices = new Set<number>();
      
      // Select random positions for transparent letters
      while (transparentIndices.size < transparentCount && transparentIndices.size < wordLength) {
        transparentIndices.add(Math.floor(Math.random() * wordLength));
      }
      
      for (let i = 0; i < wordLength; i++) {
        pattern.push(transparentIndices.has(i));
      }
      
      // Add space
      if (word !== words[words.length - 1]) {
        pattern.push(false);
      }
    });
    
    return pattern;
  };

  // Generate letter type (card, transparent, jersey)
  const generateLetterType = (index: number, isTransparent: boolean): 'card' | 'transparent' | 'jersey' => {
    if (isTransparent) return 'transparent';
    
    // For connect theme, add jersey materials
    if (theme === 'connect' && Math.random() < 0.25) {
      return 'jersey';
    }
    
    return 'card';
  };

  // Generate letter size with mixed distribution
  const generateLetterSize = (index: number, totalLetters: number): 'small' | 'medium' | 'large' | 'extra-large' => {
    // Limit extra-large letters to 1-2 per word
    const extraLargeChance = Math.random() < 0.15 && index % 3 === 0 ? 'extra-large' : null;
    if (extraLargeChance) return 'extra-large';
    
    const sizes = ['small', 'medium', 'large'] as const;
    const weights = [0.3, 0.5, 0.2]; // More medium, some small, fewer large
    const random = Math.random();
    
    if (random < weights[0]) return 'small';
    if (random < weights[0] + weights[1]) return 'medium';
    return 'large';
  };

  // Detect theme words for special highlighting
  const detectThemeWord = (text: string, index: number): boolean => {
    const lowerText = text.toLowerCase();
    const themeWords = {
      craft: ['craft', 'reality'],
      collect: ['collect', 'memories'],
      connect: ['connect', 'creators']
    };
    
    const targetWords = themeWords[theme];
    for (const word of targetWords) {
      const wordIndex = lowerText.indexOf(word);
      if (wordIndex !== -1 && index >= wordIndex && index < wordIndex + word.length) {
        return true;
      }
    }
    return false;
  };

  // Generate material border radius based on material type
  const generateMaterialBorderRadius = (materialType: 'paper' | 'cardboard' | 'jersey' | 'gold' | 'chrome' | 'leather' | 'glass' | 'wood'): string => {
    switch (materialType) {
      case 'paper':
        return `${Math.random() * 3 + 1}px`; // 1-4px for paper
      case 'cardboard':
        return `${Math.random() * 2 + 2}px`; // 2-4px for cardboard
      case 'jersey':
        return `${Math.random() * 4 + 2}px`; // 2-6px for jersey
      case 'gold':
      case 'chrome':
        return `${Math.random() * 2 + 3}px`; // 3-5px for metals
      case 'leather':
        return `${Math.random() * 3 + 2}px`; // 2-5px for leather
      case 'glass':
        return `${Math.random() * 4 + 1}px`; // 1-5px for glass
      case 'wood':
        return `${Math.random() * 2 + 1}px`; // 1-3px for wood
      default:
        return `${Math.random() * 3 + 2}px`;
    }
  };

  // Use colored letters directly instead of just black/white
  const getRandomColor = (): string => {
    return themeConfig.colors[Math.floor(Math.random() * themeConfig.colors.length)];
  };

  const getContrastingColor = (bgColor: string): string => {
    // 60% chance to use colored letters, 40% chance for contrast
    if (Math.random() < 0.6) {
      return getRandomColor();
    }
    
    if (bgColor.includes('gradient') || bgColor.includes('repeating')) {
      return Math.random() > 0.5 ? '#ffffff' : '#000000';
    }
    
    // Theme-specific contrast logic
    if (theme === 'collect') {
      const lightBgs = ['#f5f5dc', '#faebd7', '#fff8dc', '#fffacd', '#f0e68c'];
      const isDark = !lightBgs.some(color => bgColor.includes(color));
      return isDark ? '#ffffff' : '#000000';
    }
    
    if (theme === 'connect') {
      const darkBgs = ['#000000', '#1a1a1a', '#404040'];
      const isDark = darkBgs.some(color => bgColor.includes(color));
      return isDark ? '#00ffff' : '#000000';
    }
    
    // Default craft theme
    return Math.random() > 0.5 ? '#ffffff' : '#000000';
  };

  // Generate font based on material source
  const getFontForSource = (source: string): string => {
    const sourceFonts = {
      'magazine-headline': ['Impact', 'Arial Black', 'Bebas Neue', 'Anton', 'Oswald'],
      'newspaper': ['Times New Roman', 'Georgia', 'serif'],
      'magazine-body': ['Arial', 'Helvetica', 'Verdana', 'sans-serif'],
      'advertisement': ['Impact', 'Arial Black', 'Futura', 'Helvetica Bold'],
      'book-page': ['Times New Roman', 'Garamond', 'Palatino', 'Book Antiqua'],
      'label': ['Arial', 'Helvetica', 'Verdana', 'Calibri']
    };
    
    const fonts = sourceFonts[source as keyof typeof sourceFonts] || themeConfig.fonts;
    return fonts[Math.floor(Math.random() * fonts.length)];
  };

  const generateLetterStyle = (letterType: 'card' | 'transparent' | 'jersey' = 'card', materialSource?: string): { style: LetterStyle; materialType: 'paper' | 'cardboard' | 'jersey' | 'gold' | 'chrome' | 'leather' | 'glass' | 'wood' } => {
    let bgStyle: any, textColor: string, materialType: 'paper' | 'cardboard' | 'jersey' | 'gold' | 'chrome' | 'leather' | 'glass' | 'wood';
    
    if (letterType === 'transparent') {
      // Transparent letters have no background
      bgStyle = { background: 'transparent', pattern: 'transparent', material: 'paper' };
      textColor = getRandomColor();
      materialType = 'paper';
    } else if (letterType === 'jersey' && theme === 'connect' && themeConfig.jerseyPatterns) {
      // Jersey patterns for connect theme
      bgStyle = themeConfig.jerseyPatterns[Math.floor(Math.random() * themeConfig.jerseyPatterns.length)];
      textColor = getContrastingColor(bgStyle.background);
      materialType = (bgStyle as any).material || 'jersey';
    } else {
      // Generate authentic material backgrounds based on source
      bgStyle = generateMaterialBackground(materialSource || 'magazine-headline');
      textColor = getContrastingColor(bgStyle.background);
      materialType = (bgStyle as any).material || 'paper';
    }

    // Enhanced shadow effects with depth layering
    const getTextShadowForType = (type: 'card' | 'transparent' | 'jersey') => {
      if (type === 'transparent') {
        // Layered shadows for transparent letters to create depth
        return [
          '2px 2px 4px rgba(0,0,0,0.8), 4px 4px 8px rgba(0,0,0,0.6), 6px 6px 12px rgba(0,0,0,0.4)',
          '1px 1px 3px rgba(0,0,0,0.9), 3px 3px 6px rgba(0,0,0,0.7), 5px 5px 10px rgba(0,0,0,0.5)',
          '3px 3px 0px rgba(0,0,0,0.8), 6px 6px 8px rgba(0,0,0,0.6), 9px 9px 15px rgba(0,0,0,0.4)'
        ];
      }
      
      return [
        'none',
        '2px 2px 4px rgba(0,0,0,0.3)',
        '1px 1px 2px rgba(255,255,255,0.8)',
        '0 0 3px rgba(0,0,0,0.5)',
        'inset 0 1px 0 rgba(255,255,255,0.2)',
        '3px 3px 0px rgba(0,0,0,0.4), 6px 6px 8px rgba(0,0,0,0.2)',
        '2px 2px 0px rgba(255,255,255,0.3), 4px 4px 6px rgba(0,0,0,0.3)',
        '1px 1px 0px rgba(0,0,0,0.5), 2px 2px 0px rgba(0,0,0,0.3), 3px 3px 0px rgba(0,0,0,0.2)',
      ];
    };

    const shadowOptions = getTextShadowForType(letterType);
    const fontFamily = getFontForSource(materialSource || 'magazine-headline');

    return {
      style: {
        color: textColor,
        fontFamily: fontFamily,
        fontSize: `${1.0 + Math.random() * 0.5}em`,
        backgroundColor: bgStyle.background,
        textShadow: shadowOptions[Math.floor(Math.random() * shadowOptions.length)]
      },
      materialType
    };
  };

  useEffect(() => {
    const initializeLetters = () => {
      // Make letters case agnostic - randomly mix uppercase and lowercase
      const processedText = children.split('').map(char => {
        if (char === ' ') return char;
        return Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase();
      }).join('');
      
      // Generate transparency pattern
      const transparencyPattern = generateTransparencyPattern(children);
      
      // Allow more letters to have sharp angles (enhanced for fun physics)
      const totalLetters = processedText.length;
      const sharpAngleIndices = new Set<number>();
      const numSharpAngles = Math.min(4, Math.max(2, Math.floor(totalLetters * 0.3))); // 2-4 letters
      
      while (sharpAngleIndices.size < numSharpAngles) {
        const randomIndex = Math.floor(Math.random() * totalLetters);
        if (processedText[randomIndex] !== ' ') {
          sharpAngleIndices.add(randomIndex);
        }
      }
      
      const newLetters = processedText.split('').map((char, index) => {
        const hasSharpAngle = sharpAngleIndices.has(index);
        const isThemeWord = detectThemeWord(children, index);
        const isTransparent = transparencyPattern[index] || false;
        const letterType = generateLetterType(index, isTransparent);
        const materialSource = generateMaterialSource();
        const { style, materialType } = generateLetterStyle(letterType, materialSource);
        
        // Generate authentic cutout properties  
        const clipPath = generateClipPath(index, char, 0, false); // Simplified for initial generation
        const overlayTexture = generateOverlayTexture(materialSource);
        
        // Enhanced overlapping logic
        const isOverlapping = index > 0 && Math.random() < 0.3; // 30% chance to overlap with previous letter
        const shadowDepth = Math.random() * 3 + 1; // 1-4 depth levels
        
        return {
          char,
          isAnimating: false,
          animationType: 'float' as const,
          animationProgress: 0,
          rotation: hasSharpAngle ? (Math.random() * 70 - 35) : (Math.random() * 24 - 12), // Sharp: ±35°, Normal: ±12°
          float: Math.random() * 2,
          lean: hasSharpAngle ? (Math.random() * 20 - 10) : (Math.random() * 8 - 4), // Enhanced lean
          glowIntensity: 0.5 + Math.random() * 0.5,
          style,
          shape: generateLetterShape(),
          size: generateLetterSize(index, totalLetters),
          isThemeWord,
          isTransparent,
          letterType,
          backgroundOffset: char === ' ' ? 0 : 0,
          materialType,
          // Enhanced paper cut-out styling with material-specific shapes
          borderRadius: generateMaterialBorderRadius(materialType),
          padding: index % 3 === 0 ? `${Math.random() * 15 + 12}px ${Math.random() * 18 + 14}px` : `${Math.random() * 8 + 6}px ${Math.random() * 10 + 8}px`, // Smart padding for visibility
          margin: `${Math.random() * 3 + 2}px ${Math.random() * 4 + 3}px`, // Reduced margin to prevent excessive gaps
          topOffset: 0, // Fixed to 0 for consistent baseline alignment
          leftOffset: Math.random() * 4 - 2, // Reduced from ±5px to ±2px for better readability
          zIndex: Math.floor(Math.random() * 3) + 1, // Reduced layers from 5 to 3 for less chaos
          borderStyle: Math.random() > 0.6 ? `${Math.random() > 0.3 ? '2' : '1'}px ${Math.random() > 0.5 ? 'solid' : 'dashed'} rgba(0,0,0,0.${Math.floor(Math.random() * 4) + 1})` : 'none',
          paperShadow: Math.random() > 0.4 ? 
            `${Math.random() * 4 + 2}px ${Math.random() * 4 + 2}px ${Math.random() * 8 + 3}px rgba(0,0,0,0.${Math.floor(Math.random() * 4) + 2})` : 
            'none',
          fontWeight: Math.random() > 0.6 ? 'bold' : 'normal',
          fontStyle: Math.random() > 0.85 ? 'italic' : 'normal',
          textDecoration: Math.random() > 0.92 ? (Math.random() > 0.5 ? 'underline' : 'overline') : 'none',
          opacity: Math.random() > 0.9 ? 0.7 + Math.random() * 0.3 : 1,
          scale: 0.9 + Math.random() * 0.4, // Scale breathing effect
          perspective: Math.random() * 20 - 10, // 3D perspective rotation
          materialSource,
          clipPath,
          overlayTexture,
          isOverlapping,
          shadowDepth
        };
      });
      setLetters(newLetters);
      setLastAnimationTime(new Array(newLetters.length).fill(0));
    };

    initializeLetters();
  }, [children, theme]);

  useEffect(() => {
    if (isSpellingOut && spellIndex < letters.length) {
      const timer = setTimeout(() => {
        // Skip spaces but include them in the count for proper ordering
        if (letters[spellIndex].char !== ' ') {
          setActiveAnimations(prev => [...prev, spellIndex]);
        }
        setSpellIndex(prev => prev + 1);
      }, letters[spellIndex]?.char === ' ' ? 50 : 100); // Faster for spaces
      return () => clearTimeout(timer);
    } else if (isSpellingOut && spellIndex >= letters.length) {
      setTimeout(() => setIsSpellingOut(false), 1000);
    }
  }, [isSpellingOut, spellIndex, letters.length]);

  useEffect(() => {
    // Much slower, less distracting animations (50s main cycle, 700ms phase)
    const variationInterval = setInterval(() => {
      // 70% chance to skip animation completely for realistic feel
      if (Math.random() < 0.7) {
        return;
      }
      
      // Only spell-out animation occasionally
      if (Math.random() < 0.2) {
        setIsSpellingOut(true);
        setSpellIndex(0);
        setActiveAnimations([]);
        
        // Sequential animation timing for spelling out
        setLetters(prev => prev.map((letter, index) => {
          const { style, materialType } = generateLetterStyle(letter.letterType, letter.materialSource);
          return {
            ...letter,
            style,
            materialType,
            borderRadius: generateMaterialBorderRadius(materialType),
            clipPath: generateClipPath(index, letter.char, 0, false),
            // Regenerate cut-out properties for variety with less aggressive positioning
            padding: index % 3 === 0 ? `${Math.random() * 15 + 12}px ${Math.random() * 18 + 14}px` : `${Math.random() * 8 + 6}px ${Math.random() * 10 + 8}px`,
            margin: `${Math.random() * 3 + 2}px ${Math.random() * 4 + 3}px`,
            topOffset: 0, // Fixed to 0 for consistent baseline alignment
            leftOffset: (Math.random() - 0.5) * 2, // Reduced from 4 to 2
            zIndex: Math.floor(Math.random() * 3) + 1, // Limited to 3 levels
            scale: 0.9 + Math.random() * 0.4,
            perspective: Math.random() * 12 - 6 // Reduced perspective rotation for more upright letters
          };
        }));
      } else {
        // Animate only 1-2 random letters instead of all
        setLetters(prevLetters => {
          if (prevLetters.length === 0) return prevLetters;
          
          const newLetters = [...prevLetters];
          const currentTime = Date.now();
          
          // Select only 1-2 letters to animate, avoiding recently animated ones
          const availableIndices = prevLetters
            .map((_, index) => index)
            .filter(index => 
              !lastAnimationTime[index] || 
              (currentTime - lastAnimationTime[index]) > 60000 // 60 second cooldown
            );
          
          if (availableIndices.length === 0) return prevLetters;
          
          // Randomly select 1-2 letters from available ones
          const numToAnimate = Math.random() < 0.7 ? 1 : 2;
          const selectedIndices = [];
          
          for (let i = 0; i < numToAnimate && availableIndices.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableIndices.length);
            const selectedIndex = availableIndices.splice(randomIndex, 1)[0];
            selectedIndices.push(selectedIndex);
          }
          
          // Animate selected letters only
          selectedIndices.forEach(index => {
            const letter = prevLetters[index];
            const { style, materialType } = generateLetterStyle(letter.letterType, letter.materialSource);
            
            newLetters[index] = {
              ...letter,
              style,
              materialType,
              borderRadius: generateMaterialBorderRadius(materialType),
              clipPath: generateClipPath(index, letter.char, 0, false),
              // Less aggressive positioning for better visibility
              padding: index % 3 === 0 ? `${Math.random() * 15 + 12}px ${Math.random() * 18 + 14}px` : `${Math.random() * 8 + 6}px ${Math.random() * 10 + 8}px`,
              margin: `${Math.random() * 3 + 2}px ${Math.random() * 4 + 3}px`,
              topOffset: 0, // Fixed to 0 for consistent baseline alignment
              leftOffset: (Math.random() - 0.5) * 2, // Reduced from 4 to 2
              zIndex: Math.floor(Math.random() * 3) + 1, // Limited to 3 levels
              scale: 0.9 + Math.random() * 0.4,
              perspective: Math.random() * 20 - 10
            };
          });
          
          // Update animation times
          setLastAnimationTime(prev => {
            const newTimes = [...prev];
            selectedIndices.forEach(index => {
              newTimes[index] = currentTime;
            });
            return newTimes;
          });
          
          return newLetters;
        });
      }
    }, 50000); // Increased from 25s to 50s

    const phaseInterval = setInterval(() => {
      setAnimPhase(prev => prev + 1);
    }, 700); // Increased from 600ms to 700ms

    return () => {
      clearInterval(variationInterval);
      clearInterval(phaseInterval);
    };
  }, [theme, lastAnimationTime]);

  // Helper functions for styling
  const getSizeStyles = (size: string) => {
    switch (size) {
      case 'small':
        return { fontSize: '0.8em', shadow: '0 2px 4px rgba(0,0,0,0.1)' };
      case 'medium':
        return { fontSize: '1.0em', shadow: '0 3px 6px rgba(0,0,0,0.15)' };
      case 'large':
        return { fontSize: '1.3em', shadow: '0 4px 8px rgba(0,0,0,0.2)' };
      case 'extra-large':
        return { fontSize: '1.6em', shadow: '0 6px 12px rgba(0,0,0,0.25)' };
      default:
        return { fontSize: '1.0em', shadow: '0 3px 6px rgba(0,0,0,0.15)' };
    }
  };

  const getShapeStyles = (shape: string) => {
    switch (shape) {
      case 'square':
        return { borderRadius: '6px', transform: 'none' };
      case 'wide':
        return { borderRadius: '4px', transform: 'scaleX(1.2)' };
      case 'tall':
        return { borderRadius: '8px', transform: 'scaleY(1.2)' };
      case 'skew':
        return { borderRadius: '4px', transform: 'skewX(-8deg)' };
      default:
        return { borderRadius: '4px', transform: 'none' };
    }
  };

  // Enhanced floating movement with more amplitude
  const getLetterFloat = (index: number) => {
    return Math.sin(animPhase * 0.005 + index * 0.5) * 8; // Increased amplitude from 3px to 8px
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      style={{ 
        height: '3.5em',
        lineHeight: '1.4',
        fontWeight: 'bold',
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Letters container */}
      <div
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translateX(-50%) translateY(-50%)',
          whiteSpace: 'nowrap',
          display: 'inline-flex',
          alignItems: 'middle',
          letterSpacing: '0.1em',
          wordSpacing: '0.3em'
        }}
      >
        {letters.map((letter, index) => {
          if (letter.char === ' ') {
            return <span key={`${animationKey}-${index}`} style={{ marginRight: '0.5em' }}>\u00A0</span>;
          }

          const animationDelay = isSpellingOut ? index * 0.1 : Math.random() * 2;
          const isActive = activeAnimations.includes(index);
          const isFlipping = flippingLetters.includes(index);
          
          return (
            <span
              key={`${animationKey}-${index}`}
              className={`inline-block font-bold ${
                letter.isAnimating ? 'animate-bounce' : ''
              } ${
                letter.isThemeWord ? 'animate-pulse' : ''
              }`}
              style={{
                position: 'relative',
                display: 'inline-block',
                verticalAlign: 'middle',
                zIndex: letter.zIndex,
                fontSize: getSizeStyles(letter.size).fontSize,
                color: letter.style.color,
                fontFamily: letter.style.fontFamily,
                fontWeight: letter.fontWeight,
                fontStyle: letter.fontStyle,
                textDecoration: letter.textDecoration,
                textShadow: letter.style.textShadow,
                transform: `
                  rotate(${letter.rotation}deg) 
                  rotateX(${letter.perspective}deg)
                  scale(${letter.scale})
                  translateY(${getLetterFloat(index)}px)
                  translateX(${letter.leftOffset}px)
                  ${isFlipping ? 'rotateY(180deg)' : ''}
                `,
                transformOrigin: 'center center',
                transition: `all ${0.5 + Math.random() * 0.8}s cubic-bezier(0.68, -0.55, 0.265, 1.55)`, // Spring physics
                animationDelay: `${animationDelay}s`,
                willChange: 'transform', // GPU acceleration
                
                filter: `
                  brightness(${0.9 + Math.random() * 0.2}) 
                  contrast(${0.95 + Math.random() * 0.1})
                  ${letter.glowIntensity > 0.8 ? `drop-shadow(0 0 ${letter.glowIntensity * 3}px ${letter.style.color}40)` : ''}
                `,
                padding: letter.letterType !== 'transparent' ? letter.padding : '0',
                margin: letter.letterType !== 'transparent' ? letter.margin : '0.05em',
                background: letter.letterType !== 'transparent' ? letter.style.backgroundColor : 'transparent',
                borderRadius: letter.letterType !== 'transparent' ? letter.borderRadius : '0',
                border: letter.letterType !== 'transparent' ? letter.borderStyle : 'none',
                boxShadow: letter.letterType !== 'transparent' ? (letter.paperShadow !== 'none' ? letter.paperShadow : getSizeStyles(letter.size).shadow) : 'none',
                opacity: letter.opacity,
                clipPath: letter.clipPath
              }}
        >
          {letter.char}
          {/* Overlay texture for material authenticity */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: letter.overlayTexture,
              pointerEvents: 'none',
              borderRadius: letter.borderRadius,
              clipPath: letter.clipPath
            }}
          />
        </span>
          );
        })}
      </div>
    </div>
  );
};
